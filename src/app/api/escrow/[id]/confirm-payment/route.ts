import { NextRequest, NextResponse } from 'next/server'
import { escrowService } from '@/lib/escrow/escrow-service'
import { getUserFromToken } from '@/lib/auth-utils'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params
    
    // Authenticate user
    const user = await getUserFromToken(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Confirm payment (will verify user is seller internally)
    const updatedEscrow = await escrowService.confirmPayment(id, user.id)

    return NextResponse.json({
      success: true,
      escrow: updatedEscrow
    })

  } catch (error) {
    console.error('Error confirming payment:', error)
    
    const message = error instanceof Error ? error.message : 'Failed to confirm payment'
    const status = message.includes('Unauthorized') ? 403 : 500
    
    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}