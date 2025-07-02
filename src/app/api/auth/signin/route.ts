import { NextRequest, NextResponse } from 'next/server'
import { signIn, supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
  
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const { data, error } = await signIn(email, password)

    if (error) {
      return NextResponse.json(
        { error: error.message === 'Invalid login credentials' ? 'Email ou senha inválidos' : error.message },
        { status: 401 }
      )
    }

    // Definir cookies de sessão
    if (data.session) {
      const cookieStore = await cookies()
      
      cookieStore.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: '/',
      })

      cookieStore.set('sb-refresh-token', data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      })
    }

    return NextResponse.json(
      { 
        message: 'Login realizado com sucesso',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name,
          phone: data.user.user_metadata?.phone,
        },
        success: true
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}