import { NextResponse, NextRequest } from 'next/server'
import { getTop300Cryptos } from '@/lib/coinmarketcap'

// Cache structure
interface CacheEntry {
  data: Array<{ symbol: string; name: string }>;
  timestamp: number;
}

// In-memory cache
let cache: CacheEntry | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET(request: NextRequest) {
  try {
    // Check if we have valid cached data
    if (cache && (Date.now() - cache.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cache.data,
        cached: true,
        timestamp: cache.timestamp,
        cacheExpiry: cache.timestamp + CACHE_DURATION
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        }
      });
    }

    // Fetch fresh data from CoinMarketCap
    const cryptos = await getTop300Cryptos();
    
    if (!cryptos || cryptos.length === 0) {
      // If API fails but we have cached data, return it
      if (cache) {
        return NextResponse.json({
          success: true,
          data: cache.data,
          cached: true,
          stale: true,
          timestamp: cache.timestamp,
          warning: 'Using stale cache due to API error'
        }, {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          }
        });
      }
      
      // No cache and API failed
      throw new Error('Unable to fetch cryptocurrency data');
    }

    // Transform data to include only symbol and name
    const simplifiedData = cryptos.map(crypto => ({
      symbol: crypto.symbol,
      name: crypto.name
    }));

    // Update cache
    cache = {
      data: simplifiedData,
      timestamp: Date.now()
    };

    return NextResponse.json({
      success: true,
      data: simplifiedData,
      cached: false,
      timestamp: cache.timestamp,
      cacheExpiry: cache.timestamp + CACHE_DURATION
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      }
    });

  } catch (error) {
    console.error('Error in crypto-list API:', error);
    
    // If we have any cached data during error, return it
    if (cache) {
      return NextResponse.json({
        success: true,
        data: cache.data,
        cached: true,
        stale: true,
        timestamp: cache.timestamp,
        error: 'API error, returning cached data'
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        }
      });
    }

    // Return error response
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch cryptocurrency list',
      message: 'Unable to retrieve cryptocurrency data. Please try again later.',
      timestamp: Date.now()
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  }
}