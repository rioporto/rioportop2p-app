'use client'

import { useState } from 'react'
import { Calculator, TrendingDown, Info, ArrowRight } from 'lucide-react'

interface FeeRange {
  min: number
  max: number
  rate: number
  label: string
  color: string
}

const FEE_RANGES: FeeRange[] = [
  { min: 0, max: 1000, rate: 0.035, label: 'Até R$ 1.000', color: 'red' },
  { min: 1001, max: 5000, rate: 0.03, label: 'R$ 1.001 - R$ 5.000', color: 'orange' },
  { min: 5001, max: 10000, rate: 0.025, label: 'R$ 5.001 - R$ 10.000', color: 'yellow' },
  { min: 10001, max: 50000, rate: 0.02, label: 'R$ 10.001 - R$ 50.000', color: 'green' },
  { min: 50001, max: Infinity, rate: 0.015, label: 'Acima de R$ 50.000', color: 'blue' }
]

export default function FeeCalculator() {
  const [amount, setAmount] = useState('')
  const [operationType, setOperationType] = useState<'buy' | 'sell'>('buy')
  const [showComparison, setShowComparison] = useState(false)

  const formatBRLInput = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const amount = parseInt(numbers) / 100
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) { // Máximo R$ 99.999.999,99
      setAmount(formatBRLInput(numbers))
    }
  }

  const getAmountValue = () => {
    return parseFloat(amount.replace(/\D/g, '')) / 100
  }

  const getFeeRange = (value: number): FeeRange => {
    return FEE_RANGES.find(range => value >= range.min && value <= range.max) || FEE_RANGES[FEE_RANGES.length - 1]
  }

  const calculateFee = (value: number, rate: number) => {
    return value * rate
  }

  const amountValue = getAmountValue()
  const feeRange = getFeeRange(amountValue)
  const feeAmount = calculateFee(amountValue, feeRange.rate)
  const totalAmount = operationType === 'buy' ? amountValue + feeAmount : amountValue - feeAmount

  // Comparação com concorrentes
  const competitorFees = [
    { name: 'Binance P2P', rate: 0.0, fixed: 0, note: '0% (vendedor paga)' },
    { name: 'Mercado Bitcoin', rate: 0.049, fixed: 0, note: '4.9% + spread' },
    { name: 'Foxbit', rate: 0.025, fixed: 0, note: '2.5% + spread' },
    { name: 'NovaDAX', rate: 0.025, fixed: 0, note: '2.5%' }
  ]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-orange-500" />
          Calculadora de Taxas
        </h2>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          {showComparison ? 'Ocultar' : 'Ver'} comparação
        </button>
      </div>

      {/* Tipo de Operação */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setOperationType('buy')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            operationType === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          Comprar
        </button>
        <button
          onClick={() => setOperationType('sell')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            operationType === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          Vender
        </button>
      </div>

      {/* Input de Valor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Valor da Operação
        </label>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="R$ 0,00"
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-lg font-semibold bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Resultado */}
      {amountValue > 0 && (
        <div className="space-y-4">
          {/* Faixa de Taxa */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Faixa de valor:</span>
              <span className="font-medium text-gray-900 dark:text-white">{feeRange.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Taxa aplicada:</span>
              <span className={`font-bold text-lg ${
                feeRange.color === 'red' ? 'text-red-600' :
                feeRange.color === 'orange' ? 'text-orange-600' :
                feeRange.color === 'yellow' ? 'text-yellow-600' :
                feeRange.color === 'green' ? 'text-green-600' :
                'text-blue-600'
              }`}>
                {(feeRange.rate * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Detalhamento */}
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Valor da operação:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {amountValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Taxa Rio Porto P2P:</span>
              <span className="font-medium text-orange-600">
                {feeAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-600 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  Total {operationType === 'buy' ? 'a pagar' : 'a receber'}:
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>

          {/* Visual das Faixas */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Visualização das faixas de taxa
            </h4>
            <div className="space-y-2">
              {FEE_RANGES.map((range, index) => {
                const isActive = amountValue >= range.min && amountValue <= range.max
                return (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-lg p-3 transition-all ${
                      isActive 
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500' 
                        : 'bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-sm font-medium ${
                          isActive ? 'text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {range.label}
                        </span>
                        {isActive && (
                          <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                            Sua faixa
                          </span>
                        )}
                      </div>
                      <span className={`text-lg font-bold ${
                        isActive ? 'text-orange-600' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {(range.rate * 100).toFixed(1)}%
                      </span>
                    </div>
                    
                    {/* Progress bar visual */}
                    <div className="mt-2 h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          range.color === 'red' ? 'bg-red-500' :
                          range.color === 'orange' ? 'bg-orange-500' :
                          range.color === 'yellow' ? 'bg-yellow-500' :
                          range.color === 'green' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}
                        style={{ 
                          width: `${100 - (index * 20)}%`,
                          opacity: isActive ? 1 : 0.3
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Comparação com Concorrentes */}
          {showComparison && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Comparação com outras plataformas
              </h4>
              <div className="space-y-3">
                {competitorFees.map((competitor, index) => {
                  const competitorFee = calculateFee(amountValue, competitor.rate) + competitor.fixed
                  const savings = competitorFee - feeAmount
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {competitor.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {competitor.note}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {competitorFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        {savings > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Economize {savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dica */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Dica para economizar:</p>
            <p>Quanto maior o volume da operação, menor a taxa aplicada. Considere agrupar suas operações para obter melhores taxas!</p>
          </div>
        </div>
      </div>
    </div>
  )
}