import { NextResponse, NextRequest } from 'next/server'
import { 
  getCryptoPrice, 
  getMultipleCryptoPrices, 
  getPriceHistory,
  updateAllCryptoPrices 
} from '@/lib/crypto-price-service'

// GET /api/crypto-prices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const symbols = searchParams.get('symbols')
    const history = searchParams.get('history')
    const period = searchParams.get('period') as '1h' | '24h' | '7d' | '30d' | '1y' || '24h'

    // Get historical data for a single symbol
    if (symbol && history === 'true') {
      const data = await getPriceHistory(symbol, period)
      
      return NextResponse.json({
        success: true,
        data: {
          symbol: symbol.toUpperCase(),
          period,
          history: data,
          summary: {
            highest: Math.max(...data.map(h => h.price)),
            lowest: Math.min(...data.map(h => h.price)),
            average: data.reduce((sum, h) => sum + h.price, 0) / data.length,
            totalVolume: data.reduce((sum, h) => sum + (h.volume || 0), 0)
          }
        },
        timestamp: Date.now()
      })
    }

    // Get multiple symbols
    if (symbols) {
      const symbolList = symbols.split(',').map(s => s.trim().toUpperCase())
      const prices = await getMultipleCryptoPrices(symbolList)
      
      return NextResponse.json({
        success: true,
        data: prices,
        timestamp: Date.now()
      })
    }

    // Get single symbol price
    if (symbol) {
      const price = await getCryptoPrice(symbol)
      
      if (!price) {
        return NextResponse.json({
          success: false,
          error: 'Failed to fetch price data',
          timestamp: Date.now()
        }, { status: 404 })
      }

      // Add P2P data (this would come from your P2P orders in production)
      const p2pData = {
        p2pPremium: 2.5,
        p2pOffers: {
          buy: {
            bestPrice: price.price_brl * 1.025,
            worstPrice: price.price_brl * 1.04,
            averagePrice: price.price_brl * 1.03,
            activeOffers: Math.floor(Math.random() * 50) + 20
          },
          sell: {
            bestPrice: price.price_brl * 0.975,
            worstPrice: price.price_brl * 0.96,
            averagePrice: price.price_brl * 0.97,
            activeOffers: Math.floor(Math.random() * 50) + 20
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: { ...price, ...p2pData },
        timestamp: Date.now()
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        }
      })
    }

    // Default: return top cryptos
    const topCryptos = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'USDC', 'XRP', 'ADA']
    const prices = await getMultipleCryptoPrices(topCryptos)
    
    return NextResponse.json({
      success: true,
      data: Object.values(prices),
      timestamp: Date.now()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      }
    })

  } catch (error) {
    console.error('Error in crypto-prices API:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: Date.now()
    }, { status: 500 })
  }
}

// POST /api/crypto-prices/update
// Endpoint to manually trigger price updates
export async function POST(request: NextRequest) {
  try {
    // In production, you'd want to protect this endpoint
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.includes('Bearer')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    // Update all tracked prices
    await updateAllCryptoPrices()
    
    return NextResponse.json({
      success: true,
      message: 'Price update initiated',
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error updating prices:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update prices',
      timestamp: Date.now()
    }, { status: 500 })
  }
}