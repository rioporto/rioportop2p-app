import { NextRequest, NextResponse } from 'next/server'
import { signUp, supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
  
  try {
    const { email, password, name, phone, cpf } = await request.json()

    if (!email || !password || !name || !phone || !cpf) {
      return NextResponse.json(
        { error: 'Nome, email, telefone, CPF e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await signUp(email, password, {
      full_name: name,
      phone: phone,
      cpf: cpf
    })

    if (authError) {
      // Tratar erros específicos
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Este email já está cadastrado' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Criar perfil do usuário na tabela users_profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users_profile')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: name,
          phone: phone,
          cpf: cpf,
          kyc_level: 1,
          kyc_status: 'pending',
          is_admin: false,
          reputation_score: 5.0,
          total_trades: 0,
          two_factor_enabled: false,
          volume_traded: 0,
          is_online: false,
          preferred_payment_methods: ['pix'],
          notification_settings: {
            email: true,
            push: true,
            sms: false,
            transaction_updates: true,
            price_alerts: false,
            news_updates: false
          }
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        // Não retornar erro aqui pois o usuário já foi criado no Auth
      }
    }

    // Enviar email de verificação
    if (authData.user && authData.user.email) {
      await supabase.auth.signInWithOtp({
        email: authData.user.email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        }
      })
    }

    return NextResponse.json(
      { 
        message: 'Conta criada com sucesso! Verifique seu email.',
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
          name: name
        },
        success: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}