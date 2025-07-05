import { NextRequest, NextResponse } from 'next/server'
import { btgPixProvider } from '@/lib/pix/btg-provider'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import crypto from 'crypto'

const BTG_WEBHOOK_SECRET = process.env.BTG_WEBHOOK_SECRET || '6adcff00-c3b7-4ec8-90e9-da8ffa37e97e'

export async function POST(request: NextRequest) {
  try {
    const headers = Object.fromEntries(request.headers.entries())
    const body = await request.json()

    logger.info('BTG PIX Webhook received:', { headers, body })

    // Validar assinatura do webhook (se BTG enviar)
    const signature = headers['x-btg-signature'] || headers['x-webhook-signature']
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', BTG_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex')
      
      if (signature !== expectedSignature) {
        logger.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // Process webhook
    const { txid, status } = await btgPixProvider.processWebhook(headers, body)

    // Update PIX payment status
    const { error: pixError } = await supabase
      .from('pix_payments')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('pix_id', txid)

    if (pixError) {
      logger.error('Error updating PIX payment from webhook:', pixError)
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      )
    }

    // Get associated transaction
    const { data: pixData } = await supabase
      .from('pix_payments')
      .select('transaction_id')
      .eq('pix_id', txid)
      .single()

    if (pixData?.transaction_id) {
      // Update transaction status
      const { error: txError } = await supabase
        .from('transactions')
        .update({
          payment_status: status === 'completed' ? 'confirmed' : 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', pixData.transaction_id)

      if (txError) {
        logger.error('Error updating transaction from webhook:', txError)
      }

      // Create notification for the user
      const { data: transaction } = await supabase
        .from('transactions')
        .select('buyer_id, seller_id, amount')
        .eq('id', pixData.transaction_id)
        .single()

      if (transaction) {
        const notificationMessage = status === 'completed'
          ? `Pagamento PIX de R$ ${transaction.amount.toFixed(2)} confirmado!`
          : `Pagamento PIX de R$ ${transaction.amount.toFixed(2)} cancelado.`

        // Notify both buyer and seller
        for (const userId of [transaction.buyer_id, transaction.seller_id]) {
          await supabase
            .from('notifications')
            .insert({
              user_id: userId,
              title: 'Status do Pagamento PIX',
              message: notificationMessage,
              type: status === 'completed' ? 'payment_confirmed' : 'payment_failed',
              data: { transaction_id: pixData.transaction_id, txid }
            })
        }
      }
    }

    return NextResponse.json({ success: true, received: true })
  } catch (error) {
    logger.error('Error processing BTG PIX webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}