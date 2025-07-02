import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  try {
    // Verificar autenticação
    const cookieStore = cookies()
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
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Construir query
    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
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
    const formattedTransactions = transactions?.map(tx => {
      // Determinar crypto e valor baseado no tipo
      let crypto = ''
      let amount = 0
      let cryptoAmount = 0
      let totalBRL = 0

      if (tx.type === 'buy') {
        crypto = tx.to_currency
        amount = tx.from_amount
        cryptoAmount = tx.to_amount
        totalBRL = tx.from_amount + (tx.fee_amount || 0)
      } else if (tx.type === 'sell') {
        crypto = tx.from_currency
        amount = tx.to_amount
        cryptoAmount = tx.from_amount
        totalBRL = tx.to_amount - (tx.fee_amount || 0)
      }

      return {
        id: tx.id,
        type: tx.type,
        crypto,
        amount,
        cryptoAmount,
        status: tx.status,
        createdAt: tx.created_at,
        totalBRL,
        fee: tx.fee_amount || 0,
        paymentMethod: tx.payment_method,
        notes: tx.notes
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

// Criar nova transação
export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }

  try {
    const cookieStore = cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
    }

    const body = await request.json()
    const { type, fromCurrency, toCurrency, fromAmount, toAmount, exchangeRate, paymentMethod } = body

    // Validações
    if (!type || !fromCurrency || !toCurrency || !fromAmount || !toAmount || !exchangeRate) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Calcular taxa (3.5% do valor)
    const feeAmount = fromAmount * 0.035

    // Criar transação
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type,
        from_currency: fromCurrency,
        to_currency: toCurrency,
        from_amount: fromAmount,
        to_amount: toAmount,
        exchange_rate: exchangeRate,
        fee_amount: feeAmount,
        payment_method: paymentMethod,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Transação criada com sucesso',
      transaction
    }, { status: 201 })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}