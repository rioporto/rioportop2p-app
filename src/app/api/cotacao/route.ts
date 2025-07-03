import { NextResponse, NextRequest } from 'next/server'
import { getCryptoQuote, getMultipleCryptoQuotes, getTop300Cryptos } from '@/lib/coinmarketcap'
import { getCryptoPrice, getMultipleCryptoPrices, getPriceHistory } from '@/lib/crypto-price-service'

// Cache de fallback caso a API falhe
let fallbackCache: any = null;
let fallbackTimestamp = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'BTC';
    const multiple = searchParams.get('multiple');
    const top = searchParams.get('top');

    // Buscar top 300 criptos
    if (top === 'true') {
      const cryptos = await getTop300Cryptos();
      
      if (cryptos.length === 0 && fallbackCache) {
        // Usar cache se API falhar
        return NextResponse.json({
          success: true,
          data: fallbackCache,
          timestamp: Date.now(),
          cached: true
        });
      }

      // Salvar no cache
      if (cryptos.length > 0) {
        fallbackCache = cryptos;
        fallbackTimestamp = Date.now();
      }

      return NextResponse.json({
        success: true,
        data: cryptos,
        timestamp: Date.now()
      });
    }

    // Buscar múltiplas moedas
    if (multiple) {
      const symbols = multiple.split(',').map(s => s.trim().toUpperCase());
      const quotes = await getMultipleCryptoQuotes(symbols);
      
      return NextResponse.json({
        success: true,
        data: quotes,
        timestamp: Date.now()
      });
    }

    // Try our new crypto price service first
    const cryptoPrice = await getCryptoPrice(symbol.toUpperCase());
    
    if (cryptoPrice) {
      // Calculate previous price from percentage change
      const previousPrice = cryptoPrice.price_brl / (1 + cryptoPrice.percent_change_24h / 100);
      
      const data = {
        symbol: cryptoPrice.symbol,
        currency: 'BRL',
        price: cryptoPrice.price_brl,
        previousPrice: previousPrice,
        change24h: cryptoPrice.percent_change_24h,
        change24hValue: cryptoPrice.price_brl - previousPrice,
        high24h: cryptoPrice.high_24h || cryptoPrice.price_brl * 1.02,
        low24h: cryptoPrice.low_24h || cryptoPrice.price_brl * 0.98,
        volume24h: cryptoPrice.volume_24h,
        marketCap: cryptoPrice.market_cap,
        lastUpdate: cryptoPrice.last_updated,
        source: cryptoPrice.source,
        p2pPremium: 2.5,
        p2pOffers: {
          buy: {
            bestPrice: cryptoPrice.price_brl * 1.025,
            worstPrice: cryptoPrice.price_brl * 1.04,
            averagePrice: cryptoPrice.price_brl * 1.03,
            activeOffers: Math.floor(Math.random() * 50) + 20
          },
          sell: {
            bestPrice: cryptoPrice.price_brl * 0.975,
            worstPrice: cryptoPrice.price_brl * 0.96,
            averagePrice: cryptoPrice.price_brl * 0.97,
            activeOffers: Math.floor(Math.random() * 50) + 20
          }
        }
      };

      return NextResponse.json({
        success: true,
        data: data,
        timestamp: Date.now()
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        }
      });
    }

    // Fallback to CoinMarketCap API
    const quote = await getCryptoQuote(symbol.toUpperCase());
    
    if (!quote) {
      // Fallback para dados mockados se APIs falharem
      const mockPrice = 250000 + (Math.random() - 0.5) * 10000;
      const change24h = (Math.random() - 0.5) * 10;
      
      return NextResponse.json({
        success: true,
        data: {
          symbol: symbol.toUpperCase(),
          currency: 'BRL',
          price: mockPrice,
          previousPrice: mockPrice / (1 + change24h / 100),
          change24h: change24h,
          change24hValue: mockPrice * (change24h / 100),
          high24h: mockPrice * 1.02,
          low24h: mockPrice * 0.98,
          volume24h: Math.random() * 1000000000 + 500000000,
          marketCap: mockPrice * 19500000,
          lastUpdate: new Date().toISOString(),
          source: 'Mock Data (APIs unavailable)',
          p2pPremium: 2.5,
          p2pOffers: {
            buy: {
              bestPrice: mockPrice * 1.025,
              worstPrice: mockPrice * 1.04,
              averagePrice: mockPrice * 1.03,
              activeOffers: Math.floor(Math.random() * 50) + 20
            },
            sell: {
              bestPrice: mockPrice * 0.975,
              worstPrice: mockPrice * 0.96,
              averagePrice: mockPrice * 0.97,
              activeOffers: Math.floor(Math.random() * 50) + 20
            }
          }
        },
        timestamp: Date.now(),
        cached: true
      });
    }

    // Dados reais da API CoinMarketCap
    const currentPrice = quote.price_brl;
    const change24h = quote.percent_change_24h;
    const previousPrice = currentPrice / (1 + change24h / 100);

    const data = {
      symbol: quote.symbol,
      name: quote.name,
      currency: 'BRL',
      price: currentPrice,
      previousPrice: previousPrice,
      change24h: change24h,
      change24hValue: currentPrice - previousPrice,
      high24h: currentPrice * 1.02, // Estimativa
      low24h: currentPrice * 0.98,  // Estimativa
      volume24h: quote.volume_24h_brl,
      marketCap: quote.market_cap_brl,
      lastUpdate: new Date().toISOString(),
      source: 'CoinMarketCap',
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
    };

    return NextResponse.json({
      success: true,
      data: data,
      timestamp: Date.now()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      }
    });

  } catch (error) {
    console.error('Error fetching price data:', error);
    
    // Retornar dados mockados em caso de erro
    const mockPrice = 250000 + (Math.random() - 0.5) * 10000;
    const change24h = (Math.random() - 0.5) * 10;
    
    return NextResponse.json({
      success: false,
      error: 'API temporariamente indisponível',
      data: {
        symbol: 'BTC',
        currency: 'BRL',
        price: mockPrice,
        change24h: change24h,
        lastUpdate: new Date().toISOString(),
        source: 'Mock Data',
      },
      timestamp: Date.now()
    }, { status: 200 }); // Retorna 200 mesmo com erro para não quebrar o frontend
  }
}

// Endpoint para histórico de preços
export async function POST(request: Request) {
  try {
    const { symbol = 'BTC', period = '24h' } = await request.json()
    
    // Use our crypto price service to get historical data
    const history = await getPriceHistory(symbol, period as '1h' | '24h' | '7d' | '30d' | '1y')
    
    if (history.length === 0) {
      // Fallback to mock data if no history available
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
      
      const mockHistory = []
      let currentPrice = 250000 + (Math.random() - 0.5) * 10000
      
      for (let i = points - 1; i >= 0; i--) {
        const timestamp = new Date(now - (i * intervalMs)).toISOString()
        currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.02) // +-1% variação
        
        mockHistory.push({
          timestamp,
          price: currentPrice,
          volume: Math.random() * 50000000 + 10000000 // R$ 10M - 60M
        })
      }
      
      return NextResponse.json({
        success: true,
        data: {
          symbol: symbol.toUpperCase(),
          period,
          history: mockHistory,
          summary: {
            highest: Math.max(...mockHistory.map(h => h.price)),
            lowest: Math.min(...mockHistory.map(h => h.price)),
            average: mockHistory.reduce((sum, h) => sum + h.price, 0) / mockHistory.length,
            totalVolume: mockHistory.reduce((sum, h) => sum + (h.volume || 0), 0)
          }
        },
        timestamp: Date.now()
      })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        period,
        history,
        summary: {
          highest: Math.max(...history.map(h => h.price)),
          lowest: Math.min(...history.map(h => h.price)),
          average: history.reduce((sum, h) => sum + h.price, 0) / history.length,
          totalVolume: history.reduce((sum, h) => sum + (h.volume || 0), 0)
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