'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  Info
} from 'lucide-react'

// Lista de criptomoedas suportadas com classes Tailwind
const SUPPORTED_CRYPTOS = [
  { symbol: 'BTC', name: 'Bitcoin', colorClass: 'bg-orange-500', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', colorClass: 'bg-indigo-500', icon: 'Ξ' },
  { symbol: 'USDT', name: 'Tether', colorClass: 'bg-green-500', icon: '₮' },
  { symbol: 'BNB', name: 'Binance Coin', colorClass: 'bg-yellow-500', icon: 'BNB' },
  { symbol: 'SOL', name: 'Solana', colorClass: 'bg-purple-500', icon: 'SOL' },
  { symbol: 'XRP', name: 'Ripple', colorClass: 'bg-gray-700', icon: 'XRP' },
  { symbol: 'ADA', name: 'Cardano', colorClass: 'bg-blue-600', icon: 'ADA' },
  { symbol: 'DOGE', name: 'Dogecoin', colorClass: 'bg-yellow-600', icon: 'Ð' },
  { symbol: 'AVAX', name: 'Avalanche', colorClass: 'bg-red-500', icon: 'AVAX' },
  { symbol: 'DOT', name: 'Polkadot', colorClass: 'bg-pink-500', icon: 'DOT' },
  { symbol: 'MATIC', name: 'Polygon', colorClass: 'bg-purple-600', icon: 'MATIC' },
  { symbol: 'LTC', name: 'Litecoin', colorClass: 'bg-gray-500', icon: 'Ł' },
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

export default function CotacaoDinamica() {
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
  const [dropdownOpen, setDropdownOpen] = useState(false)

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

  const fetchAllPrices = async () => {
    try {
      setLoadingPrices(true)
      const symbols = SUPPORTED_CRYPTOS.map(c => c.symbol).join(',')
      const response = await fetch(`/api/cotacao?multiple=${symbols}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        setCryptoPrices(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar cotações:', error)
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
  const selectedCryptoInfo = SUPPORTED_CRYPTOS.find(c => c.symbol === selectedCrypto)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Cotação P2P em Tempo Real
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Compre e venda criptomoedas com as melhores taxas do mercado
          </p>
        </div>

        {/* Cards de Cotação - Design melhorado */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SUPPORTED_CRYPTOS.slice(0, 4).map((crypto) => {
            const price = cryptoPrices[crypto.symbol]
            const isSelected = selectedCrypto === crypto.symbol
            
            return (
              <div
                key={crypto.symbol}
                onClick={() => setSelectedCrypto(crypto.symbol)}
                className={`relative bg-white dark:bg-gray-800 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 ${
                  isSelected ? 'ring-2 ring-primary shadow-lg scale-105' : 'shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    Selecionado
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${crypto.colorClass}`}
                    >
                      {crypto.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{crypto.symbol}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{crypto.name}</p>
                    </div>
                  </div>
                </div>

                {loadingPrices ? (
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
                  <p className="text-gray-400">--</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal - Design melhorado */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
              {/* Tipo de Operação - Pills melhorados */}
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOperationType('buy')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    operationType === 'buy'
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Comprar
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOperationType('sell')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    operationType === 'sell'
                      ? 'bg-red-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Bitcoin className="w-4 h-4" />
                    Vender
                  </span>
                </button>
              </div>

              {/* Seletor de Criptomoeda - Dropdown customizado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Escolha a Criptomoeda
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-between hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${selectedCryptoInfo?.colorClass || 'bg-gray-500'}`}
                      >
                        {selectedCryptoInfo?.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedCryptoInfo?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedCrypto}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 max-h-64 overflow-y-auto">
                      {SUPPORTED_CRYPTOS.map((crypto) => (
                        <button
                          key={crypto.symbol}
                          type="button"
                          onClick={() => {
                            setSelectedCrypto(crypto.symbol)
                            setDropdownOpen(false)
                          }}
                          className="w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-3 transition-colors"
                        >
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${crypto.colorClass}`}
                          >
                            {crypto.icon}
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{crypto.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</p>
                          </div>
                          {cryptoPrices[crypto.symbol] && (
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {cryptoPrices[crypto.symbol].price_brl.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              })}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Valores - Design melhorado */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor em Reais (R$)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={brlValue}
                      onChange={handleBRLChange}
                      placeholder="R$ 0,00"
                      className={`w-full p-4 pl-12 border rounded-xl text-lg font-semibold bg-white dark:bg-gray-700 dark:text-white transition-all ${
                        inputMode === 'brl' 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      R$
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="p-3 rounded-full bg-gradient-to-r from-primary to-orange-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
                    onClick={() => setInputMode(inputMode === 'brl' ? 'crypto' : 'brl')}
                  >
                    <ArrowDownUp className="w-5 h-5" />
                  </button>
                </div>

                {operationType === 'sell' && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantidade de {selectedCrypto}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cryptoValue}
                        onChange={handleCryptoChange}
                        placeholder="0.00000000"
                        className={`w-full p-4 pr-16 border rounded-xl text-lg font-semibold bg-white dark:bg-gray-700 dark:text-white transition-all ${
                          inputMode === 'crypto' 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        {selectedCrypto}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mostrar/Esconder Detalhes - Botão melhorado */}
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showDetails ? 'Ocultar' : 'Mostrar'} dados pessoais
              </button>

              {/* Dados Pessoais - Campos melhorados */}
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
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="PIX">PIX</option>
                      <option value="TED">TED</option>
                      <option value="Transferência">Transferência Bancária</option>
                      <option value="Dinheiro">Dinheiro (Presencial)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Botão Enviar - Design melhorado */}
              <button
                type="submit"
                disabled={loading || !clientData.name || (!brlValue && !cryptoValue)}
                className="w-full bg-gradient-to-r from-primary to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Enviar Cotação via WhatsApp
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Resumo da Operação - Design melhorado */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-fit sticky top-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="w-6 h-6 text-primary" />
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
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${selectedCryptoInfo?.colorClass || 'bg-gray-500'}`}
                      >
                        {selectedCryptoInfo?.icon}
                      </div>
                      <span className="font-semibold">{selectedCrypto}</span>
                    </div>
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

                <div className="bg-gradient-to-r from-primary to-orange-600 rounded-xl p-4 text-white">
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

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Volumes maiores têm taxas menores!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Bitcoin className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Digite um valor para ver o resumo</p>
              </div>
            )}

            {/* Tabela de Taxas - Design melhorado */}
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
                    <span className="text-sm font-bold text-primary">{item.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais - Cards melhorados */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Operação Rápida</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transferências em até 15 minutos após confirmação
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">100% Seguro</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Empresa registrada com CNPJ e compliance completo
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
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