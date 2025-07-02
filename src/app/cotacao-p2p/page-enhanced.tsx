'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useWhatsApp } from '@/lib/whatsapp'
import { 
  ArrowDownUp, 
  TrendingUp, 
  TrendingDown, 
  Loader2,
  Bitcoin,
  Wallet,
  Shield,
  Zap,
  MessageSquare,
  ChevronDown,
  Eye,
  EyeOff,
  Info,
  Search,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react'

// Lista de criptomoedas suportadas
const SUPPORTED_CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'Ripple' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'LTC', name: 'Litecoin' },
]

// Estrutura de taxas (spread) baseada no volume
const getTaxRate = (valorBRL: number): number => {
  if (valorBRL <= 1000) return 0.035      // 3.5% até R$ 1.000
  if (valorBRL <= 5000) return 0.03       // 3% até R$ 5.000
  if (valorBRL <= 10000) return 0.025     // 2.5% até R$ 10.000
  if (valorBRL <= 50000) return 0.02      // 2% até R$ 50.000
  return 0.015                            // 1.5% acima de R$ 50.000
}

interface CryptoPrice {
  symbol: string
  name: string
  price_brl: number
  percent_change_24h: number
}

// Component for crypto search dropdown
const CryptoSearchSelect = ({ 
  selectedCrypto, 
  onSelectCrypto, 
  cryptoPrices,
  loadingPrices,
  error,
  onRetry
}: {
  selectedCrypto: string
  onSelectCrypto: (symbol: string) => void
  cryptoPrices: Record<string, CryptoPrice>
  loadingPrices: boolean
  error: string | null
  onRetry: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [allCryptos, setAllCryptos] = useState<Array<{ symbol: string; name: string }>>(SUPPORTED_CRYPTOS)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Fetch top 300 cryptos when search is initiated
  const fetchTop300Cryptos = async () => {
    if (allCryptos.length > SUPPORTED_CRYPTOS.length) return // Already fetched
    
    try {
      setLoadingSearch(true)
      const response = await fetch('/api/cotacao?top=true')
      const data = await response.json()
      
      if (data.success && data.data) {
        setAllCryptos(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar lista de criptomoedas:', error)
    } finally {
      setLoadingSearch(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query && allCryptos.length === SUPPORTED_CRYPTOS.length) {
      fetchTop300Cryptos()
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
    <div ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Escolha a Criptomoeda
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-lg focus:border-primary focus:outline-none transition-colors flex items-center justify-between"
        >
          <span>
            {selectedCrypto} - {selectedCryptoInfo?.name || selectedCrypto}
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-96 overflow-hidden">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Buscar criptomoeda..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-80">
              {loadingSearch && searchQuery && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Buscando criptomoedas...</span>
                </div>
              )}

              {!loadingSearch && filteredCryptos.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>Nenhuma criptomoeda encontrada</p>
                  <p className="text-sm mt-2">Tente outro termo de busca</p>
                </div>
              )}

              {!loadingSearch && filteredCryptos.length > 0 && (
                <div className="py-2">
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
                        className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${
                          isSelected ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                        }`}
                      >
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {crypto.symbol}
                          </span>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {crypto.name}
                          </span>
                        </div>
                        {loadingPrices && isSelected ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : price ? (
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {price.price_brl.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </p>
                            <p className={`text-xs ${price.percent_change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {price.percent_change_24h >= 0 ? '+' : ''}{price.percent_change_24h.toFixed(2)}%
                            </p>
                          </div>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CotacaoDinamicaEnhanced() {
  const { sendMessage, numbers, templates } = useWhatsApp()
  
  // Estados
  const [loading, setLoading] = useState(false)
  const [loadingPrices, setLoadingPrices] = useState(true)
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, CryptoPrice>>({})
  const [operationType, setOperationType] = useState<'buy' | 'sell'>('buy')
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [inputMode, setInputMode] = useState<'brl' | 'crypto'>('brl')
  const [brlValue, setBrlValue] = useState('')
  const [cryptoValue, setCryptoValue] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  // Dados do cliente
  const [clientData, setClientData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    paymentMethod: 'PIX'
  })

  // Buscar cotações ao carregar
  useEffect(() => {
    fetchAllPrices()
    const interval = setInterval(fetchAllPrices, 30000) // Atualiza a cada 30 segundos
    return () => clearInterval(interval)
  }, [])

  // Fetch when selected crypto changes
  useEffect(() => {
    const isSupportedCrypto = SUPPORTED_CRYPTOS.some(c => c.symbol === selectedCrypto)
    if (!isSupportedCrypto && selectedCrypto && !cryptoPrices[selectedCrypto]) {
      fetchSingleCrypto(selectedCrypto)
    }
  }, [selectedCrypto])

  const fetchAllPrices = async (retry = false) => {
    try {
      if (retry) {
        setIsRetrying(true)
      } else {
        setLoadingPrices(true)
      }
      setError(null)
      
      // Fetch all supported cryptos
      const symbols = SUPPORTED_CRYPTOS.map(c => c.symbol).join(',')
      const response = await fetch(`/api/cotacao?multiple=${symbols}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setCryptoPrices(data.data)
      } else {
        throw new Error(data.error || 'Falha ao carregar cotações')
      }
    } catch (error) {
      console.error('Erro ao buscar cotações:', error)
      setError('Não foi possível carregar as cotações. Por favor, tente novamente.')
    } finally {
      setLoadingPrices(false)
      setIsRetrying(false)
    }
  }

  const fetchSingleCrypto = async (symbol: string) => {
    try {
      setLoadingPrices(true)
      const response = await fetch(`/api/cotacao?symbol=${symbol}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setCryptoPrices(prev => ({
          ...prev,
          [symbol]: {
            symbol: data.data.symbol || symbol,
            name: data.data.name || symbol,
            price_brl: data.data.price,
            percent_change_24h: data.data.change24h || 0
          }
        }))
      }
    } catch (error) {
      console.error(`Erro ao buscar cotação para ${symbol}:`, error)
    } finally {
      setLoadingPrices(false)
    }
  }

  // Calcular valores com taxas
  const calculateValues = useCallback(() => {
    const currentPrice = cryptoPrices[selectedCrypto]?.price_brl || 0
    if (!currentPrice) return { brl: 0, crypto: 0, tax: 0, total: 0, taxRate: 0 }

    let brl = 0
    let crypto = 0
    let tax = 0
    let total = 0
    let taxRate = 0

    if (inputMode === 'brl' && brlValue) {
      // Cliente informou valor em BRL
      brl = parseFloat(brlValue.replace(/\D/g, '')) / 100
      taxRate = getTaxRate(brl)
      
      if (operationType === 'buy') {
        // Comprando: adiciona taxa ao preço
        const priceWithTax = currentPrice * (1 + taxRate)
        crypto = brl / priceWithTax
        tax = brl * taxRate / (1 + taxRate)
        total = brl
      } else {
        // Vendendo: subtrai taxa do valor
        crypto = brl / currentPrice
        tax = brl * taxRate
        total = brl - tax
      }
    } else if (inputMode === 'crypto' && cryptoValue) {
      // Cliente informou quantidade de crypto
      crypto = parseFloat(cryptoValue)
      brl = crypto * currentPrice
      taxRate = getTaxRate(brl)
      
      if (operationType === 'buy') {
        // Comprando: adiciona taxa ao valor
        tax = brl * taxRate
        total = brl + tax
      } else {
        // Vendendo: subtrai taxa do valor
        tax = brl * taxRate
        total = brl - tax
      }
    }

    return { brl, crypto, tax, total, taxRate }
  }, [brlValue, cryptoValue, selectedCrypto, cryptoPrices, operationType, inputMode])

  // Formatar valor BRL para input
  const formatBRLInput = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const amount = parseInt(numbers) / 100
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  // Handlers
  const handleBRLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) { // Máximo R$ 99.999.999,99
      setBrlValue(formatBRLInput(numbers))
      setInputMode('brl')
      setCryptoValue('')
    }
  }

  const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setCryptoValue(value)
      setInputMode('crypto')
      setBrlValue('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientData.name || (!brlValue && !cryptoValue)) return

    setLoading(true)
    const values = calculateValues()
    const currentPrice = cryptoPrices[selectedCrypto]

    const messageData = {
      name: clientData.name,
      cpf: clientData.cpf,
      amount: values.brl,
      crypto: selectedCrypto,
      cryptoAmount: values.crypto,
      price: currentPrice?.price_brl || 0,
      total: values.total,
      paymentMethod: clientData.paymentMethod,
      receivingMethod: clientData.paymentMethod,
    }

    const message = operationType === 'buy' 
      ? templates.quoteBuy(messageData)
      : templates.quoteSell(messageData)

    sendMessage(numbers.main, message)
    setLoading(false)
  }

  const values = calculateValues()
  const currentPrice = cryptoPrices[selectedCrypto]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Cotação <span className="text-orange-500">P2P</span> em Tempo Real
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Compre e venda criptomoedas com as melhores taxas do mercado
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
            <button
              onClick={() => fetchAllPrices(true)}
              disabled={isRetrying}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Tentando...' : 'Tentar novamente'}
            </button>
          </div>
        )}

        {/* Cards de Cotação */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SUPPORTED_CRYPTOS.slice(0, 4).map((crypto) => {
            const price = cryptoPrices[crypto.symbol]
            const isSelected = selectedCrypto === crypto.symbol
            
            return (
              <div
                key={crypto.symbol}
                onClick={() => setSelectedCrypto(crypto.symbol)}
                className={`relative bg-white dark:bg-gray-800 rounded-xl p-5 cursor-pointer transition-all hover:shadow-xl hover:transform hover:scale-105 ${
                  isSelected ? 'ring-2 ring-orange-500 shadow-xl transform scale-105' : 'shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Selecionado
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{crypto.symbol}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{crypto.name}</p>
                  </div>
                </div>

                {loadingPrices && !error ? (
                  <div className="flex items-center justify-center h-12">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : price ? (
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {price.price_brl.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </p>
                    <div className={`flex items-center gap-1 text-sm mt-1 ${
                      price.percent_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {price.percent_change_24h >= 0 ? 
                        <TrendingUp className="w-3 h-3" /> : 
                        <TrendingDown className="w-3 h-3" />
                      }
                      <span className="font-medium">
                        {Math.abs(price.percent_change_24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Indisponível</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
              {/* Tipo de Operação */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOperationType('buy')}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                    operationType === 'buy'
                      ? 'bg-green-500 text-white shadow-lg hover:bg-green-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Comprar
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOperationType('sell')}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                    operationType === 'sell'
                      ? 'bg-red-600 text-white shadow-lg hover:bg-red-700'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Bitcoin className="w-5 h-5" />
                    Vender
                  </span>
                </button>
              </div>

              {/* Seletor de Criptomoeda com Busca */}
              <CryptoSearchSelect
                selectedCrypto={selectedCrypto}
                onSelectCrypto={setSelectedCrypto}
                cryptoPrices={cryptoPrices}
                loadingPrices={loadingPrices}
                error={error}
                onRetry={() => fetchAllPrices(true)}
              />

              {/* Valores */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor em Reais (R$)
                  </label>
                  <input
                    type="text"
                    value={brlValue}
                    onChange={handleBRLChange}
                    placeholder="R$ 0,00"
                    className={`w-full p-4 border-2 rounded-xl text-xl font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                      inputMode === 'brl' 
                        ? 'border-primary focus:border-primary' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-gray-400'
                    } focus:outline-none`}
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="p-4 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all transform hover:scale-110"
                    onClick={() => setInputMode(inputMode === 'brl' ? 'crypto' : 'brl')}
                  >
                    <ArrowDownUp className="w-6 h-6" />
                  </button>
                </div>

                {operationType === 'sell' && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantidade de {selectedCrypto}
                    </label>
                    <input
                      type="text"
                      value={cryptoValue}
                      onChange={handleCryptoChange}
                      placeholder="0.00000000"
                      className={`w-full p-4 border-2 rounded-xl text-xl font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                        inputMode === 'crypto' 
                          ? 'border-primary focus:border-primary' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-gray-400'
                      } focus:outline-none`}
                    />
                  </div>
                )}
              </div>

              {/* Mostrar/Esconder Detalhes */}
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium"
              >
                {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {showDetails ? 'Ocultar' : 'Mostrar'} dados pessoais
              </button>

              {/* Dados Pessoais */}
              {showDetails && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientData.name}
                        onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={clientData.cpf}
                        onChange={(e) => setClientData({ ...clientData, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={clientData.phone}
                        onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                        placeholder="(21) 99999-9999"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={clientData.email}
                        onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Forma de {operationType === 'buy' ? 'Pagamento' : 'Recebimento'}
                    </label>
                    <select
                      value={clientData.paymentMethod}
                      onChange={(e) => setClientData({ ...clientData, paymentMethod: e.target.value })}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="PIX">PIX</option>
                      <option value="TED">TED</option>
                      <option value="Transferência">Transferência Bancária</option>
                      <option value="Dinheiro">Dinheiro (Presencial)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Botão Enviar */}
              <button
                type="submit"
                disabled={loading || !clientData.name || (!brlValue && !cryptoValue) || !currentPrice}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <MessageSquare className="w-6 h-6" />
                    Enviar Cotação via WhatsApp
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Resumo da Operação */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-fit sticky top-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-orange-500" />
              Resumo da Operação
            </h2>
            
            {currentPrice && (values.brl > 0 || values.crypto > 0) ? (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Operação:</span>
                    <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                      operationType === 'buy' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {operationType === 'buy' ? 'COMPRA' : 'VENDA'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Criptomoeda:</span>
                    <span className="font-semibold">{selectedCrypto}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Cotação:</span>
                    <span className="font-semibold">
                      {currentPrice.price_brl.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Quantidade:</span>
                    <span className="font-semibold">
                      {values.crypto.toFixed(8)} {selectedCrypto}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Valor:</span>
                    <span className="font-semibold">
                      {values.brl.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Taxa ({(values.taxRate * 100).toFixed(1)}%):
                    </span>
                    <span className="font-semibold text-orange-600">
                      {values.tax.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Total {operationType === 'buy' ? 'a Pagar' : 'a Receber'}:
                    </span>
                    <span className="text-2xl font-bold">
                      {values.total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Volumes maiores têm taxas menores!
                  </p>
                </div>
              </div>
            ) : loadingPrices ? (
              <div className="text-center py-12 text-gray-400">
                <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin opacity-20" />
                <p>Carregando cotação...</p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Bitcoin className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Digite um valor para ver o resumo</p>
              </div>
            )}

            {/* Tabela de Taxas */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Tabela de Taxas</h3>
              <div className="space-y-2">
                {[
                  { range: 'Até R$ 1.000', rate: '3,5%' },
                  { range: 'R$ 1.001 - R$ 5.000', rate: '3,0%' },
                  { range: 'R$ 5.001 - R$ 10.000', rate: '2,5%' },
                  { range: 'R$ 10.001 - R$ 50.000', rate: '2,0%' },
                  { range: 'Acima de R$ 50.000', rate: '1,5%' },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.range}</span>
                    <span className="text-sm font-bold text-orange-500">{item.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Operação Rápida</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transferências em até 15 minutos após confirmação
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">100% Seguro</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Empresa registrada com CNPJ e compliance completo
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Suporte Humano</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Atendimento personalizado via WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}