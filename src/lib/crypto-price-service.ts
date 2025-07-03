// Crypto Price Service with multiple API providers for reliability
// Supports Binance, CoinGecko, and CoinAPI as fallbacks

import { supabase } from './supabase'

export interface CryptoPrice {
  symbol: string
  price_brl: number
  price_usd: number
  percent_change_24h: number
  percent_change_7d?: number
  volume_24h: number
  market_cap?: number
  high_24h?: number
  low_24h?: number
  last_updated: string
  source: string
}

export interface PriceHistory {
  timestamp: string
  price: number
  volume?: number
}

// Cache configuration
const CACHE_DURATION = 60 * 1000 // 1 minute
const priceCache = new Map<string, { data: CryptoPrice; timestamp: number }>()

// API Provider: Binance (No API key required)
async function fetchFromBinance(symbol: string): Promise<CryptoPrice | null> {
  try {
    // Get USD price
    const usdResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`)
    if (!usdResponse.ok) throw new Error('Binance USD request failed')
    const usdData = await usdResponse.json()

    // Get BRL price if available, otherwise calculate from USD
    let brlPrice: number
    try {
      const brlResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}BRL`)
      if (brlResponse.ok) {
        const brlData = await brlResponse.json()
        brlPrice = parseFloat(brlData.lastPrice)
      } else {
        // Fallback: Get USD/BRL rate
        const usdBrlResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTBRL')
        const usdBrlData = await usdBrlResponse.json()
        const usdBrlRate = parseFloat(usdBrlData.price)
        brlPrice = parseFloat(usdData.lastPrice) * usdBrlRate
      }
    } catch {
      // If BRL conversion fails, estimate with a fixed rate
      brlPrice = parseFloat(usdData.lastPrice) * 5.0
    }

    return {
      symbol: symbol.toUpperCase(),
      price_brl: brlPrice,
      price_usd: parseFloat(usdData.lastPrice),
      percent_change_24h: parseFloat(usdData.priceChangePercent),
      volume_24h: parseFloat(usdData.volume) * parseFloat(usdData.lastPrice),
      high_24h: parseFloat(usdData.highPrice),
      low_24h: parseFloat(usdData.lowPrice),
      last_updated: new Date().toISOString(),
      source: 'Binance'
    }
  } catch (error) {
    console.error('Binance API error:', error)
    return null
  }
}

// API Provider: CoinGecko (Free tier: 10-50 requests/minute)
async function fetchFromCoinGecko(symbol: string): Promise<CryptoPrice | null> {
  try {
    // Map common symbols to CoinGecko IDs
    const symbolToId: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDT': 'tether',
      'BNB': 'binancecoin',
      'SOL': 'solana',
      'USDC': 'usd-coin',
      'XRP': 'ripple',
      'ADA': 'cardano',
      'AVAX': 'avalanche-2',
      'DOGE': 'dogecoin'
    }

    const coinId = symbolToId[symbol.toUpperCase()] || symbol.toLowerCase()
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=brl,usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`
    )
    
    if (!response.ok) throw new Error('CoinGecko request failed')
    const data = await response.json()
    
    if (!data[coinId]) throw new Error('Coin not found')
    
    const coinData = data[coinId]
    
    return {
      symbol: symbol.toUpperCase(),
      price_brl: coinData.brl,
      price_usd: coinData.usd,
      percent_change_24h: coinData.brl_24h_change || 0,
      volume_24h: coinData.brl_24h_vol || 0,
      market_cap: coinData.brl_market_cap,
      last_updated: new Date().toISOString(),
      source: 'CoinGecko'
    }
  } catch (error) {
    console.error('CoinGecko API error:', error)
    return null
  }
}

// API Provider: CryptoCompare (Free tier: 100,000 requests/month)
async function fetchFromCryptoCompare(symbol: string): Promise<CryptoPrice | null> {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=BRL,USD`
    )
    
    if (!response.ok) throw new Error('CryptoCompare request failed')
    const data = await response.json()
    
    if (!data.DISPLAY || !data.DISPLAY[symbol]) throw new Error('Symbol not found')
    
    const rawData = data.RAW[symbol]
    const brlData = rawData.BRL
    const usdData = rawData.USD
    
    return {
      symbol: symbol.toUpperCase(),
      price_brl: brlData.PRICE,
      price_usd: usdData.PRICE,
      percent_change_24h: brlData.CHANGEPCT24HOUR,
      volume_24h: brlData.VOLUME24HOURTO,
      market_cap: brlData.MKTCAP,
      high_24h: brlData.HIGH24HOUR,
      low_24h: brlData.LOW24HOUR,
      last_updated: new Date().toISOString(),
      source: 'CryptoCompare'
    }
  } catch (error) {
    console.error('CryptoCompare API error:', error)
    return null
  }
}

// Main function to get crypto price with fallbacks
export async function getCryptoPrice(symbol: string, useCache = true): Promise<CryptoPrice | null> {
  const cacheKey = symbol.toUpperCase()
  
  // Check cache first
  if (useCache) {
    const cached = priceCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
  }

  // Try each provider in order
  const providers = [
    () => fetchFromBinance(symbol),
    () => fetchFromCoinGecko(symbol),
    () => fetchFromCryptoCompare(symbol)
  ]

  for (const provider of providers) {
    try {
      const price = await provider()
      if (price) {
        // Cache the result
        priceCache.set(cacheKey, { data: price, timestamp: Date.now() })
        
        // Save to database (async, don't wait)
        savePriceToDatabase(price).catch(console.error)
        
        return price
      }
    } catch (error) {
      console.error('Provider error:', error)
      continue
    }
  }

  // If all providers fail, try to get from database
  return getLatestPriceFromDatabase(symbol)
}

// Get multiple crypto prices efficiently
export async function getMultipleCryptoPrices(symbols: string[]): Promise<Record<string, CryptoPrice>> {
  const results: Record<string, CryptoPrice> = {}
  
  // Process in parallel but limit concurrency
  const batchSize = 5
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(async (symbol) => {
        const price = await getCryptoPrice(symbol)
        return { symbol, price }
      })
    )
    
    for (const { symbol, price } of batchResults) {
      if (price) {
        results[symbol] = price
      }
    }
  }
  
  return results
}

// Get historical price data
export async function getPriceHistory(
  symbol: string,
  period: '1h' | '24h' | '7d' | '30d' | '1y'
): Promise<PriceHistory[]> {
  try {
    // Try to get from database first
    const dbHistory = await getPriceHistoryFromDatabase(symbol, period)
    if (dbHistory && dbHistory.length > 0) {
      return dbHistory
    }

    // Fallback to generating mock data if no real data available
    // In production, you would fetch this from a historical data API
    return generateMockPriceHistory(symbol, period)
  } catch (error) {
    console.error('Error fetching price history:', error)
    return generateMockPriceHistory(symbol, period)
  }
}

// Database operations
async function savePriceToDatabase(price: CryptoPrice): Promise<void> {
  try {
    const { error } = await supabase
      .from('crypto_prices')
      .insert({
        symbol: price.symbol,
        price_brl: price.price_brl,
        price_usd: price.price_usd,
        percent_change_24h: price.percent_change_24h,
        percent_change_7d: price.percent_change_7d,
        volume_24h: price.volume_24h,
        market_cap: price.market_cap,
        high_24h: price.high_24h,
        low_24h: price.low_24h,
        source: price.source,
        created_at: new Date().toISOString()
      })

    if (error) throw error
  } catch (error) {
    console.error('Error saving price to database:', error)
  }
}

async function getLatestPriceFromDatabase(symbol: string): Promise<CryptoPrice | null> {
  try {
    const { data, error } = await supabase
      .from('crypto_prices')
      .select('*')
      .eq('symbol', symbol.toUpperCase())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null

    return {
      symbol: data.symbol,
      price_brl: data.price_brl,
      price_usd: data.price_usd,
      percent_change_24h: data.percent_change_24h,
      percent_change_7d: data.percent_change_7d,
      volume_24h: data.volume_24h,
      market_cap: data.market_cap,
      high_24h: data.high_24h,
      low_24h: data.low_24h,
      last_updated: data.created_at,
      source: data.source + ' (from cache)'
    }
  } catch (error) {
    console.error('Error fetching from database:', error)
    return null
  }
}

async function getPriceHistoryFromDatabase(
  symbol: string,
  period: string
): Promise<PriceHistory[]> {
  try {
    const now = new Date()
    let startDate = new Date()

    // Calculate start date based on period
    switch (period) {
      case '1h':
        startDate.setHours(now.getHours() - 1)
        break
      case '24h':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const { data, error } = await supabase
      .from('crypto_prices')
      .select('created_at, price_brl, volume_24h')
      .eq('symbol', symbol.toUpperCase())
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error || !data) return []

    return data.map(row => ({
      timestamp: row.created_at,
      price: row.price_brl,
      volume: row.volume_24h
    }))
  } catch (error) {
    console.error('Error fetching history from database:', error)
    return []
  }
}

// Generate mock price history for fallback
function generateMockPriceHistory(symbol: string, period: string): PriceHistory[] {
  const periods = {
    '1h': { points: 12, intervalMs: 5 * 60 * 1000 },       // 5 min intervals
    '24h': { points: 24, intervalMs: 60 * 60 * 1000 },     // 1 hour intervals
    '7d': { points: 28, intervalMs: 6 * 60 * 60 * 1000 },  // 6 hour intervals
    '30d': { points: 30, intervalMs: 24 * 60 * 60 * 1000 }, // 1 day intervals
    '1y': { points: 52, intervalMs: 7 * 24 * 60 * 60 * 1000 } // 1 week intervals
  }

  const config = periods[period as keyof typeof periods] || periods['24h']
  const now = Date.now()
  const history: PriceHistory[] = []
  
  // Base price for different symbols
  const basePrices: Record<string, number> = {
    'BTC': 250000,
    'ETH': 15000,
    'USDT': 5.05,
    'BNB': 1500,
    'SOL': 500
  }
  
  let currentPrice = basePrices[symbol.toUpperCase()] || 100
  
  for (let i = config.points - 1; i >= 0; i--) {
    const timestamp = new Date(now - (i * config.intervalMs)).toISOString()
    currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.02) // ±1% variation
    
    history.push({
      timestamp,
      price: currentPrice,
      volume: Math.random() * 50000000 + 10000000 // R$ 10M - 60M
    })
  }
  
  return history
}

// Update all tracked crypto prices
export async function updateAllCryptoPrices(): Promise<void> {
  const symbols = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'USDC', 'XRP', 'ADA']
  
  for (const symbol of symbols) {
    try {
      await getCryptoPrice(symbol, false) // Don't use cache
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.error(`Error updating ${symbol} price:`, error)
    }
  }
}

// Format price for display
export function formatPrice(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'BRL' ? 2 : 2,
    maximumFractionDigits: currency === 'BRL' ? 2 : 8
  }).format(value)
}

// Format percentage change
export function formatPercentChange(value: number): string {
  const formatted = value.toFixed(2)
  return value >= 0 ? `+${formatted}%` : `${formatted}%`
}