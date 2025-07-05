import { NextRequest, NextResponse } from 'next/server'
import { btgPixProvider } from '@/lib/pix/btg-provider'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ txid: string }> }
) {
  try {
    const params = await context.params
    const { txid } = params

    if (!txid) {
      return NextResponse.json(
        { error: 'Transaction ID required' },
        { status: 400 }
      )
    }

    // Get PIX payment status from BTG
    const pixPayment = await btgPixProvider.getPixPaymentStatus(txid)

    // Update status in database
    const { error: updateError } = await supabase
      .from('pix_payments')
      .update({
        status: pixPayment.status,
        updated_at: new Date().toISOString()
      })
      .eq('pix_id', txid)

    if (updateError) {
      logger.error('Error updating PIX payment status:', updateError)
    }

    // If payment is completed, update the transaction
    if (pixPayment.status === 'completed') {
      const { data: pixData } = await supabase
        .from('pix_payments')
        .select('transaction_id')
        .eq('pix_id', txid)
        .single()

      if (pixData?.transaction_id) {
        const { error: txError } = await supabase
          .from('transactions')
          .update({
            payment_status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('id', pixData.transaction_id)

        if (txError) {
          logger.error('Error updating transaction status:', txError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: pixPayment.id,
        status: pixPayment.status,
        amount: pixPayment.amount,
        expiresAt: pixPayment.expiresAt.toISOString()
      }
    })
  } catch (error) {
    logger.error('Error checking PIX payment status:', error)
    return NextResponse.json(
      { error: 'Failed to check PIX payment status' },
      { status: 500 }
    )
  }
}