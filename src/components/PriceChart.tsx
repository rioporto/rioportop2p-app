'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  BarChart,
  ComposedChart
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'

interface PriceData {
  time: string
  price: number
  volume?: number
  high?: number
  low?: number
}

interface PriceChartProps {
  crypto: 'BTC' | 'ETH' | 'USDT'
  period: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'
  chartType?: 'line' | 'area' | 'candle'
  showVolume?: boolean
  height?: number
}

export default function PriceChart({ 
  crypto = 'BTC', 
  period = '1D',
  chartType = 'area',
  showVolume = false,
  height = 400 
}: PriceChartProps) {
  const [data, setData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    currentPrice: 0,
    previousPrice: 0,
    change: 0,
    changePercent: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0
  })

  useEffect(() => {
    loadPriceData()
  }, [crypto, period])

  const loadPriceData = async () => {
    setLoading(true)
    
    try {
      // Simular dados de preço
      const mockData = generateMockData(period)
      setData(mockData)
      
      // Calcular estatísticas
      const currentPrice = mockData[mockData.length - 1].price
      const previousPrice = mockData[0].price
      const change = currentPrice - previousPrice
      const changePercent = (change / previousPrice) * 100
      
      const prices = mockData.map(d => d.price)
      const high24h = Math.max(...prices)
      const low24h = Math.min(...prices)
      const volume24h = mockData.reduce((sum, d) => sum + (d.volume || 0), 0)
      
      setStats({
        currentPrice,
        previousPrice,
        change,
        changePercent,
        high24h,
        low24h,
        volume24h
      })
    } catch (error) {
      console.error('Erro ao carregar dados de preço:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = (period: string): PriceData[] => {
    const basePrice = crypto === 'BTC' ? 625000 : crypto === 'ETH' ? 12000 : 5.15
    const volatility = crypto === 'BTC' ? 0.02 : crypto === 'ETH' ? 0.03 : 0.001
    
    let points = 24
    let interval = 1 // horas
    
    switch (period) {
      case '1W':
        points = 7 * 24
        interval = 1
        break
      case '1M':
        points = 30
        interval = 24
        break
      case '3M':
        points = 90
        interval = 24
        break
      case '1Y':
        points = 365
        interval = 24
        break
      case 'ALL':
        points = 365 * 2
        interval = 24
        break
    }
    
    const data: PriceData[] = []
    const now = new Date()
    
    for (let i = 0; i < points; i++) {
      const time = new Date(now.getTime() - (points - i) * interval * 60 * 60 * 1000)
      const randomChange = (Math.random() - 0.5) * volatility
      const price = basePrice * (1 + randomChange + (i / points) * 0.01)
      const volume = Math.random() * 1000000 * (crypto === 'BTC' ? 10 : crypto === 'ETH' ? 5 : 100)
      
      data.push({
        time: formatTime(time, period),
        price: parseFloat(price.toFixed(2)),
        volume: parseFloat(volume.toFixed(2)),
        high: parseFloat((price * (1 + Math.random() * 0.01)).toFixed(2)),
        low: parseFloat((price * (1 - Math.random() * 0.01)).toFixed(2))
      })
    }
    
    return data
  }

  const formatTime = (date: Date, period: string): string => {
    if (period === '1D') {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (period === '1W') {
      return date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
    }
  }

  const formatPrice = (value: number) => {
    if (crypto === 'USDT') {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 3
      })
    }
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatVolume = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`
    }
    return value.toFixed(0)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">{payload[0].payload.time}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatPrice(payload[0].value)}
          </p>
          {payload[0].payload.volume && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Volume: {formatVolume(payload[0].payload.volume)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded-lg mb-4"></div>
        <div className={`bg-gray-200 dark:bg-slate-700 rounded-lg`} style={{ height }}></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Price Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {crypto}/BRL
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                {period}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(stats.currentPrice)}
              </span>
              <div className={`flex items-center space-x-1 ${
                stats.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {stats.change >= 0 ? '+' : ''}{stats.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Alta 24h:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                {formatPrice(stats.high24h)}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Baixa 24h:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                {formatPrice(stats.low24h)}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Volume 24h:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                {formatVolume(stats.volume24h)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        {chartType === 'area' && (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {chartType === 'line' && (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {showVolume && (
          <div className="mt-4 border-t border-gray-200 dark:border-slate-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Volume de Negociação
            </h4>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={formatVolume}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="volume" fill="#3b82f6" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Os preços são atualizados em tempo real e refletem a cotação média do mercado P2P brasileiro.
        </p>
      </div>
    </div>
  )
}