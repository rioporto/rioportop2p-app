import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { Database } from '@/lib/database.types'

function generateBackupCode(): string {
  // Generate a secure random backup code
  const code = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `${code.slice(0, 4)}-${code.slice(4, 8)}`
}

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

    // Check if user has 2FA enabled
    const { data: twoFactorAuth } = await supabase
      .from('two_factor_auth')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!twoFactorAuth?.enabled || !twoFactorAuth?.verified) {
      return NextResponse.json(
        { error: '2FA must be enabled before generating backup codes' },
        { status: 400 }
      )
    }

    // Delete existing backup codes
    await supabase
      .from('backup_codes')
      .delete()
      .eq('user_id', user.id)

    // Generate 10 backup codes
    const backupCodes: string[] = []
    const backupCodeRecords = []

    for (let i = 0; i < 10; i++) {
      const code = generateBackupCode()
      backupCodes.push(code)
      
      // In production, you should hash these codes using bcrypt
      backupCodeRecords.push({
        user_id: user.id,
        code_hash: code, // In production: await bcrypt.hash(code, 10)
        used: false
      })
    }

    // Insert new backup codes
    const { error: insertError } = await supabase
      .from('backup_codes')
      .insert(backupCodeRecords)

    if (insertError) {
      console.error('Error creating backup codes:', insertError)
      return NextResponse.json(
        { error: 'Failed to generate backup codes' },
        { status: 500 }
      )
    }

    // Update 2FA settings to indicate backup codes have been generated
    await supabase
      .from('two_factor_auth')
      .update({
        backup_codes_generated: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      backupCodes,
      message: 'Save these backup codes in a safe place. Each code can only be used once.'
    })
  } catch (error) {
    console.error('Backup codes generation error:', error)
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

    // Get unused backup codes count
    const { count } = await supabase
      .from('backup_codes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('used', false)

    return NextResponse.json({
      remainingCodes: count || 0
    })
  } catch (error) {
    console.error('Backup codes status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}