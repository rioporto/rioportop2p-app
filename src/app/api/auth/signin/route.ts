import { NextRequest, NextResponse } from 'next/server'
import { signIn, supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
  
  try {
    const body = await request.json()
    const { email, password, provider } = body

    // Handle OAuth providers
    if (provider === 'google') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${request.nextUrl.origin}/auth/callback`
        }
      })

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { url: data.url },
        { status: 200 }
      )
    }

    // Handle email/password login
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

    // Check if user has 2FA enabled
    const cookieStore = await cookies()

    const { data: userData } = await supabase
      .from('users')
      .select('two_factor_enabled')
      .eq('id', data.user.id)
      .single()

    const { data: twoFactorAuth } = await supabase
      .from('two_factor_auth')
      .select('enabled, verified')
      .eq('user_id', data.user.id)
      .single()

    // If 2FA is enabled and verified, require 2FA verification
    if (userData?.two_factor_enabled && twoFactorAuth?.enabled && twoFactorAuth?.verified) {
      // Store temporary session info for 2FA verification
      cookieStore.set('sb-2fa-pending', JSON.stringify({
        userId: data.user.id,
        email: data.user.email,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10, // 10 minutes
        path: '/',
      })

      return NextResponse.json(
        { 
          requiresTwoFactor: true,
          message: 'Por favor, insira seu código de autenticação de dois fatores',
          userId: data.user.id
        },
        { status: 200 }
      )
    }

    // Definir cookies de sessão
    if (data.session) {
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