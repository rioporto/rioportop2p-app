import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase, queries, createServiceSupabase } from '@/lib/supabase/typed-client'
import type { Tables } from '@/lib/supabase/typed-client'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Obter usuário atual
    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
    }

    // Buscar parâmetros de query
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') as Tables<'transactions'>['status'] | null
    const type = searchParams.get('type') as Tables<'transactions'>['type'] | null

    // Usar service client para queries
    const serviceSupabase = createServiceSupabase()

    // Construir query
    let query = serviceSupabase
      .from('transactions')
      .select(`
        *,
        buyer:buyer_id(id, full_name, avatar_url),
        seller:seller_id(id, full_name, avatar_url),
        crypto:crypto_id(symbol, name, logo_url)
      `, { count: 'exact' })
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }
    if (type) {
      query = query.eq('type', type)
    }

    // Aplicar paginação
    query = query.range(offset, offset + limit - 1)

    const { data: transactions, error, count } = await query

    if (error) {
      console.error('Error fetching transactions:', error)
      return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 })
    }

    // Formatar transações para o formato esperado pelo frontend
    const formattedTransactions = transactions?.map((tx) => {
      const isUserBuyer = tx.buyer_id === user.id
      const counterparty = isUserBuyer ? tx.seller : tx.buyer
      
      return {
        id: tx.id,
        type: isUserBuyer ? 'buy' : 'sell',
        crypto: tx.crypto?.symbol || 'UNKNOWN',
        cryptoName: tx.crypto?.name || 'Unknown',
        cryptoLogo: tx.crypto?.logo_url,
        amount: tx.fiat_amount,
        cryptoAmount: tx.crypto_amount,
        status: tx.status,
        createdAt: tx.created_at,
        totalBRL: tx.total_amount,
        fee: isUserBuyer ? tx.fee_amount : 0, // Apenas comprador paga taxa
        paymentMethod: tx.payment_method,
        pricePerUnit: tx.price_per_unit,
        counterparty: {
          id: counterparty?.id,
          name: counterparty?.full_name || 'Usuário',
          avatar: counterparty?.avatar_url
        },
        paymentProof: tx.payment_proof_url,
        paymentConfirmedAt: tx.payment_confirmed_at,
        cryptoTxHash: tx.crypto_tx_hash,
        completedAt: tx.completed_at,
        cancelledAt: tx.cancelled_at,
        cancellationReason: tx.cancellation_reason
      }
    }) || []

    return NextResponse.json({
      transactions: formattedTransactions,
      total: count || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Criar nova transação a partir de uma ordem
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, amount, paymentMethod } = body

    // Validações
    if (!orderId || !amount || !paymentMethod) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Usar service client
    const serviceSupabase = createServiceSupabase()

    // Buscar ordem
    const { data: order, error: orderError } = await serviceSupabase
      .from('orders')
      .select('*, crypto:crypto_id(*), user:user_id(*)')
      .eq('id', orderId)
      .eq('status', 'open')
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Ordem não encontrada ou indisponível' }, { status: 404 })
    }

    // Verificar se o usuário não está tentando transacionar com ele mesmo
    if (order.user_id === user.id) {
      return NextResponse.json({ error: 'Você não pode transacionar com sua própria ordem' }, { status: 400 })
    }

    // Verificar limites
    if (amount < (order.min_limit || 0) || amount > (order.max_limit || Infinity)) {
      return NextResponse.json({ error: 'Valor fora dos limites da ordem' }, { status: 400 })
    }

    // Verificar método de pagamento
    if (!order.payment_methods.includes(paymentMethod)) {
      return NextResponse.json({ error: 'Método de pagamento não aceito' }, { status: 400 })
    }

    // Calcular valores
    const cryptoAmount = amount / order.price_per_unit
    const feePercentage = 0.035 // 3.5%
    const feeAmount = amount * feePercentage
    const totalAmount = order.type === 'buy' ? amount - feeAmount : amount + feeAmount

    // Determinar quem é comprador e vendedor
    const isBuyOrder = order.type === 'buy'
    const buyerId = isBuyOrder ? order.user_id : user.id
    const sellerId = isBuyOrder ? user.id : order.user_id

    // Criar transação
    const { data: transaction, error: txError } = await serviceSupabase
      .from('transactions')
      .insert({
        order_id: orderId,
        buyer_id: buyerId,
        seller_id: sellerId,
        crypto_id: order.crypto_id,
        type: isBuyOrder ? 'sell' : 'buy', // Tipo da perspectiva do usuário atual
        crypto_amount: cryptoAmount,
        fiat_amount: amount,
        price_per_unit: order.price_per_unit,
        fee_amount: feeAmount,
        fee_percentage: feePercentage,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: 'pending',
        metadata: {
          order_type: order.type,
          initiator_id: user.id
        }
      })
      .select(`
        *,
        buyer:buyer_id(id, full_name, avatar_url),
        seller:seller_id(id, full_name, avatar_url),
        crypto:crypto_id(symbol, name, logo_url)
      `)
      .single()

    if (txError) {
      console.error('Error creating transaction:', txError)
      return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 })
    }

    // Atualizar ordem para matched
    await serviceSupabase
      .from('orders')
      .update({ status: 'matched', updated_at: new Date().toISOString() })
      .eq('id', orderId)

    // Criar notificação para o dono da ordem
    await serviceSupabase
      .from('notifications')
      .insert({
        user_id: order.user_id,
        type: 'order_matched',
        title: 'Ordem aceita!',
        message: `Sua ordem de ${order.type === 'buy' ? 'compra' : 'venda'} foi aceita`,
        data: { transaction_id: transaction.id, order_id: orderId }
      })

    return NextResponse.json({
      message: 'Transação criada com sucesso',
      transaction: {
        id: transaction.id,
        type: transaction.type,
        crypto: transaction.crypto?.symbol,
        amount: transaction.fiat_amount,
        cryptoAmount: transaction.crypto_amount,
        status: transaction.status,
        createdAt: transaction.created_at,
        totalBRL: transaction.total_amount,
        fee: transaction.fee_amount,
        paymentMethod: transaction.payment_method,
        counterparty: transaction.type === 'buy' ? transaction.seller : transaction.buyer
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Atualizar status da transação
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
    }

    const body = await request.json()
    const { transactionId, action, data } = body

    if (!transactionId || !action) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const serviceSupabase = createServiceSupabase()

    // Buscar transação
    const { data: transaction, error: txError } = await serviceSupabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })
    }

    // Verificar se o usuário faz parte da transação
    if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
      return NextResponse.json({ error: 'Sem permissão para esta transação' }, { status: 403 })
    }

    let updateData: Partial<Tables<'transactions'>> = {
      updated_at: new Date().toISOString()
    }

    switch (action) {
      case 'confirm_payment':
        // Apenas o comprador pode confirmar pagamento
        if (transaction.buyer_id !== user.id) {
          return NextResponse.json({ error: 'Apenas o comprador pode confirmar pagamento' }, { status: 403 })
        }
        if (transaction.status !== 'pending') {
          return NextResponse.json({ error: 'Status inválido para confirmar pagamento' }, { status: 400 })
        }
        updateData.status = 'processing'
        updateData.payment_confirmed_at = new Date().toISOString()
        if (data?.paymentProof) {
          updateData.payment_proof_url = data.paymentProof
        }
        break

      case 'release_crypto':
        // Apenas o vendedor pode liberar crypto
        if (transaction.seller_id !== user.id) {
          return NextResponse.json({ error: 'Apenas o vendedor pode liberar crypto' }, { status: 403 })
        }
        if (transaction.status !== 'processing') {
          return NextResponse.json({ error: 'Status inválido para liberar crypto' }, { status: 400 })
        }
        updateData.status = 'completed'
        updateData.crypto_released_at = new Date().toISOString()
        updateData.completed_at = new Date().toISOString()
        if (data?.txHash) {
          updateData.crypto_tx_hash = data.txHash
        }
        break

      case 'cancel':
        // Ambas as partes podem cancelar em certas condições
        if (transaction.status === 'completed') {
          return NextResponse.json({ error: 'Transação já foi completada' }, { status: 400 })
        }
        updateData.status = 'cancelled'
        updateData.cancelled_at = new Date().toISOString()
        updateData.cancelled_by = user.id
        updateData.cancellation_reason = data?.reason || 'Cancelado pelo usuário'
        break

      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }

    // Atualizar transação
    const { data: updatedTx, error: updateError } = await serviceSupabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating transaction:', updateError)
      return NextResponse.json({ error: 'Erro ao atualizar transação' }, { status: 500 })
    }

    // Criar notificação para a outra parte
    const otherUserId = transaction.buyer_id === user.id ? transaction.seller_id : transaction.buyer_id
    const notificationMessages = {
      confirm_payment: 'Pagamento confirmado pelo comprador',
      release_crypto: 'Criptomoeda liberada pelo vendedor',
      cancel: 'Transação cancelada'
    }

    await serviceSupabase
      .from('notifications')
      .insert({
        user_id: otherUserId,
        type: `transaction_${action}`,
        title: 'Atualização na transação',
        message: notificationMessages[action as keyof typeof notificationMessages],
        data: { transaction_id: transactionId }
      })

    return NextResponse.json({
      message: 'Transação atualizada com sucesso',
      transaction: updatedTx
    })
  } catch (error) {
    console.error('Update transaction error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}