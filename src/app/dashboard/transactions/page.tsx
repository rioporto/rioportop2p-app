'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  User,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Loading skeleton component
function TransactionSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
          <div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded mt-1"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
      </td>
    </tr>
  )
}

interface Transaction {
  id: string
  type: 'buy' | 'sell'
  crypto: string
  cryptoName: string
  cryptoLogo?: string
  amount: number
  cryptoAmount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: string
  totalBRL: number
  fee: number
  paymentMethod: string
  pricePerUnit: number
  counterparty: {
    id: string
    name: string
    avatar?: string
  }
  paymentProof?: string
  paymentConfirmedAt?: string
  cryptoTxHash?: string
  completedAt?: string
  cancelledAt?: string
  cancellationReason?: string
}

export default function DashboardTransactionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [currentPage, selectedFilter])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
  }

  const loadTransactions = async () => {
    try {
      setLoadingMore(currentPage > 1)
      if (currentPage === 1) setLoading(true)
      
      const offset = (currentPage - 1) * itemsPerPage
      let url = `/api/dashboard/transactions?limit=${itemsPerPage}&offset=${offset}`
      
      if (selectedFilter !== 'all') {
        url += `&status=${selectedFilter}`
      }
      
      const response = await fetch(url)
      
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
        setTotalCount(data.total)
        setTotalPages(Math.ceil(data.total / itemsPerPage))
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída'
      case 'processing':
        return 'Processando'
      case 'pending':
        return 'Pendente'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const filteredTransactions = transactions.filter(tx => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      tx.id.toLowerCase().includes(searchLower) ||
      tx.crypto.toLowerCase().includes(searchLower) ||
      tx.cryptoName.toLowerCase().includes(searchLower) ||
      tx.counterparty.name.toLowerCase().includes(searchLower)
    )
  })

  const handleRowClick = (transactionId: string) => {
    router.push(`/transactions/${transactionId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Transações
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID, crypto ou contraparte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedFilter('all')
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter('pending')
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'pending'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                  }`}
                >
                  Pendentes
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter('processing')
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'processing'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                  }`}
                >
                  Processando
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter('completed')
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'completed'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                  }`}
                >
                  Concluídas
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter('cancelled')
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'cancelled'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
                  }`}
                >
                  Canceladas
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {!loading && (
              <>
                Mostrando {filteredTransactions.length} de {totalCount} transações
                {selectedFilter !== 'all' && ` (${getStatusText(selectedFilter)})`}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contraparte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Crypto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {loading && !loadingMore ? (
                  // Loading skeleton
                  <>
                    <TransactionSkeleton />
                    <TransactionSkeleton />
                    <TransactionSkeleton />
                    <TransactionSkeleton />
                    <TransactionSkeleton />
                  </>
                ) : filteredTransactions.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                          {searchTerm
                            ? 'Nenhuma transação encontrada para sua busca'
                            : selectedFilter === 'all'
                            ? 'Você ainda não possui transações'
                            : `Nenhuma transação ${getStatusText(selectedFilter).toLowerCase()}`}
                        </p>
                        {selectedFilter !== 'all' && (
                          <button
                            onClick={() => {
                              setSelectedFilter('all')
                              setCurrentPage(1)
                            }}
                            className="mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium"
                          >
                            Ver todas as transações
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Transaction rows
                  filteredTransactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className="hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(transaction.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {transaction.counterparty.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={transaction.counterparty.avatar}
                                alt={transaction.counterparty.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {transaction.counterparty.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {transaction.counterparty.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            transaction.type === 'buy'
                              ? 'bg-green-100 dark:bg-green-900/20'
                              : 'bg-red-100 dark:bg-red-900/20'
                          }`}>
                            {transaction.type === 'buy' ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.type === 'buy' ? 'Compra' : 'Venda'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {transaction.cryptoLogo && (
                            <img
                              src={transaction.cryptoLogo}
                              alt={transaction.crypto}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {transaction.crypto}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.cryptoAmount.toFixed(8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {transaction.amount.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.pricePerUnit.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })}/{transaction.crypto}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.totalBRL.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </div>
                        {transaction.fee > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Taxa: {transaction.fee.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{getStatusText(transaction.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.createdAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loadingMore}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loadingMore}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {loadingMore && (
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}