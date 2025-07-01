'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Bitcoin,
  CreditCard,
  Building,
  Smartphone,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  LineChart
} from 'lucide-react'

interface Transaction {
  id: string
  buyer: {
    id: number
    name: string
    email: string
    reputation: number
  }
  seller: {
    id: number
    name: string
    email: string
    reputation: number
  }
  type: 'buy' | 'sell'
  amountBRL: number
  amountBTC: number
  btcPrice: number
  paymentMethod: 'pix' | 'bank_transfer' | 'ted' | 'doc'
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'disputed'
  fee: number
  feePercentage: number
  createdAt: string
  updatedAt: string
  completedAt?: string
  escrowReleaseTime?: string
  transactionHash?: string
  bankDetails?: {
    bank: string
    accountType: string
  }
  notes?: string
}

const mockTransactions: Transaction[] = [
  {
    id: 'TRX-2024-001234',
    buyer: {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      reputation: 4.8
    },
    seller: {
      id: 5,
      name: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      reputation: 4.9
    },
    type: 'buy',
    amountBRL: 5000.00,
    amountBTC: 0.018574,
    btcPrice: 269157.00,
    paymentMethod: 'pix',
    status: 'completed',
    fee: 50.00,
    feePercentage: 1.0,
    createdAt: '2024-03-15T10:30:00',
    updatedAt: '2024-03-15T10:45:00',
    completedAt: '2024-03-15T10:45:00',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: 'TRX-2024-001235',
    buyer: {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      reputation: 4.7
    },
    seller: {
      id: 8,
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      reputation: 4.6
    },
    type: 'buy',
    amountBRL: 12500.00,
    amountBTC: 0.046435,
    btcPrice: 269157.00,
    paymentMethod: 'bank_transfer',
    status: 'processing',
    fee: 125.00,
    feePercentage: 1.0,
    createdAt: '2024-03-15T11:00:00',
    updatedAt: '2024-03-15T11:15:00',
    escrowReleaseTime: '2024-03-15T12:00:00',
    bankDetails: {
      bank: 'Banco do Brasil',
      accountType: 'Conta Corrente'
    }
  },
  {
    id: 'TRX-2024-001236',
    buyer: {
      id: 7,
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      reputation: 4.5
    },
    seller: {
      id: 3,
      name: 'Roberto Lima',
      email: 'roberto.lima@email.com',
      reputation: 4.4
    },
    type: 'sell',
    amountBRL: 8000.00,
    amountBTC: 0.029719,
    btcPrice: 269157.00,
    paymentMethod: 'pix',
    status: 'pending',
    fee: 80.00,
    feePercentage: 1.0,
    createdAt: '2024-03-15T11:30:00',
    updatedAt: '2024-03-15T11:30:00',
    notes: 'Aguardando confirmação do pagamento PIX'
  },
  {
    id: 'TRX-2024-001237',
    buyer: {
      id: 4,
      name: 'Fernando Souza',
      email: 'fernando.souza@email.com',
      reputation: 4.3
    },
    seller: {
      id: 6,
      name: 'Juliana Martins',
      email: 'juliana.martins@email.com',
      reputation: 4.9
    },
    type: 'buy',
    amountBRL: 25000.00,
    amountBTC: 0.092872,
    btcPrice: 269157.00,
    paymentMethod: 'ted',
    status: 'disputed',
    fee: 250.00,
    feePercentage: 1.0,
    createdAt: '2024-03-15T09:00:00',
    updatedAt: '2024-03-15T11:45:00',
    notes: 'Comprador alega não ter recebido os bitcoins'
  },
  {
    id: 'TRX-2024-001238',
    buyer: {
      id: 9,
      name: 'Lucas Pereira',
      email: 'lucas.pereira@email.com',
      reputation: 4.2
    },
    seller: {
      id: 10,
      name: 'Camila Rodrigues',
      email: 'camila.rodrigues@email.com',
      reputation: 4.7
    },
    type: 'sell',
    amountBRL: 3500.00,
    amountBTC: 0.013002,
    btcPrice: 269157.00,
    paymentMethod: 'pix',
    status: 'cancelled',
    fee: 35.00,
    feePercentage: 1.0,
    createdAt: '2024-03-15T08:00:00',
    updatedAt: '2024-03-15T08:30:00',
    notes: 'Cancelado por inatividade do comprador'
  },
  {
    id: 'TRX-2024-001239',
    buyer: {
      id: 11,
      name: 'Rafael Almeida',
      email: 'rafael.almeida@email.com',
      reputation: 4.6
    },
    seller: {
      id: 12,
      name: 'Patricia Ferreira',
      email: 'patricia.ferreira@email.com',
      reputation: 4.8
    },
    type: 'buy',
    amountBRL: 50000.00,
    amountBTC: 0.185743,
    btcPrice: 269157.00,
    paymentMethod: 'bank_transfer',
    status: 'completed',
    fee: 500.00,
    feePercentage: 1.0,
    createdAt: '2024-03-15T07:00:00',
    updatedAt: '2024-03-15T07:45:00',
    completedAt: '2024-03-15T07:45:00',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    bankDetails: {
      bank: 'Itaú',
      accountType: 'Conta Corrente'
    }
  },
  {
    id: 'TRX-2024-001240',
    buyer: {
      id: 13,
      name: 'Bruno Nascimento',
      email: 'bruno.nascimento@email.com',
      reputation: 4.4
    },
    seller: {
      id: 14,
      name: 'Larissa Gomes',
      email: 'larissa.gomes@email.com',
      reputation: 4.5
    },
    type: 'sell',
    amountBRL: 15000.00,
    amountBTC: 0.055723,
    btcPrice: 269157.00,
    paymentMethod: 'doc',
    status: 'processing',
    fee: 150.00,
    feePercentage: 1.0,
    createdAt: '2024-03-15T12:00:00',
    updatedAt: '2024-03-15T12:15:00',
    escrowReleaseTime: '2024-03-15T16:00:00'
  },
  {
    id: 'TRX-2024-001241',
    buyer: {
      id: 15,
      name: 'Gabriela Silva',
      email: 'gabriela.silva@email.com',
      reputation: 4.9
    },
    seller: {
      id: 16,
      name: 'Thiago Santos',
      email: 'thiago.santos@email.com',
      reputation: 4.7
    },
    type: 'buy',
    amountBRL: 7500.00,
    amountBTC: 0.027857,
    btcPrice: 269157.00,
    paymentMethod: 'pix',
    status: 'completed',
    fee: 75.00,
    feePercentage: 1.0,
    createdAt: '2024-03-15T13:00:00',
    updatedAt: '2024-03-15T13:10:00',
    completedAt: '2024-03-15T13:10:00',
    transactionHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456'
  }
]

const statusConfig = {
  pending: { 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', 
    label: 'Pendente', 
    icon: Clock 
  },
  processing: { 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', 
    label: 'Processando', 
    icon: AlertCircle 
  },
  completed: { 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', 
    label: 'Concluída', 
    icon: CheckCircle 
  },
  cancelled: { 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', 
    label: 'Cancelada', 
    icon: XCircle 
  },
  disputed: { 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', 
    label: 'Disputa', 
    icon: AlertCircle 
  },
}

const paymentMethodConfig = {
  pix: { label: 'PIX', icon: Smartphone },
  bank_transfer: { label: 'Transferência', icon: Building },
  ted: { label: 'TED', icon: Building },
  doc: { label: 'DOC', icon: Building },
}

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [amountRange, setAmountRange] = useState({ min: '', max: '' })
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === null || transaction.status === selectedStatus
    const matchesPaymentMethod = selectedPaymentMethod === null || transaction.paymentMethod === selectedPaymentMethod
    const matchesType = selectedType === null || transaction.type === selectedType

    const matchesAmountRange = 
      (!amountRange.min || transaction.amountBRL >= Number(amountRange.min)) &&
      (!amountRange.max || transaction.amountBRL <= Number(amountRange.max))

    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesType && matchesAmountRange
  })

  const stats = {
    totalVolume: mockTransactions.reduce((sum, t) => sum + t.amountBRL, 0),
    totalFees: mockTransactions.reduce((sum, t) => sum + t.fee, 0),
    completedCount: mockTransactions.filter(t => t.status === 'completed').length,
    pendingCount: mockTransactions.filter(t => t.status === 'pending').length,
    disputedCount: mockTransactions.filter(t => t.status === 'disputed').length,
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatBTC = (value: number) => {
    return `₿ ${value.toFixed(8)}`
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transações</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Relatórios
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Volume Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalVolume)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Taxas</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(stats.totalFees)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Disputas</p>
              <p className="text-2xl font-bold text-red-600">{stats.disputedCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Volume de Transações</h3>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Gráfico de volume ao longo do tempo</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Métodos de Pagamento</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Gráfico de distribuição por método</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="space-y-4">
          {/* Search and basic filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por ID, comprador ou vendedor..."
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
                <option value="pending">Pendente</option>
                <option value="processing">Processando</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
                <option value="disputed">Disputa</option>
              </select>
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos Tipos</option>
                <option value="buy">Compra</option>
                <option value="sell">Venda</option>
              </select>
              <select
                value={selectedPaymentMethod || ''}
                onChange={(e) => setSelectedPaymentMethod(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              >
                <option value="">Todos Métodos</option>
                <option value="pix">PIX</option>
                <option value="bank_transfer">Transferência</option>
                <option value="ted">TED</option>
                <option value="doc">DOC</option>
              </select>
            </div>
          </div>

          {/* Advanced filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                placeholder="Data início"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
              <span className="text-gray-500">até</span>
              <input
                type="date"
                placeholder="Data fim"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="Valor mín"
                value={amountRange.min}
                onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
              <span className="text-gray-500">até</span>
              <input
                type="number"
                placeholder="Valor máx"
                value={amountRange.max}
                onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID / Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Comprador / Vendedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Valores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Taxa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => {
                const StatusIcon = statusConfig[transaction.status].icon
                const PaymentIcon = paymentMethodConfig[transaction.paymentMethod].icon
                const TypeIcon = transaction.type === 'buy' ? ArrowDownRight : ArrowUpRight
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'buy' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
                        }`}>
                          <TypeIcon className={`w-5 h-5 ${
                            transaction.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.type === 'buy' ? 'Compra' : 'Venda'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900 dark:text-white">
                          <span className="font-medium">C:</span> {transaction.buyer.name}
                          <span className="ml-2 text-xs text-gray-500">★ {transaction.buyer.reputation}</span>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          <span className="font-medium">V:</span> {transaction.seller.name}
                          <span className="ml-2 text-xs">★ {transaction.seller.reputation}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center text-gray-900 dark:text-white font-medium">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {formatCurrency(transaction.amountBRL)}
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Bitcoin className="w-4 h-4 mr-1" />
                          {formatBTC(transaction.amountBTC)}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          @ {formatCurrency(transaction.btcPrice)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <PaymentIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {paymentMethodConfig[transaction.paymentMethod].label}
                        </span>
                      </div>
                      {transaction.bankDetails && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {transaction.bankDetails.bank}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="w-4 h-4 mr-1" />
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[transaction.status].color}`}>
                          {statusConfig[transaction.status].label}
                        </span>
                      </div>
                      {transaction.escrowReleaseTime && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Liberação: {new Date(transaction.escrowReleaseTime).toLocaleTimeString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatCurrency(transaction.fee)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.feePercentage}%
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.createdAt).toLocaleTimeString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setShowDetails(showDetails === transaction.id ? null : transaction.id)}
                          className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal (simplified inline version) */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const transaction = mockTransactions.find(t => t.id === showDetails)
              if (!transaction) return null
              
              return (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Detalhes da Transação
                    </h2>
                    <button
                      onClick={() => setShowDetails(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID da Transação</p>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                        <div className="flex items-center mt-1">
                          {React.createElement(statusConfig[transaction.status].icon, { className: "w-4 h-4 mr-1" })}
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[transaction.status].color}`}>
                            {statusConfig[transaction.status].label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Participantes</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Comprador</p>
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.buyer.name}</p>
                          <p className="text-sm text-gray-500">{transaction.buyer.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Vendedor</p>
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.seller.name}</p>
                          <p className="text-sm text-gray-500">{transaction.seller.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Valores</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Valor em BRL:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(transaction.amountBRL)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Valor em BTC:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatBTC(transaction.amountBTC)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Preço do BTC:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(transaction.btcPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Taxa:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(transaction.fee)} ({transaction.feePercentage}%)</span>
                        </div>
                      </div>
                    </div>

                    {transaction.transactionHash && (
                      <div className="border-t dark:border-gray-700 pt-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Hash da Transação</p>
                        <p className="font-mono text-xs text-gray-900 dark:text-white break-all">{transaction.transactionHash}</p>
                      </div>
                    )}

                    {transaction.notes && (
                      <div className="border-t dark:border-gray-700 pt-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Observações</p>
                        <p className="text-gray-900 dark:text-white">{transaction.notes}</p>
                      </div>
                    )}

                    <div className="border-t dark:border-gray-700 pt-4 flex justify-end gap-2">
                      {transaction.status === 'pending' && (
                        <>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Aprovar
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Cancelar
                          </button>
                        </>
                      )}
                      {transaction.status === 'processing' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Marcar como Concluída
                        </button>
                      )}
                      {transaction.status === 'disputed' && (
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          Resolver Disputa
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}