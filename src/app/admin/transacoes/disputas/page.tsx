'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  AlertTriangle,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  DollarSign,
  FileText,
  Shield
} from 'lucide-react'

interface Dispute {
  id: string
  transactionId: string
  buyerName: string
  sellerName: string
  amount: string
  crypto: string
  status: 'open' | 'investigating' | 'resolved' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  reason: string
  openedAt: string
  lastUpdate: string
  assignedTo?: string
  messages: number
}

const mockDisputes: Dispute[] = [
  {
    id: 'DISP001',
    transactionId: 'TX123456',
    buyerName: 'João Silva',
    sellerName: 'Maria Santos',
    amount: 'R$ 5,000.00',
    crypto: 'BTC',
    status: 'open',
    priority: 'high',
    reason: 'Pagamento não recebido',
    openedAt: '2024-03-15 14:30',
    lastUpdate: '10 min atrás',
    messages: 12,
  },
  {
    id: 'DISP002',
    transactionId: 'TX123457',
    buyerName: 'Pedro Costa',
    sellerName: 'Ana Oliveira',
    amount: 'R$ 2,500.00',
    crypto: 'USDT',
    status: 'investigating',
    priority: 'medium',
    reason: 'Valor incorreto transferido',
    openedAt: '2024-03-14 10:15',
    lastUpdate: '2 horas atrás',
    assignedTo: 'Admin Carlos',
    messages: 8,
  },
  {
    id: 'DISP003',
    transactionId: 'TX123458',
    buyerName: 'Carlos Mendes',
    sellerName: 'Julia Ferreira',
    amount: 'R$ 10,000.00',
    crypto: 'ETH',
    status: 'resolved',
    priority: 'low',
    reason: 'Atraso na liberação',
    openedAt: '2024-03-13 16:45',
    lastUpdate: '1 dia atrás',
    assignedTo: 'Admin Ana',
    messages: 15,
  },
  {
    id: 'DISP004',
    transactionId: 'TX123459',
    buyerName: 'Ricardo Alves',
    sellerName: 'Fernanda Lima',
    amount: 'R$ 7,800.00',
    crypto: 'BTC',
    status: 'open',
    priority: 'critical',
    reason: 'Suspeita de fraude',
    openedAt: '2024-03-15 16:00',
    lastUpdate: '5 min atrás',
    messages: 3,
  },
  {
    id: 'DISP005',
    transactionId: 'TX123460',
    buyerName: 'Lucas Souza',
    sellerName: 'Patricia Rocha',
    amount: 'R$ 1,200.00',
    crypto: 'USDC',
    status: 'cancelled',
    priority: 'low',
    reason: 'Cancelamento solicitado',
    openedAt: '2024-03-12 09:00',
    lastUpdate: '3 dias atrás',
    assignedTo: 'Admin João',
    messages: 5,
  },
]

const statusConfig = {
  open: { color: 'bg-yellow-100 text-yellow-800', label: 'Aberta', icon: AlertTriangle },
  investigating: { color: 'bg-blue-100 text-blue-800', label: 'Investigando', icon: Shield },
  resolved: { color: 'bg-green-100 text-green-800', label: 'Resolvida', icon: CheckCircle },
  cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelada', icon: XCircle },
}

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-800', label: 'Baixa' },
  medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Média' },
  high: { color: 'bg-orange-100 text-orange-800', label: 'Alta' },
  critical: { color: 'bg-red-100 text-red-800', label: 'Crítica' },
}

export default function DisputesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)

  const filteredDisputes = mockDisputes.filter(dispute => {
    const matchesSearch = 
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === null || dispute.status === selectedStatus
    const matchesPriority = selectedPriority === null || dispute.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const openCount = mockDisputes.filter(d => d.status === 'open').length
  const investigatingCount = mockDisputes.filter(d => d.status === 'investigating').length
  const criticalCount = mockDisputes.filter(d => d.priority === 'critical').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Disputas</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600">
            Estatísticas
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Abertas</p>
              <p className="text-2xl font-bold text-yellow-600">{openCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Em Investigação</p>
              <p className="text-2xl font-bold text-blue-600">{investigatingCount}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Prioridade Crítica</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tempo Médio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.2h</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400 opacity-20" />
          </div>
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
                placeholder="Buscar por ID, transação ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos Status</option>
              <option value="open">Abertas</option>
              <option value="investigating">Investigando</option>
              <option value="resolved">Resolvidas</option>
              <option value="cancelled">Canceladas</option>
            </select>
            <select
              value={selectedPriority || ''}
              onChange={(e) => setSelectedPriority(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todas Prioridades</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredDisputes.map((dispute) => {
            const StatusIcon = statusConfig[dispute.status].icon
            
            return (
              <div key={dispute.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {dispute.id}
                      </h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[dispute.status].color}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {statusConfig[dispute.status].label}
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityConfig[dispute.priority].color}`}>
                        {priorityConfig[dispute.priority].label}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <span className="font-medium">Motivo:</span> {dispute.reason}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Transação: {dispute.transactionId}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Comprador</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{dispute.buyerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Vendedor</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{dispute.sellerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Valor</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {dispute.amount} <span className="text-gray-500">({dispute.crypto})</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Mensagens</p>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{dispute.messages}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Aberta: {dispute.openedAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Última atualização: {dispute.lastUpdate}</span>
                      </div>
                      {dispute.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{dispute.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
                      Ver Detalhes
                    </button>
                    {dispute.status === 'open' && (
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Assumir Caso
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}