'use client'

import React from 'react'
import { useMultipleCryptoPrices, formatBRL, formatPercentChange, getPriceChangeColor } from '@/hooks/useCryptoPrice'

interface CryptoPriceTickerProps {
  symbols?: string[]
  className?: string
}

export function CryptoPriceTicker({ 
  symbols = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'],
  className = ''
}: CryptoPriceTickerProps) {
  const { prices, loading } = useMultipleCryptoPrices(symbols, {
    autoRefresh: true,
    refreshInterval: 30000 // 30 seconds for ticker
  })

  if (loading && Object.keys(prices).length === 0) {
    return (
      <div className={`bg-gray-900 text-white py-2 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 animate-pulse">
            {symbols.map((symbol) => (
              <div key={symbol} className="flex items-center space-x-2">
                <div className="h-4 bg-gray-700 rounded w-12"></div>
                <div className="h-4 bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-900 text-white py-2 overflow-hidden ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
          {symbols.map((symbol) => {
            const price = prices[symbol]
            if (!price) return null

            const changeColor = price.change24h >= 0 ? 'text-green-400' : 'text-red-400'

            return (
              <div key={symbol} className="flex items-center space-x-2 whitespace-nowrap">
                <span className="font-semibold">{symbol}</span>
                <span className="text-sm">{formatBRL(price.price)}</span>
                <span className={`text-sm ${changeColor}`}>
                  {formatPercentChange(price.change24h)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Animated scrolling ticker
export function CryptoPriceScrollingTicker({ 
  symbols = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'USDC', 'XRP', 'ADA'],
  className = ''
}: CryptoPriceTickerProps) {
  const { prices, loading } = useMultipleCryptoPrices(symbols, {
    autoRefresh: true,
    refreshInterval: 30000
  })

  if (loading && Object.keys(prices).length === 0) {
    return (
      <div className={`bg-gray-900 text-white py-2 ${className}`}>
        <div className="h-6 animate-pulse bg-gray-800"></div>
      </div>
    )
  }

  const tickerItems = symbols.map((symbol) => {
    const price = prices[symbol]
    if (!price) return null

    const changeColor = price.change24h >= 0 ? 'text-green-400' : 'text-red-400'

    return (
      <div key={symbol} className="inline-flex items-center space-x-2 mx-4">
        <span className="font-semibold">{symbol}</span>
        <span className="text-sm">{formatBRL(price.price)}</span>
        <span className={`text-sm ${changeColor}`}>
          {formatPercentChange(price.change24h)}
        </span>
      </div>
    )
  }).filter(Boolean)

  return (
    <div className={`bg-gray-900 text-white py-2 overflow-hidden ${className}`}>
      <div className="relative">
        <div className="animate-scroll-left whitespace-nowrap">
          {tickerItems}
          {tickerItems}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-left {
          display: inline-flex;
          animation: scroll-left 30s linear infinite;
        }
      `}</style>
    </div>
  )
}