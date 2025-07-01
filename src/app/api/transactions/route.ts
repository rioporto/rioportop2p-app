import { NextRequest, NextResponse } from 'next/server'
import { supabase, getUser } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
  
  try {
    const { user, error: authError } = await getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      transactions: data,
      total: count,
      limit,
      offset
    })
  } catch (error) {
    console.error('Transactions fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
  
  try {
    const { user, error: authError } = await getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check user KYC level
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('kyc_level')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    if (userData.kyc_level < 2) {
      return NextResponse.json(
        { error: 'KYC level 2 or higher required for transactions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      type,
      from_currency,
      to_currency,
      from_amount,
      to_amount,
      exchange_rate,
      fee_amount,
      payment_method,
      notes
    } = body

    // Validate required fields
    if (!type || !from_currency || !to_currency || !from_amount || !to_amount || !exchange_rate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type,
        status: 'pending',
        from_currency,
        to_currency,
        from_amount,
        to_amount,
        exchange_rate,
        fee_amount,
        payment_method,
        notes
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Transaction created successfully',
      transaction: data
    }, { status: 201 })
  } catch (error) {
    console.error('Transaction creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}