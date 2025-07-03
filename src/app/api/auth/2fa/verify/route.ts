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
    const { token, action = 'verify' } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
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

    // Get user's 2FA settings
    const { data: twoFactorAuth, error: fetchError } = await supabase
      .from('two_factor_auth')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !twoFactorAuth) {
      return NextResponse.json(
        { error: '2FA is not set up for this account' },
        { status: 400 }
      )
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: twoFactorAuth.secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 steps tolerance for time drift
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
          // In production, you should use bcrypt to hash backup codes
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
          { error: 'Invalid verification code' },
          { status: 400 }
        )
      }
    }

    if (action === 'setup') {
      // Enable 2FA for the first time
      const now = new Date().toISOString()
      
      // Update two_factor_auth table
      const { error: updateError } = await supabase
        .from('two_factor_auth')
        .update({
          enabled: true,
          verified: true,
          verified_at: now,
          updated_at: now
        })
        .eq('user_id', user.id)

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to enable 2FA' },
          { status: 500 }
        )
      }

      // Update users table
      await supabase
        .from('users')
        .update({
          two_factor_enabled: true,
          two_factor_verified_at: now
        })
        .eq('id', user.id)

      return NextResponse.json({
        success: true,
        message: '2FA has been successfully enabled'
      })
    } else {
      // Just verify for login
      // Update last used timestamp
      await supabase
        .from('two_factor_auth')
        .update({
          last_used_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      return NextResponse.json({
        success: true,
        verified: true
      })
    }
  } catch (error) {
    console.error('2FA verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}