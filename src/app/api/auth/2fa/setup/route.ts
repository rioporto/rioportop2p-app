import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import { Database } from '@/lib/database.types'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user already has 2FA enabled
    const { data: existing2FA } = await supabase
      .from('two_factor_auth')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existing2FA?.enabled && existing2FA?.verified) {
      return NextResponse.json(
        { error: '2FA is already enabled for this account' },
        { status: 400 }
      )
    }

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `RioPorto P2P (${user.email})`,
      issuer: 'RioPorto P2P',
      length: 32
    })

    // Generate QR code
    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url!)

    // Save or update the secret in database (not enabled yet)
    if (existing2FA) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('two_factor_auth')
        .update({
          secret: secret.base32,
          enabled: false,
          verified: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating 2FA settings:', updateError)
        return NextResponse.json(
          { error: 'Failed to update 2FA settings' },
          { status: 500 }
        )
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('two_factor_auth')
        .insert({
          user_id: user.id,
          secret: secret.base32,
          enabled: false,
          verified: false
        })

      if (insertError) {
        console.error('Error creating 2FA settings:', insertError)
        return NextResponse.json(
          { error: 'Failed to create 2FA settings' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      secret: secret.base32,
      backupCode: secret.base32 // Show the secret as a backup option
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get 2FA status
    const { data: twoFactorAuth } = await supabase
      .from('two_factor_auth')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Get user details
    const { data: userDetails } = await supabase
      .from('users')
      .select('two_factor_enabled, two_factor_verified_at')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      enabled: twoFactorAuth?.enabled || false,
      verified: twoFactorAuth?.verified || false,
      backupCodesGenerated: twoFactorAuth?.backup_codes_generated || false,
      userTwoFactorEnabled: userDetails?.two_factor_enabled || false,
      verifiedAt: twoFactorAuth?.verified_at || userDetails?.two_factor_verified_at
    })
  } catch (error) {
    console.error('2FA status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}