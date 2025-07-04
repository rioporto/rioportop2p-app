'use client'

import { useState } from 'react'
import { 
  Download, 
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'

interface ReportSummary {
  period: string
  totalVolume: string
  totalTransactions: number
  averageTicket: string
  growth: number
  topCrypto: string
  activeUsers: number
}

const mockSummary: ReportSummary = {
  period: 'Março 2024',
  totalVolume: 'R$ 2,450,000.00',
  totalTransactions: 1234,
  averageTicket: 'R$ 1,986.00',
  growth: 15.3,
  topCrypto: 'BTC',
  activeUsers: 342
}

const mockMonthlyData = [
  { month: 'Jan', volume: 1850000, transactions: 987 },
  { month: 'Fev', volume: 2120000, transactions: 1123 },
  { month: 'Mar', volume: 2450000, transactions: 1234 },
]

const mockCryptoDistribution = [
  { crypto: 'BTC', percentage: 45, volume: 'R$ 1,102,500' },
  { crypto: 'USDT', percentage: 30, volume: 'R$ 735,000' },
  { crypto: 'ETH', percentage: 15, volume: 'R$ 367,500' },
  { crypto: 'USDC', percentage: 10, volume: 'R$ 245,000' },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('general')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios de Transações</h1>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="day">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
            <option value="custom">Personalizado</option>
          </select>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Volume Total</p>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockSummary.totalVolume}</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+{mockSummary.growth}%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total de Transações</p>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockSummary.totalTransactions}</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+8.2%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ticket Médio</p>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockSummary.averageTicket}</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">-2.1%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Usuários Ativos</p>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockSummary.activeUsers}</p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">+12.5%</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">vs mês anterior</span>
          </div>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedReport('general')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReport === 'general'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Relatório Geral
          </button>
          <button
            onClick={() => setSelectedReport('crypto')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReport === 'crypto'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Por Criptomoeda
          </button>
          <button
            onClick={() => setSelectedReport('users')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReport === 'users'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Por Usuário
          </button>
          <button
            onClick={() => setSelectedReport('fees')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedReport === 'fees'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Taxas e Comissões
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Volume Mensal</h2>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mockMonthlyData.map((data, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{data.month}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    R$ {(data.volume / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${(data.volume / 2500000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crypto Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Distribuição por Cripto</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {mockCryptoDistribution.map((crypto, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-orange-600' :
                    index === 1 ? 'bg-blue-600' :
                    index === 2 ? 'bg-green-600' :
                    'bg-purple-600'
                  }`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{crypto.crypto}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{crypto.percentage}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{crypto.volume}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Detalhamento</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Volume Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ticket Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Taxa Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Crescimento
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockMonthlyData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {data.month} 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {data.transactions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    R$ {data.volume.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    R$ {(data.volume / data.transactions).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    R$ {(data.volume * 0.02).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1">
                      {index > 0 ? (
                        <>
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">
                            +{((data.volume / mockMonthlyData[index - 1].volume - 1) * 100).toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Opções de Exportação</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Exportar CSV</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Exportar Excel</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Agendar Relatório</span>
          </button>
        </div>
      </div>
    </div>
  )
}