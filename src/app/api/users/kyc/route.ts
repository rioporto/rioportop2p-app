import { NextRequest, NextResponse } from 'next/server'
import { supabase, getUser } from '@/lib/supabase'

export async function PUT(request: NextRequest) {
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

    const { kyc_level } = await request.json()

    // Validate KYC level
    if (![1, 2, 3].includes(kyc_level)) {
      return NextResponse.json(
        { error: 'Invalid KYC level. Must be 1, 2, or 3' },
        { status: 400 }
      )
    }

    // Check if user is admin (only admins can update KYC levels)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (userError || !userData?.is_admin) {
      return NextResponse.json(
        { error: 'Only administrators can update KYC levels' },
        { status: 403 }
      )
    }

    // Get target user ID from query params
    const searchParams = request.nextUrl.searchParams
    const targetUserId = searchParams.get('userId')

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Target user ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        kyc_level,
        kyc_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', targetUserId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      message: 'KYC level updated successfully',
      user: data 
    })
  } catch (error) {
    console.error('KYC update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}