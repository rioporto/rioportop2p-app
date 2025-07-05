import { NextRequest, NextResponse } from 'next/server'
import { btgPixProvider } from '@/lib/pix/btg-provider'
import { manualPixProvider } from '@/lib/pix/manual-provider'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description, customerName, customerDocument, transactionId, useManual = true } = body

    // Validate required fields
    if (!amount || !description || !customerName || !customerDocument || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let pixPayment: any

    // Por enquanto, usar sempre o sistema manual até BTG aprovar
    if (useManual || !process.env.BTG_CLIENT_ID) {
      // Sistema manual
      const manualPayment = await manualPixProvider.createPixPayment({
        amount,
        description,
        customerName,
        customerDocument,
        expirationMinutes: 30
      })

      pixPayment = {
        id: manualPayment.id,
        status: manualPayment.status,
        amount: manualPayment.amount,
        pixKey: manualPayment.pixKey,
        pixKeyType: manualPayment.pixKeyType,
        expiresAt: manualPayment.expiresAt,
        createdAt: manualPayment.createdAt,
        isManual: true
      }
    } else {
      // Sistema BTG (quando aprovado)
      const btgPayment = await btgPixProvider.createPixPayment({
        amount,
        description,
        customerName,
        customerDocument,
        expirationMinutes: 30
      })

      pixPayment = {
        id: btgPayment.id,
        status: btgPayment.status,
        amount: btgPayment.amount,
        qrCode: btgPayment.qrCode,
        qrCodeText: btgPayment.qrCodeText,
        expiresAt: btgPayment.expiresAt,
        createdAt: btgPayment.createdAt,
        isManual: false
      }
    }

    // Store PIX payment info in database
    const { error: dbError } = await supabase
      .from('pix_payments')
      .insert({
        transaction_id: transactionId,
        pix_id: pixPayment.id,
        amount: pixPayment.amount,
        status: pixPayment.status,
        qr_code: pixPayment.qrCode || null,
        qr_code_text: pixPayment.qrCodeText || pixPayment.pixKey,
        expires_at: pixPayment.expiresAt.toISOString(),
        created_at: pixPayment.createdAt.toISOString(),
        is_manual: pixPayment.isManual
      })

    if (dbError) {
      logger.error('Error storing PIX payment:', dbError)
      // Continue anyway, payment was created successfully
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: pixPayment.id,
        qrCode: pixPayment.qrCode,
        qrCodeText: pixPayment.qrCodeText || pixPayment.pixKey,
        pixKey: pixPayment.pixKey,
        pixKeyType: pixPayment.pixKeyType,
        amount: pixPayment.amount,
        expiresAt: pixPayment.expiresAt.toISOString(),
        isManual: pixPayment.isManual
      }
    })
  } catch (error) {
    logger.error('Error creating PIX payment:', error)
    return NextResponse.json(
      { error: 'Failed to create PIX payment' },
      { status: 500 }
    )
  }
}