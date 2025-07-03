import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accessToken, refreshToken } = body

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Tokens are required' },
        { status: 400 }
      )
    }

    // Set the tokens as secure HTTP-only cookies
    const cookieStore = await cookies()
    
    cookieStore.set('sb-access-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    cookieStore.set('sb-refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return NextResponse.json(
      { message: 'Authentication successful' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}