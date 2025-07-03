import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase, createServiceSupabase, Tables, InsertTables, UpdateTables, Enums } from '@/lib/supabase/typed-client'

// Type for query filters
interface OrderFilters {
  type?: 'buy' | 'sell'
  crypto_id?: string
  user_id?: string
  status?: Enums<'order_status'>
  min_amount?: number
  max_amount?: number
}

// GET - List orders with filters and pagination
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    
    // Parse filters
    const filters: OrderFilters = {
      type: searchParams.get('type') as 'buy' | 'sell' | undefined,
      crypto_id: searchParams.get('crypto') || undefined,
      user_id: searchParams.get('user') || undefined,
      status: searchParams.get('status') as Enums<'order_status'> | undefined,
      min_amount: searchParams.get('min_amount') ? parseFloat(searchParams.get('min_amount')!) : undefined,
      max_amount: searchParams.get('max_amount') ? parseFloat(searchParams.get('max_amount')!) : undefined,
    }

    // Use service client for queries
    const serviceSupabase = createServiceSupabase()

    // Build query
    let query = serviceSupabase
      .from('orders')
      .select(`
        *,
        user:users_profile!user_id(
          id,
          full_name,
          avatar_url,
          reputation_score,
          total_trades,
          is_online,
          last_seen_at,
          kyc_level
        ),
        crypto:cryptocurrencies!crypto_id(
          id,
          symbol,
          name,
          logo_url,
          min_amount,
          max_amount
        )
      `, { count: 'exact' })

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type)
    }
    
    if (filters.crypto_id) {
      query = query.eq('crypto_id', filters.crypto_id)
    }
    
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    } else {
      // By default, only show open orders
      query = query.eq('status', 'open')
    }
    
    if (filters.min_amount) {
      query = query.gte('fiat_amount', filters.min_amount)
    }
    
    if (filters.max_amount) {
      query = query.lte('fiat_amount', filters.max_amount)
    }

    // Apply sorting and pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: orders, error, count } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 })
    }

    // Format response
    const formattedOrders = orders?.map((order) => ({
      id: order.id,
      type: order.type,
      status: order.status,
      crypto: {
        id: order.crypto?.id,
        symbol: order.crypto?.symbol,
        name: order.crypto?.name,
        logo_url: order.crypto?.logo_url,
      },
      user: {
        id: order.user?.id,
        name: order.user?.full_name,
        avatar: order.user?.avatar_url,
        reputation: order.user?.reputation_score,
        trades: order.user?.total_trades,
        is_online: order.user?.is_online,
        last_seen: order.user?.last_seen_at,
        kyc_level: order.user?.kyc_level,
      },
      crypto_amount: order.crypto_amount,
      fiat_amount: order.fiat_amount,
      price_per_unit: order.price_per_unit,
      limits: {
        min: order.min_limit,
        max: order.max_limit,
      },
      payment_methods: order.payment_methods,
      payment_time_limit: order.payment_time_limit,
      terms: order.terms,
      is_own: order.user_id === user.id,
      created_at: order.created_at,
      expires_at: order.expires_at,
    })) || []

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      }
    })
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['type', 'crypto_id', 'crypto_amount', 'fiat_amount', 'price_per_unit', 'payment_methods']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Additional validations
    if (!['buy', 'sell'].includes(body.type)) {
      return NextResponse.json({ error: 'Invalid order type' }, { status: 400 })
    }

    if (body.crypto_amount <= 0 || body.fiat_amount <= 0 || body.price_per_unit <= 0) {
      return NextResponse.json({ error: 'Amounts must be positive' }, { status: 400 })
    }

    if (!Array.isArray(body.payment_methods) || body.payment_methods.length === 0) {
      return NextResponse.json({ error: 'At least one payment method is required' }, { status: 400 })
    }

    // Validate payment methods
    const validPaymentMethods: Enums<'payment_method'>[] = ['PIX', 'TED', 'bank_transfer', 'cash']
    const invalidMethods = body.payment_methods.filter((method: string) => !validPaymentMethods.includes(method as any))
    if (invalidMethods.length > 0) {
      return NextResponse.json({ error: `Invalid payment methods: ${invalidMethods.join(', ')}` }, { status: 400 })
    }

    // Validate limits if provided
    if (body.min_limit !== undefined && body.max_limit !== undefined) {
      if (body.min_limit > body.max_limit) {
        return NextResponse.json({ error: 'Minimum limit cannot be greater than maximum limit' }, { status: 400 })
      }
    }

    // Use service client
    const serviceSupabase = createServiceSupabase()

    // Verify crypto exists and is active
    const { data: crypto, error: cryptoError } = await serviceSupabase
      .from('cryptocurrencies')
      .select('*')
      .eq('id', body.crypto_id)
      .eq('is_active', true)
      .single()

    if (cryptoError || !crypto) {
      return NextResponse.json({ error: 'Invalid or inactive cryptocurrency' }, { status: 400 })
    }

    // Check user profile
    const { data: userProfile, error: profileError } = await serviceSupabase
      .from('users_profile')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check KYC level for order creation
    if (userProfile.kyc_level === 'basic' && body.fiat_amount > 1000) {
      return NextResponse.json({ error: 'KYC verification required for orders above R$ 1.000' }, { status: 403 })
    }

    // Calculate expiration (24 hours from now by default)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    // Create order
    const orderData: InsertTables<'orders'> = {
      user_id: user.id,
      type: body.type,
      crypto_id: body.crypto_id,
      crypto_amount: body.crypto_amount,
      fiat_amount: body.fiat_amount,
      price_per_unit: body.price_per_unit,
      min_limit: body.min_limit || null,
      max_limit: body.max_limit || null,
      payment_methods: body.payment_methods,
      payment_time_limit: body.payment_time_limit || 30, // Default 30 minutes
      terms: body.terms || null,
      status: 'open',
      expires_at: expiresAt.toISOString(),
    }

    const { data: newOrder, error: insertError } = await serviceSupabase
      .from('orders')
      .insert(orderData)
      .select(`
        *,
        user:users_profile!user_id(*),
        crypto:cryptocurrencies!crypto_id(*)
      `)
      .single()

    if (insertError) {
      console.error('Error creating order:', insertError)
      return NextResponse.json({ error: 'Error creating order' }, { status: 500 })
    }

    // Log admin action if applicable
    if (userProfile.role === 'admin' || userProfile.role === 'moderator') {
      await serviceSupabase
        .from('admin_logs')
        .insert({
          admin_id: user.id,
          action: 'create_order',
          entity_type: 'orders',
          entity_id: newOrder.id,
          new_value: orderData,
        })
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order: {
        id: newOrder.id,
        type: newOrder.type,
        status: newOrder.status,
        crypto: {
          symbol: newOrder.crypto.symbol,
          name: newOrder.crypto.name,
          logo_url: newOrder.crypto.logo_url,
        },
        crypto_amount: newOrder.crypto_amount,
        fiat_amount: newOrder.fiat_amount,
        price_per_unit: newOrder.price_per_unit,
        payment_methods: newOrder.payment_methods,
        created_at: newOrder.created_at,
        expires_at: newOrder.expires_at,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update order
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Use service client
    const serviceSupabase = createServiceSupabase()

    // Get existing order
    const { data: existingOrder, error: fetchError } = await serviceSupabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check ownership
    if (existingOrder.user_id !== user.id) {
      // Check if user is admin
      const { data: userProfile } = await serviceSupabase
        .from('users_profile')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userProfile || userProfile.role !== 'admin') {
        return NextResponse.json({ error: 'Not authorized to update this order' }, { status: 403 })
      }
    }

    // Validate status transitions
    if (updateData.status) {
      const validTransitions: Record<string, string[]> = {
        'open': ['matched', 'cancelled', 'expired'],
        'matched': ['completed', 'cancelled'],
        'completed': [],
        'cancelled': [],
        'expired': []
      }

      if (!validTransitions[existingOrder.status]?.includes(updateData.status)) {
        return NextResponse.json({ 
          error: `Invalid status transition from ${existingOrder.status} to ${updateData.status}` 
        }, { status: 400 })
      }
    }

    // Prevent updates to completed, cancelled, or expired orders (except status changes)
    if (['completed', 'cancelled', 'expired'].includes(existingOrder.status) && !updateData.status) {
      return NextResponse.json({ error: 'Cannot update completed, cancelled, or expired orders' }, { status: 400 })
    }

    // Validate update fields
    const allowedFields = ['status', 'crypto_amount', 'fiat_amount', 'price_per_unit', 
                          'min_limit', 'max_limit', 'payment_methods', 'payment_time_limit', 'terms']
    
    const invalidFields = Object.keys(updateData).filter(key => !allowedFields.includes(key))
    if (invalidFields.length > 0) {
      return NextResponse.json({ error: `Invalid fields: ${invalidFields.join(', ')}` }, { status: 400 })
    }

    // Additional validations
    if (updateData.crypto_amount !== undefined && updateData.crypto_amount <= 0) {
      return NextResponse.json({ error: 'Crypto amount must be positive' }, { status: 400 })
    }

    if (updateData.fiat_amount !== undefined && updateData.fiat_amount <= 0) {
      return NextResponse.json({ error: 'Fiat amount must be positive' }, { status: 400 })
    }

    if (updateData.price_per_unit !== undefined && updateData.price_per_unit <= 0) {
      return NextResponse.json({ error: 'Price per unit must be positive' }, { status: 400 })
    }

    if (updateData.payment_methods !== undefined) {
      if (!Array.isArray(updateData.payment_methods) || updateData.payment_methods.length === 0) {
        return NextResponse.json({ error: 'At least one payment method is required' }, { status: 400 })
      }
    }

    // Prepare update
    const orderUpdate: UpdateTables<'orders'> = {
      ...updateData,
      updated_at: new Date().toISOString()
    }

    // Update order
    const { data: updatedOrder, error: updateError } = await serviceSupabase
      .from('orders')
      .update(orderUpdate)
      .eq('id', id)
      .select(`
        *,
        user:users_profile!user_id(*),
        crypto:cryptocurrencies!crypto_id(*)
      `)
      .single()

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json({ error: 'Error updating order' }, { status: 500 })
    }

    // Log admin action if applicable
    const { data: userProfile } = await serviceSupabase
      .from('users_profile')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile && (userProfile.role === 'admin' || userProfile.role === 'moderator')) {
      await serviceSupabase
        .from('admin_logs')
        .insert({
          admin_id: user.id,
          action: 'update_order',
          entity_type: 'orders',
          entity_id: id,
          old_value: existingOrder,
          new_value: updatedOrder,
        })
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order: updatedOrder
    })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Cancel order
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Parse request body or query params
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Use service client
    const serviceSupabase = createServiceSupabase()

    // Get existing order
    const { data: existingOrder, error: fetchError } = await serviceSupabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (fetchError || !existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check ownership
    if (existingOrder.user_id !== user.id) {
      // Check if user is admin
      const { data: userProfile } = await serviceSupabase
        .from('users_profile')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'moderator')) {
        return NextResponse.json({ error: 'Not authorized to cancel this order' }, { status: 403 })
      }
    }

    // Check if order can be cancelled
    if (!['open', 'matched'].includes(existingOrder.status)) {
      return NextResponse.json({ error: 'Order cannot be cancelled in current status' }, { status: 400 })
    }

    // Check if order has active transactions
    const { data: activeTransactions, error: txError } = await serviceSupabase
      .from('transactions')
      .select('id')
      .eq('order_id', orderId)
      .in('status', ['pending', 'processing'])
      .limit(1)

    if (txError) {
      console.error('Error checking transactions:', txError)
      return NextResponse.json({ error: 'Error checking order transactions' }, { status: 500 })
    }

    if (activeTransactions && activeTransactions.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot cancel order with active transactions' 
      }, { status: 400 })
    }

    // Cancel the order
    const { data: cancelledOrder, error: updateError } = await serviceSupabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) {
      console.error('Error cancelling order:', updateError)
      return NextResponse.json({ error: 'Error cancelling order' }, { status: 500 })
    }

    // Log admin action if applicable
    const { data: userProfile } = await serviceSupabase
      .from('users_profile')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile && (userProfile.role === 'admin' || userProfile.role === 'moderator')) {
      await serviceSupabase
        .from('admin_logs')
        .insert({
          admin_id: user.id,
          action: 'cancel_order',
          entity_type: 'orders',
          entity_id: orderId,
          old_value: existingOrder,
          new_value: cancelledOrder,
        })
    }

    return NextResponse.json({
      message: 'Order cancelled successfully',
      order: cancelledOrder
    })
  } catch (error) {
    console.error('Cancel order error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}