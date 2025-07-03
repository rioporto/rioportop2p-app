'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Loader2,
  User,
  Calendar,
  CreditCard,
  FileText,
  Copy,
  ExternalLink,
  Upload,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

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

export default function TransactionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  useEffect(() => {
    checkAuth()
    loadTransaction()
  }, [params.id])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
  }

  const loadTransaction = async () => {
    try {
      const response = await fetch(`/api/dashboard/transactions/${params.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setTransaction(data.transaction)
      } else if (response.status === 404) {
        router.push('/dashboard/transactions')
      }
    } catch (error) {
      console.error('Erro ao carregar transação:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: string, data?: any) => {
    try {
      setActionLoading(true)
      
      const response = await fetch('/api/dashboard/transactions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: transaction?.id,
          action,
          data
        })
      })

      if (response.ok) {
        await loadTransaction()
        setShowUploadModal(false)
        setUploadFile(null)
      }
    } catch (error) {
      console.error('Erro ao executar ação:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!uploadFile) return

    // Here you would typically upload the file to storage
    // For now, we'll just simulate it
    const fakeUrl = `https://storage.example.com/${uploadFile.name}`
    
    await handleAction('confirm_payment', { paymentProof: fakeUrl })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Add toast notification
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Transação não encontrada</p>
          <Link
            href="/dashboard/transactions"
            className="mt-4 inline-block text-orange-600 hover:text-orange-700"
          >
            Voltar para transações
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard/transactions" className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detalhes da Transação
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          {/* Transaction Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                transaction.type === 'buy'
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {transaction.type === 'buy' ? (
                  <ArrowUpRight className="h-6 w-6 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {transaction.cryptoLogo && (
                    <img
                      src={transaction.cryptoLogo}
                      alt={transaction.crypto}
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {transaction.type === 'buy' ? 'Compra' : 'Venda'} de {transaction.crypto}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ID: {transaction.id.slice(0, 8)}...
                  <button
                    onClick={() => copyToClipboard(transaction.id)}
                    className="ml-2 text-gray-400 hover:text-gray-600 inline"
                  >
                    <Copy className="h-4 w-4 inline" />
                  </button>
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
              {getStatusIcon(transaction.status)}
              <span className="ml-1">{getStatusText(transaction.status)}</span>
            </span>
          </div>

          {/* Counterparty Info */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {transaction.type === 'buy' ? 'Vendedor' : 'Comprador'}
            </p>
            <div className="flex items-center space-x-3">
              {transaction.counterparty.avatar ? (
                <img
                  className="h-12 w-12 rounded-full"
                  src={transaction.counterparty.avatar}
                  alt={transaction.counterparty.name}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {transaction.counterparty.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {transaction.counterparty.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 mb-6">
            {/* Amount Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Valor em BRL</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {transaction.amount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quantidade de {transaction.crypto}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {transaction.cryptoAmount.toFixed(8)} {transaction.crypto}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Preço por {transaction.crypto}</p>
                <p className="text-lg text-gray-900 dark:text-white">
                  {transaction.pricePerUnit.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxa</p>
                <p className="text-lg text-gray-900 dark:text-white">
                  {transaction.fee.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-gray-900 dark:text-white">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transaction.totalBRL.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Método de Pagamento
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">
                {transaction.paymentMethod}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Data de Criação
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(transaction.createdAt).toLocaleString('pt-BR')}
              </span>
            </div>

            {/* Additional Dates */}
            {transaction.paymentConfirmedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pagamento Confirmado
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(transaction.paymentConfirmedAt).toLocaleString('pt-BR')}
                </span>
              </div>
            )}

            {transaction.completedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Concluída em
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(transaction.completedAt).toLocaleString('pt-BR')}
                </span>
              </div>
            )}

            {transaction.cancelledAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Cancelada em
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(transaction.cancelledAt).toLocaleString('pt-BR')}
                </span>
              </div>
            )}

            {transaction.cancellationReason && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800 dark:text-red-400">
                  Motivo do cancelamento
                </p>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                  {transaction.cancellationReason}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {transaction.status === 'pending' && (
              <>
                <button 
                  onClick={() => handleAction('cancel', { reason: 'Cancelado pelo usuário' })}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Cancelar Transação'}
                </button>
                {transaction.type === 'buy' && (
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
                  >
                    Confirmar Pagamento
                  </button>
                )}
              </>
            )}
            
            {transaction.status === 'processing' && (
              <>
                {transaction.type === 'sell' && (
                  <button 
                    onClick={() => handleAction('release_crypto')}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Liberar Criptomoeda'}
                  </button>
                )}
                {transaction.paymentProof && (
                  <a 
                    href={transaction.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver Comprovante
                  </a>
                )}
              </>
            )}
            
            {transaction.status === 'completed' && (
              <>
                {transaction.paymentProof && (
                  <a 
                    href={transaction.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver Comprovante
                  </a>
                )}
                {transaction.cryptoTxHash && (
                  <a 
                    href={`https://blockchain.info/tx/${transaction.cryptoTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver na Blockchain
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmar Pagamento
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Faça o upload do comprovante de pagamento para confirmar a transação.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 mb-4">
              <input
                type="file"
                id="payment-proof"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="payment-proof"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {uploadFile ? uploadFile.name : 'Clique para selecionar arquivo'}
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadFile(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleFileUpload}
                disabled={!uploadFile || actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}