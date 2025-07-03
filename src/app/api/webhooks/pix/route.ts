import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Initialize Supabase client with service role for webhook operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Webhook signature verification for different providers
const verifyWebhookSignature = (
  provider: string,
  payload: string,
  signature: string | null,
  secret: string
): boolean => {
  if (!signature) return false

  switch (provider) {
    case 'mercadopago':
      // MercadoPago uses HMAC-SHA256
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex')
      return signature === `sha256=${expectedSignature}`

    case 'pagseguro':
      // PagSeguro typically uses a different format
      // Implementation depends on their specific webhook format
      return true // Placeholder

    case 'gerencianet':
      // Gerencianet/Efí uses HMAC-SHA256
      const hash = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex')
      return signature === hash

    default:
      return false
  }
}

// Process PIX webhook based on provider
const processPixWebhook = async (
  provider: string,
  payload: any
): Promise<{
  transactionId?: string
  status?: string
  endToEndId?: string
  amount?: number
  error?: string
}> => {
  switch (provider) {
    case 'mercadopago':
      // MercadoPago webhook format
      if (payload.type === 'payment' && payload.data?.id) {
        // In production, you would fetch the full payment details from MercadoPago API
        return {
          transactionId: payload.data.external_reference,
          status: payload.data.status,
          endToEndId: payload.data.point_of_interaction?.transaction_data?.e2e_id,
          amount: payload.data.transaction_amount
        }
      }
      break

    case 'pagseguro':
      // PagSeguro webhook format
      if (payload.notificationCode) {
        // In production, you would fetch the transaction details from PagSeguro API
        return {
          transactionId: payload.reference,
          status: payload.status
        }
      }
      break

    case 'gerencianet':
      // Gerencianet/Efí webhook format
      if (payload.pix && Array.isArray(payload.pix)) {
        const pixTransaction = payload.pix[0]
        return {
          transactionId: pixTransaction.txid,
          status: 'completed',
          endToEndId: pixTransaction.endToEndId,
          amount: parseFloat(pixTransaction.valor)
        }
      }
      break

    case 'manual':
      // Manual confirmation (for testing or manual operations)
      return {
        transactionId: payload.transactionId,
        status: payload.status || 'completed',
        endToEndId: payload.endToEndId,
        amount: payload.amount
      }
  }

  return { error: 'Unknown webhook format' }
}

export async function POST(request: NextRequest) {
  try {
    const provider = request.headers.get('x-provider') || 
                    request.nextUrl.searchParams.get('provider') || 
                    'unknown'
    
    const payload = await request.text()
    const signature = request.headers.get('x-signature') || 
                     request.headers.get('x-hub-signature-256')

    // Get webhook secret based on provider
    const webhookSecret = process.env[`PIX_WEBHOOK_SECRET_${provider.toUpperCase()}`]
    
    // Log webhook receipt
    const { error: logError } = await supabase
      .from('pix_webhooks')
      .insert({
        provider,
        webhook_id: crypto.randomUUID(),
        event_type: 'payment_notification',
        payload: JSON.parse(payload),
        processed: false
      })

    if (logError) {
      console.error('Error logging webhook:', logError)
    }

    // Verify webhook signature (skip in development)
    if (process.env.NODE_ENV === 'production' && webhookSecret) {
      const isValid = verifyWebhookSignature(provider, payload, signature, webhookSecret)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        )
      }
    }

    // Process the webhook
    const parsedPayload = JSON.parse(payload)
    const result = await processPixWebhook(provider, parsedPayload)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Update transaction if we have a transaction ID
    if (result.transactionId && result.status === 'completed') {
      // Find the transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .or(`id.eq.${result.transactionId},metadata->transaction_reference.eq.${result.transactionId}`)
        .single()

      if (transaction && !txError) {
        // Update transaction status
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            status: 'processing',
            payment_confirmed_at: new Date().toISOString(),
            pix_end_to_end_id: result.endToEndId,
            metadata: {
              ...transaction.metadata,
              pix_webhook_confirmation: true,
              pix_provider: provider
            }
          })
          .eq('id', transaction.id)

        if (updateError) {
          console.error('Error updating transaction:', updateError)
        }

        // Update PIX payment details if we have E2E ID
        if (result.endToEndId) {
          await supabase
            .from('pix_payment_details')
            .update({
              end_to_end_id: result.endToEndId,
              payment_id: parsedPayload.data?.id || parsedPayload.id
            })
            .eq('transaction_id', transaction.id)
        }

        // Create notification for seller
        await supabase
          .from('notifications')
          .insert({
            user_id: transaction.seller_id,
            type: 'payment_received',
            title: 'Pagamento PIX Recebido',
            message: `Pagamento de R$ ${transaction.fiat_amount.toFixed(2)} foi confirmado via PIX`,
            data: {
              transaction_id: transaction.id,
              amount: transaction.fiat_amount,
              provider: provider
            }
          })

        // Mark webhook as processed
        await supabase
          .from('pix_webhooks')
          .update({
            processed: true,
            processed_at: new Date().toISOString(),
            transaction_id: transaction.id
          })
          .eq('payload->data->external_reference', result.transactionId)
          .or(`payload->reference.eq.${result.transactionId},payload->transactionId.eq.${result.transactionId}`)
      }
    }

    // Return appropriate response based on provider
    switch (provider) {
      case 'mercadopago':
        return NextResponse.json({ status: 'ok' }, { status: 200 })
      case 'pagseguro':
        return new NextResponse('OK', { status: 200 })
      case 'gerencianet':
        return NextResponse.json({ status: 'RECEIVED' }, { status: 200 })
      default:
        return NextResponse.json({ received: true }, { status: 200 })
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle webhook verification requests (some providers use GET for verification)
export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get('provider')
  const challenge = request.nextUrl.searchParams.get('challenge') || 
                   request.nextUrl.searchParams.get('hub.challenge')

  // Handle verification challenges
  if (challenge) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json(
    { status: 'PIX webhook endpoint active', provider },
    { status: 200 }
  )
}