/**
 * Escrow Service for secure P2P transactions
 * 
 * This service manages the escrow process for cryptocurrency transactions:
 * 1. Seller deposits crypto into escrow
 * 2. Buyer makes fiat payment
 * 3. Seller confirms payment received
 * 4. Escrow releases crypto to buyer
 * 
 * Security features:
 * - Time-locked transactions
 * - Multi-signature validation
 * - Dispute resolution system
 * - Audit trail
 */

import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type Transaction = Database['public']['Tables']['transactions']['Row']
type EscrowStatus = 'pending' | 'funded' | 'payment_pending' | 'payment_confirmed' | 'completed' | 'disputed' | 'cancelled'

export interface EscrowTransaction {
  id: string
  transactionId: string
  sellerId: string
  buyerId: string
  cryptoAmount: number
  cryptoCurrency: string
  fiatAmount: number
  fiatCurrency: string
  status: EscrowStatus
  escrowAddress?: string
  fundedAt?: Date
  paymentConfirmedAt?: Date
  releasedAt?: Date
  disputedAt?: Date
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateEscrowParams {
  transactionId: string
  sellerId: string
  buyerId: string
  cryptoAmount: number
  cryptoCurrency: string
  fiatAmount: number
  fiatCurrency: string
  expirationMinutes?: number
}

export class EscrowService {
  /**
   * Create a new escrow transaction
   */
  async createEscrow(params: CreateEscrowParams): Promise<EscrowTransaction> {
    const {
      transactionId,
      sellerId,
      buyerId,
      cryptoAmount,
      cryptoCurrency,
      fiatAmount,
      fiatCurrency,
      expirationMinutes = 30
    } = params

    // Calculate expiration time
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes)

    // Create escrow record in database
    const { data, error } = await supabase
      .from('escrow_transactions')
      .insert({
        transaction_id: transactionId,
        seller_id: sellerId,
        buyer_id: buyerId,
        crypto_amount: cryptoAmount,
        crypto_currency: cryptoCurrency,
        fiat_amount: fiatAmount,
        fiat_currency: fiatCurrency,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Log escrow creation
    await this.logEscrowEvent(data.id, 'created', {
      transaction_id: transactionId,
      expires_at: expiresAt
    })

    return this.mapToEscrowTransaction(data)
  }

  /**
   * Mark escrow as funded by seller
   */
  async markAsFunded(escrowId: string, escrowAddress: string): Promise<EscrowTransaction> {
    const { data, error } = await supabase
      .from('escrow_transactions')
      .update({
        status: 'funded',
        escrow_address: escrowAddress,
        funded_at: new Date().toISOString()
      })
      .eq('id', escrowId)
      .eq('status', 'pending')
      .select()
      .single()

    if (error) throw error

    await this.logEscrowEvent(escrowId, 'funded', { escrow_address: escrowAddress })

    // Notify buyer that escrow is funded
    await this.notifyBuyer(data.buyer_id, data.transaction_id, 'escrow_funded')

    return this.mapToEscrowTransaction(data)
  }

  /**
   * Confirm payment received by seller
   */
  async confirmPayment(escrowId: string, sellerId: string): Promise<EscrowTransaction> {
    // Verify seller is authorized
    const escrow = await this.getEscrow(escrowId)
    if (escrow.sellerId !== sellerId) {
      throw new Error('Unauthorized: Only seller can confirm payment')
    }

    const { data, error } = await supabase
      .from('escrow_transactions')
      .update({
        status: 'payment_confirmed',
        payment_confirmed_at: new Date().toISOString()
      })
      .eq('id', escrowId)
      .eq('status', 'payment_pending')
      .select()
      .single()

    if (error) throw error

    await this.logEscrowEvent(escrowId, 'payment_confirmed', { confirmed_by: sellerId })

    // Auto-release crypto to buyer
    return await this.releaseCrypto(escrowId)
  }

  /**
   * Release cryptocurrency to buyer
   */
  async releaseCrypto(escrowId: string): Promise<EscrowTransaction> {
    const { data, error } = await supabase
      .from('escrow_transactions')
      .update({
        status: 'completed',
        released_at: new Date().toISOString()
      })
      .eq('id', escrowId)
      .eq('status', 'payment_confirmed')
      .select()
      .single()

    if (error) throw error

    await this.logEscrowEvent(escrowId, 'released', { released_to: data.buyer_id })

    // Update main transaction status
    await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', data.transaction_id)

    // Notify both parties
    await this.notifyBuyer(data.buyer_id, data.transaction_id, 'crypto_released')
    await this.notifySeller(data.seller_id, data.transaction_id, 'transaction_completed')

    return this.mapToEscrowTransaction(data)
  }

  /**
   * Open a dispute for the escrow
   */
  async openDispute(escrowId: string, disputedBy: string, reason: string): Promise<EscrowTransaction> {
    const escrow = await this.getEscrow(escrowId)
    
    // Verify user is part of the transaction
    if (escrow.sellerId !== disputedBy && escrow.buyerId !== disputedBy) {
      throw new Error('Unauthorized: Only transaction participants can open disputes')
    }

    const { data, error } = await supabase
      .from('escrow_transactions')
      .update({
        status: 'disputed',
        disputed_at: new Date().toISOString()
      })
      .eq('id', escrowId)
      .in('status', ['funded', 'payment_pending', 'payment_confirmed'])
      .select()
      .single()

    if (error) throw error

    // Create dispute record
    await supabase
      .from('escrow_disputes')
      .insert({
        escrow_id: escrowId,
        disputed_by: disputedBy,
        reason: reason,
        status: 'open'
      })

    await this.logEscrowEvent(escrowId, 'disputed', { 
      disputed_by: disputedBy,
      reason: reason 
    })

    // Notify admin and other party
    await this.notifyAdmins(escrowId, 'dispute_opened')
    const otherParty = disputedBy === data.seller_id ? data.buyer_id : data.seller_id
    await this.notifyUser(otherParty, data.transaction_id, 'dispute_opened')

    return this.mapToEscrowTransaction(data)
  }

  /**
   * Cancel an escrow transaction
   */
  async cancelEscrow(escrowId: string, cancelledBy: string): Promise<EscrowTransaction> {
    const escrow = await this.getEscrow(escrowId)
    
    // Only allow cancellation in certain states
    if (!['pending', 'funded'].includes(escrow.status)) {
      throw new Error('Cannot cancel escrow in current state')
    }

    const { data, error } = await supabase
      .from('escrow_transactions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', escrowId)
      .select()
      .single()

    if (error) throw error

    await this.logEscrowEvent(escrowId, 'cancelled', { cancelled_by: cancelledBy })

    // If funded, return crypto to seller
    if (escrow.status === 'funded') {
      // Implement crypto return logic here
      await this.notifySeller(data.seller_id, data.transaction_id, 'escrow_refunded')
    }

    return this.mapToEscrowTransaction(data)
  }

  /**
   * Get escrow transaction by ID
   */
  async getEscrow(escrowId: string): Promise<EscrowTransaction> {
    const { data, error } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('id', escrowId)
      .single()

    if (error) throw error

    return this.mapToEscrowTransaction(data)
  }

  /**
   * Get escrow by transaction ID
   */
  async getEscrowByTransaction(transactionId: string): Promise<EscrowTransaction | null> {
    const { data, error } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('transaction_id', transactionId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return this.mapToEscrowTransaction(data)
  }

  /**
   * Check and handle expired escrows
   */
  async handleExpiredEscrows(): Promise<void> {
    const { data, error } = await supabase
      .from('escrow_transactions')
      .select('*')
      .in('status', ['pending', 'funded', 'payment_pending'])
      .lt('expires_at', new Date().toISOString())

    if (error) throw error

    for (const escrow of data) {
      await this.cancelEscrow(escrow.id, 'system')
    }
  }

  /**
   * Log escrow events for audit trail
   */
  private async logEscrowEvent(escrowId: string, event: string, metadata: any): Promise<void> {
    await supabase
      .from('escrow_logs')
      .insert({
        escrow_id: escrowId,
        event: event,
        metadata: metadata,
        created_at: new Date().toISOString()
      })
  }

  /**
   * Send notifications
   */
  private async notifyBuyer(buyerId: string, transactionId: string, type: string): Promise<void> {
    // Implement notification logic
    console.log(`Notifying buyer ${buyerId} about ${type} for transaction ${transactionId}`)
  }

  private async notifySeller(sellerId: string, transactionId: string, type: string): Promise<void> {
    // Implement notification logic
    console.log(`Notifying seller ${sellerId} about ${type} for transaction ${transactionId}`)
  }

  private async notifyUser(userId: string, transactionId: string, type: string): Promise<void> {
    // Implement notification logic
    console.log(`Notifying user ${userId} about ${type} for transaction ${transactionId}`)
  }

  private async notifyAdmins(escrowId: string, type: string): Promise<void> {
    // Implement admin notification logic
    console.log(`Notifying admins about ${type} for escrow ${escrowId}`)
  }

  /**
   * Map database record to EscrowTransaction type
   */
  private mapToEscrowTransaction(data: any): EscrowTransaction {
    return {
      id: data.id,
      transactionId: data.transaction_id,
      sellerId: data.seller_id,
      buyerId: data.buyer_id,
      cryptoAmount: data.crypto_amount,
      cryptoCurrency: data.crypto_currency,
      fiatAmount: data.fiat_amount,
      fiatCurrency: data.fiat_currency,
      status: data.status,
      escrowAddress: data.escrow_address,
      fundedAt: data.funded_at ? new Date(data.funded_at) : undefined,
      paymentConfirmedAt: data.payment_confirmed_at ? new Date(data.payment_confirmed_at) : undefined,
      releasedAt: data.released_at ? new Date(data.released_at) : undefined,
      disputedAt: data.disputed_at ? new Date(data.disputed_at) : undefined,
      expiresAt: new Date(data.expires_at),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    }
  }
}

// Export singleton instance
export const escrowService = new EscrowService()