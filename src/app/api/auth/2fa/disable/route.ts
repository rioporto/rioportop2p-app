import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import speakeasy from 'speakeasy'
import { Database } from '@/lib/database.types'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Verification token and password are required' },
        { status: 400 }
      )
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify password first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 400 }
      )
    }

    // Get user's 2FA settings
    const { data: twoFactorAuth, error: fetchError } = await supabase
      .from('two_factor_auth')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !twoFactorAuth || !twoFactorAuth.enabled) {
      return NextResponse.json(
        { error: '2FA is not enabled for this account' },
        { status: 400 }
      )
    }

    // Verify the 2FA token
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
        .eq('user_id', user.id)
        .eq('used', false)

      let backupCodeUsed = false
      if (backupCodes) {
        for (const backupCode of backupCodes) {
          if (backupCode.code_hash === token) {
            backupCodeUsed = true
            break
          }
        }
      }

      if (!backupCodeUsed) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 400 }
        )
      }
    }

    // Disable 2FA
    const { error: updateError } = await supabase
      .from('two_factor_auth')
      .update({
        enabled: false,
        verified: false,
        backup_codes_generated: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to disable 2FA' },
        { status: 500 }
      )
    }

    // Update users table
    await supabase
      .from('users')
      .update({
        two_factor_enabled: false,
        two_factor_verified_at: null
      })
      .eq('id', user.id)

    // Delete all backup codes
    await supabase
      .from('backup_codes')
      .delete()
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      message: '2FA has been successfully disabled'
    })
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}