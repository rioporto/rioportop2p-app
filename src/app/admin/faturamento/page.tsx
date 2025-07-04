'use client'

import { useState } from 'react'
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Receipt,
  AlertCircle
} from 'lucide-react'

interface RevenueData {
  period: string
  revenue: number
  costs: number
  profit: number
  transactions: number
  averageTicket: number
  growth: number
}

const mockRevenueData: RevenueData[] = [
  {
    period: 'Janeiro 2024',
    revenue: 98500.00,
    costs: 12300.00,
    profit: 86200.00,
    transactions: 823,
    averageTicket: 119.71,
    growth: 0
  },
  {
    period: 'Fevereiro 2024',
    revenue: 112300.00,
    costs: 14500.00,
    profit: 97800.00,
    transactions: 945,
    averageTicket: 118.84,
    growth: 14.01
  },
  {
    period: 'Março 2024',
    revenue: 125342.50,
    costs: 16200.00,
    profit: 109142.50,
    transactions: 1234,
    averageTicket: 101.61,
    growth: 11.63
  }
]

const mockRevenueBreakdown = [
  { source: 'Taxas P2P', amount: 89450.00, percentage: 71.3 },
  { source: 'Taxas de Saque', amount: 18500.00, percentage: 14.8 },
  { source: 'Taxas Premium', amount: 12342.50, percentage: 9.8 },
  { source: 'Outros', amount: 5050.00, percentage: 4.1 }
]

const mockExpenses = [
  { category: 'Processamento PIX', amount: 8500.00, percentage: 52.5 },
  { category: 'Infraestrutura', amount: 3200.00, percentage: 19.8 },
  { category: 'Suporte', amount: 2800.00, percentage: 17.3 },
  { category: 'Marketing', amount: 1700.00, percentage: 10.4 }
]

export default function BillingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedView, setSelectedView] = useState('overview')

  const currentMonth = mockRevenueData[mockRevenueData.length - 1]
  const previousMonth = mockRevenueData[mockRevenueData.length - 2]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Faturamento</h1>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
          </select>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Receita Total</p>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {currentMonth.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {currentMonth.growth > 0 ? (
              <>
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+{currentMonth.growth.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">{currentMonth.growth.toFixed(1)}%</span>
              </>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Custos Operacionais</p>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {currentMonth.costs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {((currentMonth.costs / currentMonth.revenue) * 100).toFixed(1)}% da receita
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Lucro Líquido</p>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            R$ {currentMonth.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Margem: {((currentMonth.profit / currentMonth.revenue) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ticket Médio</p>
            <Receipt className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ {currentMonth.averageTicket.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentMonth.transactions} transações
            </span>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'overview'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setSelectedView('revenue')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'revenue'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => setSelectedView('expenses')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'expenses'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Despesas
          </button>
          <button
            onClick={() => setSelectedView('invoices')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === 'invoices'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Notas Fiscais
          </button>
        </div>
      </div>

      {/* Content based on selected view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Fontes de Receita</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mockRevenueBreakdown.map((source, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{source.source}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    R$ {source.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {source.percentage}% do total
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Despesas Operacionais</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mockExpenses.map((expense, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{expense.category}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${expense.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {expense.percentage}% do total
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Comparativo Mensal</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Custos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Lucro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Margem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Crescimento
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockRevenueData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {data.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    R$ {data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    R$ {data.costs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    R$ {data.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {((data.profit / data.revenue) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {data.growth !== 0 ? (
                      <div className="flex items-center gap-1">
                        {data.growth > 0 ? (
                          <>
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">+{data.growth.toFixed(1)}%</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                            <span className="text-red-600">{data.growth.toFixed(1)}%</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Gerar Nota Fiscal</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Agendar Relatório</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Configurar Alertas</span>
          </button>
        </div>
      </div>
    </div>
  )
}