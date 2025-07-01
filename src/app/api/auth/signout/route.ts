import { NextRequest, NextResponse } from 'next/server'
import { signOut, supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
  
  try {
    const { error } = await signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}