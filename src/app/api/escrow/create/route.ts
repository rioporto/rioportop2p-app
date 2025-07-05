import { NextRequest, NextResponse } from 'next/server'
import { escrowService } from '@/lib/escrow/escrow-service'
import { getUserFromToken } from '@/lib/auth-utils'
import { z } from 'zod'

// Request validation schema
const createEscrowSchema = z.object({
  transactionId: z.string().uuid(),
  sellerId: z.string().uuid(),
  buyerId: z.string().uuid(),
  cryptoAmount: z.number().positive(),
  cryptoCurrency: z.string().min(3).max(10),
  fiatAmount: z.number().positive(),
  fiatCurrency: z.string().default('BRL'),
  expirationMinutes: z.number().min(15).max(120).optional()
})

export async function POST(req: NextRequest) {
  try {
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
    const validatedData = createEscrowSchema.parse(body)

    // Verify user is part of the transaction
    if (user.id !== validatedData.sellerId && user.id !== validatedData.buyerId) {
      return NextResponse.json(
        { error: 'You are not authorized to create escrow for this transaction' },
        { status: 403 }
      )
    }

    // Create escrow
    const escrow = await escrowService.createEscrow(validatedData)

    return NextResponse.json({
      success: true,
      escrow
    })

  } catch (error) {
    console.error('Error creating escrow:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create escrow' },
      { status: 500 }
    )
  }
}