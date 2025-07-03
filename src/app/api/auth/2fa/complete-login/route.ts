import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import speakeasy from 'speakeasy'
import { Database } from '@/lib/database.types'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const body = await request.json()
    const { token, userId } = body

    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Token e ID do usuário são obrigatórios' },
        { status: 400 }
      )
    }

    // Get pending 2FA session
    const pendingSession = cookieStore.get('sb-2fa-pending')
    if (!pendingSession) {
      return NextResponse.json(
        { error: 'Sessão de 2FA expirada. Por favor, faça login novamente.' },
        { status: 401 }
      )
    }

    const sessionData = JSON.parse(pendingSession.value)
    if (sessionData.userId !== userId) {
      return NextResponse.json(
        { error: 'ID do usuário inválido' },
        { status: 401 }
      )
    }

    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    // Get user's 2FA settings
    const { data: twoFactorAuth, error: fetchError } = await supabase
      .from('two_factor_auth')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError || !twoFactorAuth || !twoFactorAuth.enabled) {
      return NextResponse.json(
        { error: '2FA não está configurado para esta conta' },
        { status: 400 }
      )
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: twoFactorAuth.secret,
      encoding: 'base32',
      token: token,
      window: 2
    })

    if (!verified) {
      // Check backup codes if TOTP fails
      const { data: backupCodes } = await supabase
        .from('backup_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('used', false)

      let backupCodeUsed = false
      if (backupCodes) {
        for (const backupCode of backupCodes) {
          if (backupCode.code_hash === token) {
            // Mark backup code as used
            await supabase
              .from('backup_codes')
              .update({ 
                used: true, 
                used_at: new Date().toISOString() 
              })
              .eq('id', backupCode.id)
            
            backupCodeUsed = true
            break
          }
        }
      }

      if (!backupCodeUsed) {
        return NextResponse.json(
          { error: 'Código de verificação inválido' },
          { status: 400 }
        )
      }
    }

    // Update last used timestamp
    await supabase
      .from('two_factor_auth')
      .update({
        last_used_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    // Set the actual session cookies
    cookieStore.set('sb-access-token', sessionData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    cookieStore.set('sb-refresh-token', sessionData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    // Delete the pending 2FA session
    cookieStore.delete('sb-2fa-pending')

    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: userId,
        email: sessionData.email
      }
    })
  } catch (error) {
    console.error('2FA complete login error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}