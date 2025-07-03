import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { updateAllCryptoPrices } from '@/lib/crypto-price-service'

// This endpoint can be called by a cron job service (like Vercel Cron or external service)
// Or you can set it up with services like GitHub Actions, Railway.app cron, etc.

export async function GET(request: Request) {
  try {
    // Verify the request is authorized (implement your own security)
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    // For Vercel Cron Jobs
    if (process.env.CRON_SECRET) {
      const cronSecret = headersList.get('x-cron-secret')
      if (cronSecret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
    
    // For other services using Bearer token
    if (process.env.API_SECRET_KEY && authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Starting scheduled price update...')
    
    // Update all tracked cryptocurrency prices
    await updateAllCryptoPrices()
    
    return NextResponse.json({
      success: true,
      message: 'Prices updated successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in price update cron job:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update prices',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Also support POST for flexibility
export async function POST(request: Request) {
  return GET(request)
}