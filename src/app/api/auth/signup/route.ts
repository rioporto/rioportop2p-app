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

    const { data, error } = await signUp(email, password, {
      full_name: name,
      phone: phone,
      cpf: cpf,
      kyc_level: 1,
      is_admin: false
    })

    if (error) {
      // Tratar erros específicos
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Este email já está cadastrado' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Enviar email de verificação
    if (data.user && data.user.email) {
      await supabase.auth.signInWithOtp({
        email: data.user.email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        }
      })
    }

    return NextResponse.json(
      { 
        message: 'Conta criada com sucesso! Verifique seu email.',
        user: {
          id: data.user?.id,
          email: data.user?.email,
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