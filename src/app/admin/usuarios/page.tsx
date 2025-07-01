'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar
} from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  phone: string
  cpf: string
  kycLevel: number
  status: 'active' | 'pending' | 'suspended'
  registeredAt: string
  lastActivity: string
  totalVolume: string
  totalTrades: number
}

const mockUsers: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    kycLevel: 3,
    status: 'active',
    registeredAt: '2024-01-15',
    lastActivity: '2 horas atrás',
    totalVolume: 'R$ 125,000',
    totalTrades: 45,
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(21) 98765-4321',
    cpf: '987.654.321-00',
    kycLevel: 2,
    status: 'active',
    registeredAt: '2024-02-20',
    lastActivity: '1 dia atrás',
    totalVolume: 'R$ 87,500',
    totalTrades: 32,
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    phone: '(31) 98765-4321',
    cpf: '456.789.123-00',
    kycLevel: 1,
    status: 'pending',
    registeredAt: '2024-03-10',
    lastActivity: '3 dias atrás',
    totalVolume: 'R$ 5,200',
    totalTrades: 8,
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    email: 'ana.oliveira@email.com',
    phone: '(41) 98765-4321',
    cpf: '789.123.456-00',
    kycLevel: 2,
    status: 'suspended',
    registeredAt: '2024-01-25',
    lastActivity: '1 semana atrás',
    totalVolume: 'R$ 45,300',
    totalTrades: 19,
  },
  {
    id: 5,
    name: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    phone: '(51) 98765-4321',
    cpf: '321.654.987-00',
    kycLevel: 3,
    status: 'active',
    registeredAt: '2023-12-05',
    lastActivity: '5 min atrás',
    totalVolume: 'R$ 234,800',
    totalTrades: 67,
  },
]

const kycLevelColors: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-green-100 text-green-800',
}

const statusConfig = {
  active: { color: 'bg-green-100 text-green-800', label: 'Ativo', icon: CheckCircle },
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente', icon: AlertCircle },
  suspended: { color: 'bg-red-100 text-red-800', label: 'Suspenso', icon: XCircle },
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKycLevel, setSelectedKycLevel] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.cpf.includes(searchTerm)
    
    const matchesKyc = selectedKycLevel === null || user.kycLevel === selectedKycLevel
    const matchesStatus = selectedStatus === null || user.status === selectedStatus

    return matchesSearch && matchesKyc && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Usuários</h1>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          Exportar Relatório
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total de Usuários</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">KYC Nível 3</p>
          <p className="text-2xl font-bold text-green-600">342</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600">89</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Suspensos</p>
          <p className="text-2xl font-bold text-red-600">12</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedKycLevel || ''}
              onChange={(e) => setSelectedKycLevel(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos KYC</option>
              <option value="1">KYC Nível 1</option>
              <option value="2">KYC Nível 2</option>
              <option value="3">KYC Nível 3</option>
            </select>
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos Status</option>
              <option value="active">Ativos</option>
              <option value="pending">Pendentes</option>
              <option value="suspended">Suspensos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  KYC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Volume Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Última Atividade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => {
                const StatusIcon = statusConfig[user.status].icon
                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            CPF: {user.cpf}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900 dark:text-white">
                          <Mail className="w-4 h-4 mr-1 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Phone className="w-4 h-4 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${kycLevelColors[user.kycLevel]}`}>
                        Nível {user.kycLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="w-4 h-4 mr-1" />
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[user.status].color}`}>
                          {statusConfig[user.status].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white font-medium">
                          {user.totalVolume}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          {user.totalTrades} transações
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}