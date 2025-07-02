'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  ChevronDown,
  Search,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface CryptoPrice {
  symbol: string
  name: string
  price_brl: number
  percent_change_24h: number
}

interface CryptoSearchSelectProps {
  selectedCrypto: string
  onSelectCrypto: (symbol: string) => void
  cryptoPrices: Record<string, CryptoPrice>
  loadingPrices?: boolean
  error?: string | null
  supportedCryptos: Array<{ symbol: string; name: string }>
  className?: string
}

export const CryptoSearchSelect: React.FC<CryptoSearchSelectProps> = ({
  selectedCrypto,
  onSelectCrypto,
  cryptoPrices,
  loadingPrices = false,
  error = null,
  supportedCryptos,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [allCryptos, setAllCryptos] = useState<Array<{ symbol: string; name: string }>>(supportedCryptos)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Fetch top 300 cryptos when search is initiated
  const fetchTop300Cryptos = async () => {
    if (allCryptos.length > supportedCryptos.length) return // Already fetched
    
    try {
      setLoadingSearch(true)
      setSearchError(null)
      const response = await fetch('/api/cotacao?top=true')
      
      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrencies')
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        setAllCryptos(data.data)
      } else {
        throw new Error(data.error || 'Failed to load cryptocurrency list')
      }
    } catch (error) {
      console.error('Error fetching cryptocurrency list:', error)
      setSearchError('Não foi possível carregar a lista de criptomoedas')
    } finally {
      setLoadingSearch(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query && allCryptos.length === supportedCryptos.length) {
      fetchTop300Cryptos()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const filteredCryptos = searchQuery
    ? allCryptos.filter(
        crypto =>
          crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCryptos

  const selectedCryptoInfo = allCryptos.find(c => c.symbol === selectedCrypto)

  return (
    <div ref={dropdownRef} className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Escolha a Criptomoeda
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-lg focus:border-orange-500 focus:outline-none transition-colors flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-500"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2">
            {loadingPrices && <Loader2 className="w-4 h-4 animate-spin" />}
            <span className="truncate">
              {selectedCrypto} - {selectedCryptoInfo?.name || selectedCrypto}
            </span>
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-96 overflow-hidden">
            {/* Search Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar por símbolo ou nome..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchError && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {searchError}
                </div>
              )}
            </div>

            {/* Crypto List */}
            <div className="overflow-y-auto max-h-80">
              {loadingSearch && searchQuery && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500 mb-2" />
                  <span className="text-gray-600 dark:text-gray-400">Buscando criptomoedas...</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">Isso pode levar alguns segundos</span>
                </div>
              )}

              {!loadingSearch && filteredCryptos.length === 0 && (
                <div className="text-center py-8 px-4">
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Nenhuma criptomoeda encontrada
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Tente buscar por outro termo
                  </p>
                </div>
              )}

              {!loadingSearch && filteredCryptos.length > 0 && (
                <div className="py-2">
                  {/* Show popular cryptos first if no search */}
                  {!searchQuery && (
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Populares
                    </div>
                  )}
                  
                  {filteredCryptos.map((crypto) => {
                    const price = cryptoPrices[crypto.symbol]
                    const isSelected = selectedCrypto === crypto.symbol
                    
                    return (
                      <button
                        key={crypto.symbol}
                        type="button"
                        onClick={() => {
                          onSelectCrypto(crypto.symbol)
                          setIsOpen(false)
                          setSearchQuery('')
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group ${
                          isSelected ? 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {crypto.symbol}
                            </span>
                            {isSelected && (
                              <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                                Selecionado
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 truncate block">
                            {crypto.name}
                          </span>
                        </div>
                        
                        {price ? (
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {price.price_brl.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </p>
                            <p className={`text-xs flex items-center justify-end gap-1 ${
                              price.percent_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <span>{price.percent_change_24h >= 0 ? '↑' : '↓'}</span>
                              <span>{Math.abs(price.percent_change_24h).toFixed(2)}%</span>
                            </p>
                          </div>
                        ) : (
                          <div className="text-right ml-4 flex-shrink-0">
                            {loadingPrices ? (
                              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            ) : (
                              <span className="text-sm text-gray-400">--</span>
                            )}
                          </div>
                        )}
                      </button>
                    )
                  })}

                  {/* Show message if list was extended */}
                  {allCryptos.length > supportedCryptos.length && searchQuery && (
                    <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                      Mostrando as top 300 criptomoedas por capitalização de mercado
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message outside dropdown */}
      {error && !isOpen && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}

export default CryptoSearchSelect