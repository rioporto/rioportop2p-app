import { logger } from '@/lib/logger'
import { supabase } from '@/lib/supabase'

interface ManualPixPayment {
  id: string
  status: 'pending' | 'completed' | 'cancelled'
  amount: number
  description: string
  pixKey: string
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria'
  createdAt: Date
  expiresAt: Date
}

export class ManualPixProvider {
  private companyPixKeys = {
    cpf: process.env.NEXT_PUBLIC_COMPANY_PIX_CPF || '',
    cnpj: process.env.NEXT_PUBLIC_COMPANY_PIX_CNPJ || '',
    email: process.env.NEXT_PUBLIC_COMPANY_PIX_EMAIL || '',
    telefone: process.env.NEXT_PUBLIC_COMPANY_PIX_PHONE || '',
    aleatoria: process.env.NEXT_PUBLIC_COMPANY_PIX_ALEATORIA || '',
  }

  /**
   * Cria uma cobrança PIX manual
   */
  async createPixPayment(params: {
    amount: number
    description: string
    customerName: string
    customerDocument: string
    expirationMinutes?: number
    preferredKeyType?: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria'
  }): Promise<ManualPixPayment> {
    try {
      const expiration = params.expirationMinutes || 30
      const expiresAt = new Date(Date.now() + (expiration * 60 * 1000))
      
      // Seleciona a chave PIX preferida ou a chave aleatória como padrão
      const keyType = params.preferredKeyType || 'aleatoria'
      const pixKey = this.companyPixKeys[keyType] || this.companyPixKeys.aleatoria || Object.values(this.companyPixKeys).find(key => key) || ''
      
      if (!pixKey) {
        throw new Error('Nenhuma chave PIX configurada')
      }

      // Gera um ID único para o pagamento
      const paymentId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        id: paymentId,
        status: 'pending',
        amount: params.amount,
        description: params.description,
        pixKey,
        pixKeyType: keyType,
        createdAt: new Date(),
        expiresAt
      }
    } catch (error) {
      logger.error('Error creating manual PIX payment:', error)
      throw new Error('Falha ao criar pagamento PIX manual')
    }
  }

  /**
   * Confirma manualmente um pagamento PIX (admin only)
   */
  async confirmPayment(paymentId: string, adminUserId: string): Promise<void> {
    try {
      // Verifica se o usuário é admin
      const { data: adminData } = await supabase
        .from('users_profile')
        .select('is_admin')
        .eq('id', adminUserId)
        .single()

      if (!adminData?.is_admin) {
        throw new Error('Apenas administradores podem confirmar pagamentos')
      }

      // Atualiza o status do pagamento
      const { error } = await supabase
        .from('pix_payments')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('pix_id', paymentId)

      if (error) throw error

      // Busca a transação associada
      const { data: pixData } = await supabase
        .from('pix_payments')
        .select('transaction_id')
        .eq('pix_id', paymentId)
        .single()

      if (pixData?.transaction_id) {
        // Atualiza o status da transação
        await supabase
          .from('transactions')
          .update({
            payment_status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('id', pixData.transaction_id)

        // Cria notificação para os usuários
        const { data: transaction } = await supabase
          .from('transactions')
          .select('buyer_id, seller_id, amount')
          .eq('id', pixData.transaction_id)
          .single()

        if (transaction) {
          for (const userId of [transaction.buyer_id, transaction.seller_id]) {
            await supabase
              .from('notifications')
              .insert({
                user_id: userId,
                title: 'Pagamento PIX Confirmado',
                message: `Pagamento de R$ ${transaction.amount.toFixed(2)} foi confirmado pelo administrador.`,
                type: 'payment_confirmed',
                data: { transaction_id: pixData.transaction_id }
              })
          }
        }
      }
    } catch (error) {
      logger.error('Error confirming manual payment:', error)
      throw new Error('Falha ao confirmar pagamento')
    }
  }

  /**
   * Cancela um pagamento PIX manual
   */
  async cancelPayment(paymentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('pix_payments')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('pix_id', paymentId)

      if (error) throw error
    } catch (error) {
      logger.error('Error cancelling payment:', error)
      throw new Error('Falha ao cancelar pagamento')
    }
  }

  /**
   * Lista pagamentos pendentes (admin only)
   */
  async listPendingPayments(adminUserId: string) {
    try {
      // Verifica se o usuário é admin
      const { data: adminData } = await supabase
        .from('users_profile')
        .select('is_admin')
        .eq('id', adminUserId)
        .single()

      if (!adminData?.is_admin) {
        throw new Error('Apenas administradores podem listar pagamentos pendentes')
      }

      const { data, error } = await supabase
        .from('pix_payments')
        .select(`
          *,
          transactions!inner(
            id,
            amount,
            buyer_id,
            seller_id,
            users_profile!buyer_id(name, email),
            users_profile!seller_id(name, email)
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data
    } catch (error) {
      logger.error('Error listing pending payments:', error)
      throw new Error('Falha ao listar pagamentos pendentes')
    }
  }
}

// Singleton instance
export const manualPixProvider = new ManualPixProvider()