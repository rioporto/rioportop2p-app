import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase, createServiceSupabase } from '@/lib/supabase/typed-client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    // Usar service client para queries
    const serviceSupabase = createServiceSupabase()

    // Buscar transação
    const { data: transaction, error } = await serviceSupabase
      .from('transactions')
      .select(`
        *,
        buyer:buyer_id(id, full_name, avatar_url),
        seller:seller_id(id, full_name, avatar_url),
        crypto:crypto_id(symbol, name, logo_url)
      `)
      .eq('id', id)
      .single()

    if (error || !transaction) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })
    }

    // Verificar se o usuário faz parte da transação
    if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
      return NextResponse.json({ error: 'Sem permissão para visualizar esta transação' }, { status: 403 })
    }

    // Formatar transação para o formato esperado pelo frontend
    const isUserBuyer = transaction.buyer_id === user.id
    const counterparty = isUserBuyer ? transaction.seller : transaction.buyer
    
    const formattedTransaction = {
      id: transaction.id,
      type: isUserBuyer ? 'buy' : 'sell',
      crypto: transaction.crypto?.symbol || 'UNKNOWN',
      cryptoName: transaction.crypto?.name || 'Unknown',
      cryptoLogo: transaction.crypto?.logo_url,
      amount: transaction.fiat_amount,
      cryptoAmount: transaction.crypto_amount,
      status: transaction.status,
      createdAt: transaction.created_at,
      totalBRL: transaction.total_amount,
      fee: isUserBuyer ? transaction.fee_amount : 0, // Apenas comprador paga taxa
      paymentMethod: transaction.payment_method,
      pricePerUnit: transaction.price_per_unit,
      counterparty: {
        id: counterparty?.id,
        name: counterparty?.full_name || 'Usuário',
        avatar: counterparty?.avatar_url
      },
      paymentProof: transaction.payment_proof_url,
      paymentConfirmedAt: transaction.payment_confirmed_at,
      cryptoTxHash: transaction.crypto_tx_hash,
      completedAt: transaction.completed_at,
      cancelledAt: transaction.cancelled_at,
      cancellationReason: transaction.cancellation_reason
    }

    return NextResponse.json({
      transaction: formattedTransaction
    })
  } catch (error) {
    console.error('Transaction detail API error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}