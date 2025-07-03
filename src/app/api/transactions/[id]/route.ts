import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceSupabase } from '@/lib/supabase/typed-client'

// GET - Get transaction details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const serviceSupabase = createServiceSupabase()
    
    // Get current user
    const { data: { user }, error: authError } = await serviceSupabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Get transaction with related data
    const { data: transaction, error: txError } = await serviceSupabase
      .from('transactions')
      .select(`
        *,
        order:orders!order_id(
          type,
          payment_methods,
          payment_time_limit,
          terms
        ),
        buyer:users_profile!buyer_id(
          id,
          full_name,
          avatar_url,
          reputation_score,
          total_trades,
          is_online
        ),
        seller:users_profile!seller_id(
          id,
          full_name,
          avatar_url,
          reputation_score,
          total_trades,
          is_online
        ),
        crypto:cryptocurrencies!crypto_id(
          symbol,
          name,
          logo_url
        )
      `)
      .eq('id', id)
      .single()

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Check if user is part of this transaction
    if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Get transaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update transaction status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-access-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const serviceSupabase = createServiceSupabase()
    
    // Get current user
    const { data: { user }, error: authError } = await serviceSupabase.auth.getUser(token.value)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const body = await request.json()
    const { status, ...additionalData } = body

    // Get existing transaction
    const { data: transaction, error: txError } = await serviceSupabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single()

    if (txError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Check if user is part of this transaction
    if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Validate status transitions based on user role
    const isBuyer = user.id === transaction.buyer_id
    const isSeller = user.id === transaction.seller_id

    // Define allowed transitions
    const allowedTransitions: Record<string, { buyer?: string[], seller?: string[] }> = {
      'pending': {
        buyer: ['payment_sent', 'cancelled'],
        seller: ['cancelled']
      },
      'payment_sent': {
        buyer: ['disputed'],
        seller: ['payment_confirmed', 'disputed', 'cancelled']
      },
      'payment_confirmed': {
        buyer: ['disputed'],
        seller: ['completed', 'disputed']
      }
    }

    const currentAllowedStatuses = allowedTransitions[transaction.status]
    const userAllowedStatuses = isBuyer ? currentAllowedStatuses?.buyer : currentAllowedStatuses?.seller

    if (!userAllowedStatuses || !userAllowedStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status transition from ${transaction.status} to ${status} for ${isBuyer ? 'buyer' : 'seller'}` 
      }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    // Add timestamp fields based on status
    if (status === 'payment_sent') {
      updateData.payment_sent_at = new Date().toISOString()
    } else if (status === 'payment_confirmed') {
      updateData.payment_confirmed_at = new Date().toISOString()
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString()
    } else if (status === 'disputed') {
      updateData.disputed_at = new Date().toISOString()
      if (additionalData.dispute_reason) {
        updateData.dispute_reason = additionalData.dispute_reason
      }
    }

    // Include additional data if provided
    Object.keys(additionalData).forEach(key => {
      if (key !== 'dispute_reason') { // Already handled above
        updateData[key] = additionalData[key]
      }
    })

    // Update transaction
    const { data: updatedTransaction, error: updateError } = await serviceSupabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating transaction:', updateError)
      return NextResponse.json({ error: 'Error updating transaction' }, { status: 500 })
    }

    // If transaction is completed, update order status
    if (status === 'completed') {
      await serviceSupabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', transaction.order_id)
    }

    // Send notification to other party
    const otherUserId = isBuyer ? transaction.seller_id : transaction.buyer_id
    await serviceSupabase
      .from('notifications')
      .insert({
        user_id: otherUserId,
        type: 'transaction_update',
        title: 'Atualização de Transação',
        message: `A transação #${id.slice(0, 8)} foi atualizada para: ${getStatusText(status)}`,
        data: { transaction_id: id, new_status: status }
      })

    return NextResponse.json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction
    })
  } catch (error) {
    console.error('Update transaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'Aguardando Pagamento',
    'payment_sent': 'Pagamento Enviado',
    'payment_confirmed': 'Pagamento Confirmado',
    'completed': 'Concluída',
    'cancelled': 'Cancelada',
    'disputed': 'Em Disputa'
  }
  return statusMap[status] || status
}