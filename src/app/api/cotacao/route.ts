import { NextResponse } from 'next/server'

// Simulação de dados de cotação
// Em produção, isso viria de uma API real como CoinGecko, Binance, etc.
const generateMockPrice = () => {
  const basePrice = 250000 // R$ 250.000 base
  const variation = (Math.random() - 0.5) * 10000 // Variação de +-R$ 5.000
  return basePrice + variation
}

const generateMockData = () => {
  const currentPrice = generateMockPrice()
  const change24h = (Math.random() - 0.5) * 10 // -5% a +5%
  const previousPrice = currentPrice / (1 + change24h / 100)
  
  return {
    symbol: 'BTC',
    currency: 'BRL',
    price: currentPrice,
    previousPrice: previousPrice,
    change24h: change24h,
    change24hValue: currentPrice - previousPrice,
    high24h: currentPrice * 1.02,
    low24h: currentPrice * 0.98,
    volume24h: Math.random() * 1000000000 + 500000000, // R$ 500M - 1.5B
    marketCap: currentPrice * 19500000, // ~19.5M BTC em circulação
    lastUpdate: new Date().toISOString(),
    source: 'Rio Porto P2P Aggregator',
    p2pPremium: 2.5, // Premium médio P2P em %
    p2pOffers: {
      buy: {
        bestPrice: currentPrice * 1.025,
        worstPrice: currentPrice * 1.04,
        averagePrice: currentPrice * 1.03,
        activeOffers: Math.floor(Math.random() * 50) + 20
      },
      sell: {
        bestPrice: currentPrice * 0.975,
        worstPrice: currentPrice * 0.96,
        averagePrice: currentPrice * 0.97,
        activeOffers: Math.floor(Math.random() * 50) + 20
      }
    }
  }
}

export async function GET() {
  try {
    // Simular delay de API real
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const data = generateMockData()
    
    return NextResponse.json({
      success: true,
      data: data,
      timestamp: Date.now()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      }
    })
  } catch (error) {
    console.error('Error fetching price data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch price data',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
}

// Endpoint para histórico de preços
export async function POST(request: Request) {
  try {
    const { period = '24h' } = await request.json()
    
    // Gerar dados históricos mock
    const periods = {
      '1h': 12,   // 12 pontos (5 min cada)
      '24h': 24,  // 24 pontos (1h cada)
      '7d': 28,   // 28 pontos (6h cada)
      '30d': 30,  // 30 pontos (1d cada)
      '1y': 52    // 52 pontos (1 semana cada)
    }
    
    const points = periods[period as keyof typeof periods] || 24
    const now = Date.now()
    const intervalMs = {
      '1h': 5 * 60 * 1000,      // 5 minutos
      '24h': 60 * 60 * 1000,    // 1 hora
      '7d': 6 * 60 * 60 * 1000, // 6 horas
      '30d': 24 * 60 * 60 * 1000, // 1 dia
      '1y': 7 * 24 * 60 * 60 * 1000 // 1 semana
    }[period as keyof typeof periods] || 60 * 60 * 1000
    
    const history = []
    let currentPrice = generateMockPrice()
    
    for (let i = points - 1; i >= 0; i--) {
      const timestamp = now - (i * intervalMs)
      currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.02) // +-1% variação
      
      history.push({
        timestamp,
        price: currentPrice,
        volume: Math.random() * 50000000 + 10000000 // R$ 10M - 60M
      })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        period,
        history,
        summary: {
          highest: Math.max(...history.map(h => h.price)),
          lowest: Math.min(...history.map(h => h.price)),
          average: history.reduce((sum, h) => sum + h.price, 0) / history.length,
          totalVolume: history.reduce((sum, h) => sum + h.volume, 0)
        }
      },
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error generating historical data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate historical data',
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
}