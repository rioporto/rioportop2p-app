import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createPixProvider } from '@/lib/pix/providers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Get the user from the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication' },
        { status: 401 }
      )
    }

    const { transactionId } = await request.json()

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Get transaction details
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select(`
        *,
        seller:seller_id(
          id,
          full_name
        ),
        crypto:crypto_id(
          symbol
        ),
        order:order_id(
          payment_time_limit
        )
      `)
      .eq('id', transactionId)
      .single()

    if (txError || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Verify user is the buyer
    if (transaction.buyer_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if payment is already created
    const { data: existingPayment } = await supabase
      .from('pix_payment_details')
      .select('*')
      .eq('transaction_id', transactionId)
      .single()

    if (existingPayment) {
      return NextResponse.json({
        paymentDetails: existingPayment,
        message: 'Payment already exists'
      })
    }

    // Get seller's active PIX key
    const { data: pixKey, error: keyError } = await supabase
      .from('pix_keys')
      .select('*')
      .eq('user_id', transaction.seller_id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (keyError || !pixKey) {
      return NextResponse.json(
        { error: 'Seller has no active PIX keys' },
        { status: 400 }
      )
    }

    // Determine PIX provider
    const providerName = process.env.PIX_PROVIDER || 'manual'
    const providerConfig = {
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      email: process.env.PAGSEGURO_EMAIL,
      token: process.env.PAGSEGURO_TOKEN,
      clientId: process.env.GERENCIANET_CLIENT_ID,
      clientSecret: process.env.GERENCIANET_CLIENT_SECRET
    }

    const provider = createPixProvider(providerName, providerConfig)

    // Create payment with provider
    let qrCodeString = ''
    let qrCodeImageUrl = ''
    let paymentId = ''

    if (providerName !== 'manual') {
      const paymentResponse = await provider.createPayment({
        amount: transaction.fiat_amount,
        description: `Compra de ${transaction.crypto_amount} ${transaction.crypto.symbol}`,
        externalReference: transactionId,
        payerEmail: user.email,
        expirationMinutes: transaction.order?.payment_time_limit || 30
      })

      qrCodeString = paymentResponse.qrCode
      qrCodeImageUrl = paymentResponse.qrCodeImage || ''
      paymentId = paymentResponse.id
    } else {
      // For manual payments, generate QR code locally
      const qrCodeResponse = await provider.generateQRCode({
        pixKey: pixKey.key_value,
        amount: transaction.fiat_amount,
        merchantName: pixKey.account_holder_name,
        merchantCity: 'SAO PAULO',
        transactionId: transactionId.substring(0, 25)
      })

      qrCodeString = qrCodeResponse.qrCodeString
    }

    // Create PIX payment details
    const { data: paymentDetails, error: createError } = await supabase
      .from('pix_payment_details')
      .insert({
        transaction_id: transactionId,
        pix_key_id: pixKey.id,
        pix_key_type: pixKey.key_type,
        pix_key_value: pixKey.key_value,
        bank_name: pixKey.bank_name,
        account_holder_name: pixKey.account_holder_name,
        qr_code_string: qrCodeString,
        qr_code_image_url: qrCodeImageUrl,
        payment_id: paymentId || null
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create payment details' },
        { status: 500 }
      )
    }

    // Update transaction with PIX details
    await supabase
      .from('transactions')
      .update({
        pix_payment_details_id: paymentDetails.id,
        pix_provider: providerName,
        metadata: {
          ...transaction.metadata,
          pix_payment_created_at: new Date().toISOString()
        }
      })
      .eq('id', transactionId)

    // Create notification for seller
    await supabase
      .from('notifications')
      .insert({
        user_id: transaction.seller_id,
        type: 'payment_initiated',
        title: 'Pagamento Iniciado',
        message: `O comprador iniciou o pagamento PIX de R$ ${transaction.fiat_amount.toFixed(2)}`,
        data: {
          transaction_id: transactionId
        }
      })

    return NextResponse.json({
      paymentDetails,
      expiresAt: new Date(Date.now() + (transaction.order?.payment_time_limit || 30) * 60 * 1000).toISOString()
    })
  } catch (error) {
    console.error('PIX payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}