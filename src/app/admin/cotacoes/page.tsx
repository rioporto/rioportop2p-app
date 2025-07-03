'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Settings,
  AlertCircle,
  Check,
  X,
  Plus,
  Edit2,
  DollarSign,
  Percent
} from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface CryptoPrice {
  id: string
  symbol: string
  name: string
  currentPrice: number
  change24h: number
  volume24h: number
  marketCap: number
  lastUpdate: string
  spread: {
    buy: number
    sell: number
  }
  override?: {
    type: 'fixed' | 'percentage'
    value: number
  }
}

const mockPrices: CryptoPrice[] = [
  {
    id: '1',
    symbol: 'BTC',
    name: 'Bitcoin',
    currentPrice: 160234.50,
    change24h: 2.34,
    volume24h: 1234567890,
    marketCap: 3123456789012,
    lastUpdate: '2024-01-10T12:30:00',
    spread: { buy: 1.5, sell: 1.5 }
  },
  {
    id: '2',
    symbol: 'ETH',
    name: 'Ethereum',
    currentPrice: 8456.30,
    change24h: -1.23,
    volume24h: 234567890,
    marketCap: 987654321098,
    lastUpdate: '2024-01-10T12:30:00',
    spread: { buy: 1.5, sell: 1.5 }
  },
  {
    id: '3',
    symbol: 'USDT',
    name: 'Tether',
    currentPrice: 5.02,
    change24h: 0.05,
    volume24h: 456789012,
    marketCap: 456789012345,
    lastUpdate: '2024-01-10T12:30:00',
    spread: { buy: 0.5, sell: 0.5 },
    override: { type: 'fixed', value: 0.02 }
  }
]

const priceHistoryData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [
    {
      label: 'Bitcoin',
      data: [158000, 159000, 158500, 160000, 161000, 160500, 160234],
      borderColor: 'rgb(249, 115, 22)',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Ethereum',
      data: [8500, 8450, 8400, 8550, 8500, 8480, 8456],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}

const volumeData = {
  labels: ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'],
  datasets: [
    {
      label: 'Volume 24h (BRL)',
      data: [1234567890, 234567890, 456789012, 123456789, 98765432],
      backgroundColor: [
        'rgba(249, 115, 22, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ]
    }
  ]
}

export default function QuotationsManagement() {
  const [prices, setPrices] = useState(mockPrices)
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoPrice | null>(null)
  const [isEditingSpread, setIsEditingSpread] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // segundos

  const handleUpdateSpread = (cryptoId: string, buySpread: number, sellSpread: number) => {
    setPrices(prices.map(p => 
      p.id === cryptoId 
        ? { ...p, spread: { buy: buySpread, sell: sellSpread } }
        : p
    ))
    setIsEditingSpread(false)
  }

  const handleAddOverride = (cryptoId: string, type: 'fixed' | 'percentage', value: number) => {
    setPrices(prices.map(p => 
      p.id === cryptoId 
        ? { ...p, override: { type, value } }
        : p
    ))
  }

  const handleRemoveOverride = (cryptoId: string) => {
    setPrices(prices.map(p => 
      p.id === cryptoId 
        ? { ...p, override: undefined }
        : p
    ))
  }

  const calculateFinalPrice = (price: CryptoPrice, type: 'buy' | 'sell') => {
    let finalPrice = price.currentPrice
    
    // Apply override if exists
    if (price.override) {
      if (price.override.type === 'fixed') {
        finalPrice += price.override.value
      } else {
        finalPrice *= (1 + price.override.value / 100)
      }
    }
    
    // Apply spread
    const spread = type === 'buy' ? price.spread.buy : price.spread.sell
    finalPrice *= (1 + spread / 100)
    
    return finalPrice
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Cotações</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Auto-refresh:</label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg ${
                autoRefresh 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            {autoRefresh && (
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1min</option>
                <option value={300}>5min</option>
              </select>
            )}
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </button>
        </div>
      </div>

      {/* Price Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prices.slice(0, 3).map((crypto) => (
          <div key={crypto.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {crypto.name} ({crypto.symbol})
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  R$ {crypto.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`flex items-center space-x-1 ${
                crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {crypto.change24h >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="font-medium">{Math.abs(crypto.change24h).toFixed(2)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Compra</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  R$ {calculateFinalPrice(crypto, 'buy').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Venda</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  R$ {calculateFinalPrice(crypto, 'sell').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            {crypto.override && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-400">
                Override ativo: {crypto.override.type === 'fixed' ? `+R$ ${crypto.override.value}` : `+${crypto.override.value}%`}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Histórico de Preços (24h)
          </h3>
          <div className="h-64">
            <Line data={priceHistoryData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Volume de Transações
          </h3>
          <div className="h-64">
            <Bar data={volumeData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Spread Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Configuração de Spreads e Overrides
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Criptomoeda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Preço Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Spread Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Spread Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Override
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {prices.map((crypto) => (
                <tr key={crypto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {crypto.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {crypto.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      R$ {crypto.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Percent className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {crypto.spread.buy}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Percent className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {crypto.spread.sell}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {crypto.override ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {crypto.override.type === 'fixed' 
                            ? `+R$ ${crypto.override.value}` 
                            : `+${crypto.override.value}%`}
                        </span>
                        <button
                          onClick={() => handleRemoveOverride(crypto.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedCrypto(crypto)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedCrypto && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Editar Configurações - {selectedCrypto.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Spread de Compra (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={selectedCrypto.spread.buy}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Spread de Venda (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={selectedCrypto.spread.sell}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Override de Preço
                </label>
                <div className="flex space-x-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white">
                    <option value="">Sem override</option>
                    <option value="fixed">Valor fixo (R$)</option>
                    <option value="percentage">Porcentagem (%)</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Valor"
                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedCrypto(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Save logic here
                  setSelectedCrypto(null)
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}