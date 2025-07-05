import { NextRequest, NextResponse } from 'next/server'
import { escrowService } from '@/lib/escrow/escrow-service'
import { getUserFromToken } from '@/lib/auth-utils'
import { z } from 'zod'

// Request validation schema
const fundEscrowSchema = z.object({
  escrowAddress: z.string().min(26).max(255)
})

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

    // Parse and validate request
    const body = await req.json()
    const { escrowAddress } = fundEscrowSchema.parse(body)

    // Get escrow to verify seller
    const escrow = await escrowService.getEscrow(id)
    
    // Verify user is the seller
    if (user.id !== escrow.sellerId) {
      return NextResponse.json(
        { error: 'Only the seller can fund the escrow' },
        { status: 403 }
      )
    }

    // Mark as funded
    const updatedEscrow = await escrowService.markAsFunded(id, escrowAddress)

    return NextResponse.json({
      success: true,
      escrow: updatedEscrow
    })

  } catch (error) {
    console.error('Error funding escrow:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fund escrow' },
      { status: 500 }
    )
  }
}