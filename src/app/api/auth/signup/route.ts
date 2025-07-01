import { NextRequest, NextResponse } from 'next/server'
import { signUp, supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
  
  try {
    const { email, password, fullName, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { data, error } = await signUp(email, password, {
      full_name: fullName,
      phone: phone,
      kyc_level: 1,
      is_admin: false
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: data.user
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}