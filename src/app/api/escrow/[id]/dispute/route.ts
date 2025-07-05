import { NextRequest, NextResponse } from 'next/server'
import { escrowService } from '@/lib/escrow/escrow-service'
import { getUserFromToken } from '@/lib/auth-utils'
import { z } from 'zod'

// Request validation schema
const disputeSchema = z.object({
  reason: z.string().min(10).max(1000)
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
    const { reason } = disputeSchema.parse(body)

    // Open dispute (will verify user is part of transaction internally)
    const updatedEscrow = await escrowService.openDispute(id, user.id, reason)

    return NextResponse.json({
      success: true,
      escrow: updatedEscrow
    })

  } catch (error) {
    console.error('Error opening dispute:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    const message = error instanceof Error ? error.message : 'Failed to open dispute'
    const status = message.includes('Unauthorized') ? 403 : 500
    
    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}