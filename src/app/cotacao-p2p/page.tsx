'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useWhatsApp } from '@/lib/whatsapp'
import { ArrowDownUp, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'

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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Cotação P2P em Tempo Real</h1>

        {/* Cards de Cotação */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {SUPPORTED_CRYPTOS.slice(0, 4).map((crypto) => {
            const price = cryptoPrices[crypto.symbol]
            return (
              <div
                key={crypto.symbol}
                onClick={() => setSelectedCrypto(crypto.symbol)}
                className={`bg-card rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCrypto === crypto.symbol ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{crypto.symbol}</h3>
                  {price && (
                    <span className={`text-sm flex items-center ${
                      price.percent_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {price.percent_change_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(price.percent_change_24h).toFixed(2)}%
                    </span>
                  )}
                </div>
                {loadingPrices ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : price ? (
                  <p className="text-lg font-bold">
                    {price.price_brl.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </p>
                ) : (
                  <p className="text-gray-500">--</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 space-y-6">
              {/* Tipo de Operação */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setOperationType('buy')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    operationType === 'buy'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  Comprar
                </button>
                <button
                  type="button"
                  onClick={() => setOperationType('sell')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                    operationType === 'sell'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  Vender
                </button>
              </div>

              {/* Seletor de Criptomoeda */}
              <div>
                <label className="block text-sm font-medium mb-2">Criptomoeda</label>
                <select
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  {SUPPORTED_CRYPTOS.map((crypto) => (
                    <option key={crypto.symbol} value={crypto.symbol}>
                      {crypto.name} ({crypto.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Valores */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Valor em Reais (R$)
                  </label>
                  <input
                    type="text"
                    value={brlValue}
                    onChange={handleBRLChange}
                    placeholder="R$ 0,00"
                    className="w-full p-3 border rounded-lg text-lg bg-background"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                    onClick={() => setInputMode(inputMode === 'brl' ? 'crypto' : 'brl')}
                  >
                    <ArrowDownUp className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantidade de {selectedCrypto}
                  </label>
                  <input
                    type="text"
                    value={cryptoValue}
                    onChange={handleCryptoChange}
                    placeholder="0.00000000"
                    className="w-full p-3 border rounded-lg text-lg bg-background"
                  />
                </div>
              </div>

              {/* Mostrar/Esconder Detalhes */}
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-primary text-sm hover:underline"
              >
                {showDetails ? 'Ocultar' : 'Mostrar'} dados pessoais
              </button>

              {/* Dados Pessoais */}
              {showDetails && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={clientData.name}
                        onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                        className="w-full p-3 border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CPF</label>
                      <input
                        type="text"
                        value={clientData.cpf}
                        onChange={(e) => setClientData({ ...clientData, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className="w-full p-3 border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={clientData.phone}
                        onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                        placeholder="(21) 99999-9999"
                        className="w-full p-3 border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={clientData.email}
                        onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                        className="w-full p-3 border rounded-lg bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Forma de {operationType === 'buy' ? 'Pagamento' : 'Recebimento'}
                    </label>
                    <select
                      value={clientData.paymentMethod}
                      onChange={(e) => setClientData({ ...clientData, paymentMethod: e.target.value })}
                      className="w-full p-3 border rounded-lg bg-background"
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
                disabled={loading || !clientData.name || (!brlValue && !cryptoValue)}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processando...
                  </span>
                ) : (
                  'Enviar Cotação via WhatsApp'
                )}
              </button>
            </form>
          </div>

          {/* Resumo da Operação */}
          <div className="bg-card rounded-lg p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumo da Operação</h2>
            
            {currentPrice && (values.brl > 0 || values.crypto > 0) ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Operação:</span>
                  <span className="font-semibold">
                    {operationType === 'buy' ? 'COMPRA' : 'VENDA'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Criptomoeda:</span>
                  <span className="font-semibold">{selectedCrypto}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Cotação:</span>
                  <span className="font-semibold">
                    {currentPrice.price_brl.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Quantidade:</span>
                  <span className="font-semibold">
                    {values.crypto.toFixed(8)} {selectedCrypto}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-semibold">
                    {values.brl.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa ({(values.taxRate * 100).toFixed(1)}%):</span>
                  <span className="font-semibold">
                    {values.tax.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Total {operationType === 'buy' ? 'a Pagar' : 'a Receber'}:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {values.total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 Dica: Volumes maiores têm taxas menores!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Digite um valor para ver o resumo</p>
              </div>
            )}

            {/* Tabela de Taxas */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">Tabela de Taxas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Até R$ 1.000</span>
                  <span className="font-medium">3,5%</span>
                </div>
                <div className="flex justify-between">
                  <span>R$ 1.001 - R$ 5.000</span>
                  <span className="font-medium">3,0%</span>
                </div>
                <div className="flex justify-between">
                  <span>R$ 5.001 - R$ 10.000</span>
                  <span className="font-medium">2,5%</span>
                </div>
                <div className="flex justify-between">
                  <span>R$ 10.001 - R$ 50.000</span>
                  <span className="font-medium">2,0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Acima de R$ 50.000</span>
                  <span className="font-medium">1,5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">🚀 Operação Rápida</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transferências em até 15 minutos após confirmação
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">🔒 100% Seguro</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Empresa registrada com CNPJ e compliance completo
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">💬 Suporte Humano</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Atendimento personalizado via WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}