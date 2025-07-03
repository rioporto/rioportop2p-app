'use client'

import React from 'react'
import { useCryptoPrice, formatBRL, formatPercentChange, getPriceChangeColor } from '@/hooks/useCryptoPrice'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

interface CryptoPriceCardProps {
  symbol: string
  showP2P?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

export function CryptoPriceCard({ 
  symbol, 
  showP2P = true,
  autoRefresh = true,
  refreshInterval = 60000 
}: CryptoPriceCardProps) {
  const { price, loading, error, lastUpdate, refetch } = useCryptoPrice({ 
    symbol, 
    autoRefresh,
    refreshInterval 
  })

  if (loading && !price) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600">
          <p className="font-semibold">Erro ao carregar preço</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={refetch}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (!price) return null

  const isPositive = price.change24h >= 0
  const changeColor = getPriceChangeColor(price.change24h)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{price.symbol}</h3>
        <button
          onClick={refetch}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Atualizar preço"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">
          {formatBRL(price.price)}
        </div>
        <div className={`flex items-center mt-2 ${changeColor}`}>
          {isPositive ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
          <span className="font-medium">{formatPercentChange(price.change24h)}</span>
          <span className="ml-2 text-sm">({formatBRL(Math.abs(price.change24hValue))})</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Alta 24h</p>
          <p className="font-medium">{formatBRL(price.high24h)}</p>
        </div>
        <div>
          <p className="text-gray-600">Baixa 24h</p>
          <p className="font-medium">{formatBRL(price.low24h)}</p>
        </div>
        <div>
          <p className="text-gray-600">Volume 24h</p>
          <p className="font-medium">{formatBRL(price.volume24h)}</p>
        </div>
        {price.marketCap && (
          <div>
            <p className="text-gray-600">Market Cap</p>
            <p className="font-medium">{formatBRL(price.marketCap)}</p>
          </div>
        )}
      </div>

      {/* P2P Info */}
      {showP2P && price.p2pOffers && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Mercado P2P</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Compra</p>
              <p className="font-medium text-green-600">{formatBRL(price.p2pOffers.buy.bestPrice)}</p>
              <p className="text-xs text-gray-500">{price.p2pOffers.buy.activeOffers} ofertas</p>
            </div>
            <div>
              <p className="text-gray-600">Venda</p>
              <p className="font-medium text-red-600">{formatBRL(price.p2pOffers.sell.bestPrice)}</p>
              <p className="text-xs text-gray-500">{price.p2pOffers.sell.activeOffers} ofertas</p>
            </div>
          </div>
          {price.p2pPremium && (
            <p className="text-xs text-gray-500 mt-2">
              Premium médio P2P: {price.p2pPremium.toFixed(1)}%
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Fonte: {price.source}</p>
        {lastUpdate && (
          <p>Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}</p>
        )}
      </div>
    </div>
  )
}