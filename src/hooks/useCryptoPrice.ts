import { useState, useEffect, useCallback } from 'react'

export interface CryptoPrice {
  symbol: string
  currency: string
  price: number
  previousPrice: number
  change24h: number
  change24hValue: number
  high24h: number
  low24h: number
  volume24h: number
  marketCap?: number
  lastUpdate: string
  source: string
  p2pPremium?: number
  p2pOffers?: {
    buy: {
      bestPrice: number
      worstPrice: number
      averagePrice: number
      activeOffers: number
    }
    sell: {
      bestPrice: number
      worstPrice: number
      averagePrice: number
      activeOffers: number
    }
  }
}

export interface PriceHistory {
  timestamp: string
  price: number
  volume?: number
}

interface UseCryptoPriceOptions {
  symbol?: string
  autoRefresh?: boolean
  refreshInterval?: number
  useWebSocket?: boolean
}

export function useCryptoPrice({
  symbol = 'BTC',
  autoRefresh = true,
  refreshInterval = 60000, // 1 minute default
  useWebSocket = false
}: UseCryptoPriceOptions = {}) {
  const [price, setPrice] = useState<CryptoPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchPrice = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/crypto-prices?symbol=${symbol}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setPrice(data.data)
        setLastUpdate(new Date())
      } else {
        setError(data.error || 'Failed to fetch price')
      }
    } catch (err) {
      setError('Failed to fetch price')
      console.error('Error fetching crypto price:', err)
    } finally {
      setLoading(false)
    }
  }, [symbol])

  // Initial fetch
  useEffect(() => {
    fetchPrice()
  }, [fetchPrice])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return

    const interval = setInterval(fetchPrice, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchPrice])

  // WebSocket connection for real-time updates (future implementation)
  useEffect(() => {
    if (!useWebSocket) return

    // TODO: Implement WebSocket connection for real-time price updates
    // This would connect to a WebSocket endpoint that streams price updates
    // Example: wss://api.example.com/ws/prices/${symbol}
  }, [useWebSocket, symbol])

  return {
    price,
    loading,
    error,
    lastUpdate,
    refetch: fetchPrice
  }
}

// Hook for multiple crypto prices
export function useMultipleCryptoPrices(
  symbols: string[],
  options?: Omit<UseCryptoPriceOptions, 'symbol'>
) {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const { autoRefresh = true, refreshInterval = 60000 } = options || {}

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const symbolsParam = symbols.join(',')
      const response = await fetch(`/api/crypto-prices?symbols=${symbolsParam}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setPrices(data.data)
        setLastUpdate(new Date())
      } else {
        setError(data.error || 'Failed to fetch prices')
      }
    } catch (err) {
      setError('Failed to fetch prices')
      console.error('Error fetching crypto prices:', err)
    } finally {
      setLoading(false)
    }
  }, [symbols])

  // Initial fetch
  useEffect(() => {
    if (symbols.length > 0) {
      fetchPrices()
    }
  }, [fetchPrices, symbols.length])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0 || symbols.length === 0) return

    const interval = setInterval(fetchPrices, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchPrices, symbols.length])

  return {
    prices,
    loading,
    error,
    lastUpdate,
    refetch: fetchPrices
  }
}

// Hook for price history
export function usePriceHistory(
  symbol: string,
  period: '1h' | '24h' | '7d' | '30d' | '1y' = '24h'
) {
  const [history, setHistory] = useState<PriceHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/crypto-prices?symbol=${symbol}&history=true&period=${period}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setHistory(data.data.history)
      } else {
        setError(data.error || 'Failed to fetch history')
      }
    } catch (err) {
      setError('Failed to fetch history')
      console.error('Error fetching price history:', err)
    } finally {
      setLoading(false)
    }
  }, [symbol, period])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return {
    history,
    loading,
    error,
    refetch: fetchHistory
  }
}

// Utility functions
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatPercentChange(value: number): string {
  const formatted = value.toFixed(2)
  return value >= 0 ? `+${formatted}%` : `${formatted}%`
}

export function getPriceChangeColor(change: number): string {
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-600'
}