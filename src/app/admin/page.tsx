'use client'

import { 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign,
  TrendingUp,
  Activity,
  Bitcoin,
  BookOpen
} from 'lucide-react'
import { useState, useEffect } from 'react'

const stats = [
  {
    name: 'Usuários Ativos',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    name: 'Volume Total (BRL)',
    value: 'R$ 2.4M',
    change: '+23.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    name: 'Transações Hoje',
    value: '89',
    change: '-5.4%',
    trend: 'down',
    icon: Activity,
    color: 'bg-orange-500',
  },
  {
    name: 'Taxa Média',
    value: '2.3%',
    change: '+0.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-purple-500',
  },
]

const recentTransactions = [
  {
    id: 1,
    user: 'João Silva',
    type: 'buy',
    amount: 'R$ 5,000',
    btc: '0.0312 BTC',
    status: 'completed',
    time: '10 min atrás',
  },
  {
    id: 2,
    user: 'Maria Santos',
    type: 'sell',
    amount: 'R$ 12,500',
    btc: '0.0780 BTC',
    status: 'pending',
    time: '25 min atrás',
  },
  {
    id: 3,
    user: 'Pedro Costa',
    type: 'buy',
    amount: 'R$ 3,200',
    btc: '0.0200 BTC',
    status: 'completed',
    time: '1 hora atrás',
  },
  {
    id: 4,
    user: 'Ana Oliveira',
    type: 'sell',
    amount: 'R$ 8,900',
    btc: '0.0556 BTC',
    status: 'completed',
    time: '2 horas atrás',
  },
  {
    id: 5,
    user: 'Carlos Mendes',
    type: 'buy',
    amount: 'R$ 15,000',
    btc: '0.0937 BTC',
    status: 'processing',
    time: '3 horas atrás',
  },
]

const topUsers = [
  { name: 'Roberto Lima', volume: 'R$ 125,000', trades: 45, level: 3 },
  { name: 'Fernanda Costa', volume: 'R$ 98,500', trades: 38, level: 3 },
  { name: 'Lucas Almeida', volume: 'R$ 87,200', trades: 32, level: 2 },
  { name: 'Patricia Santos', volume: 'R$ 76,800', trades: 29, level: 2 },
  { name: 'Marcos Oliveira', volume: 'R$ 65,400', trades: 24, level: 2 },
]

export default function AdminDashboard() {
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // Só atualiza no cliente para evitar erro de hydration
    setLastUpdate(new Date().toLocaleString('pt-BR'));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {lastUpdate && `Última atualização: ${lastUpdate}`}
          </span>
          <button 
            onClick={() => setLastUpdate(new Date().toLocaleString('pt-BR'))}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span
                className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Transações Recentes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tempo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.user}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {transaction.type === 'buy' ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-900 dark:text-white">
                          {transaction.type === 'buy' ? 'Compra' : 'Venda'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {transaction.amount}
                      </div>
                      <div className="text-xs text-gray-500">{transaction.btc}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {transaction.status === 'completed'
                          ? 'Concluída'
                          : transaction.status === 'pending'
                          ? 'Pendente'
                          : 'Processando'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Top Usuários
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                        {index + 1}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.trades} transações | Nível {user.level}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.volume}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Volume de Transações (7 dias)
          </h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Gráfico de Volume</p>
          </div>
        </div>

        {/* User Growth Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Crescimento de Usuários (30 dias)
          </h3>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Gráfico de Crescimento</p>
          </div>
        </div>
      </div>
    </div>
  )
}