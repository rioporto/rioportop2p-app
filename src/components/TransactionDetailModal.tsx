'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  X, 
  Bitcoin, 
  Calendar, 
  CreditCard, 
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  User
} from 'lucide-react'

interface TransactionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: {
    id: string
    type: 'buy' | 'sell'
    crypto: string
    cryptoName?: string
    cryptoLogo?: string
    amount: number
    cryptoAmount: number
    status: 'pending' | 'processing' | 'completed' | 'cancelled'
    createdAt: string
    totalBRL: number
    fee: number
    paymentMethod?: string
    pricePerUnit?: number
    counterparty?: {
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
    notes?: string
  } | null
}

export default function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
  if (!transaction) return null

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Adicionar toast de sucesso
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between mb-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Detalhes da Transação
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Title>

                <div className="space-y-4">
                  {/* Header da transação */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'buy'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {transaction.type === 'buy' ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {transaction.cryptoLogo && (
                            <img
                              src={transaction.cryptoLogo}
                              alt={transaction.crypto}
                              className="h-5 w-5 rounded-full"
                            />
                          )}
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.type === 'buy' ? 'Compra' : 'Venda'} de {transaction.crypto}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {getStatusIcon(transaction.status)}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {getStatusText(transaction.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Counterparty Info */}
                  {transaction.counterparty && (
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
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
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.type === 'buy' ? 'Vendedor' : 'Comprador'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.counterparty.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detalhes */}
                  <div className="space-y-3">
                    {/* ID da transação */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">ID</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-gray-900 dark:text-white">
                          {transaction.id.slice(0, 8)}...
                        </span>
                        <button
                          onClick={() => copyToClipboard(transaction.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Data */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Data
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(transaction.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>

                    {/* Valores */}
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Valor em {transaction.type === 'buy' ? 'BRL' : transaction.crypto}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.type === 'buy' 
                            ? transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            : `${transaction.cryptoAmount} ${transaction.crypto}`
                          }
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Valor em {transaction.type === 'buy' ? transaction.crypto : 'BRL'}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {transaction.type === 'buy' 
                            ? `${transaction.cryptoAmount} ${transaction.crypto}`
                            : transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                          }
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Taxa</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {transaction.fee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          {transaction.totalBRL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    </div>

                    {/* Método de pagamento */}
                    {transaction.paymentMethod && (
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Pagamento
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {transaction.paymentMethod}
                        </span>
                      </div>
                    )}

                    {/* Notas */}
                    {transaction.notes && (
                      <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                        <div className="flex items-start gap-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Observações</span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700 rounded p-3">
                          {transaction.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex gap-3 pt-4">
                    {transaction.status === 'pending' && (
                      <>
                        <button className="flex-1 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                          Cancelar
                        </button>
                        {transaction.type === 'buy' && (
                          <button className="flex-1 px-4 py-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                            Confirmar Pagamento
                          </button>
                        )}
                      </>
                    )}
                    
                    {transaction.status === 'processing' && (
                      <>
                        {transaction.type === 'sell' && (
                          <button className="flex-1 px-4 py-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-lg font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                            Liberar Crypto
                          </button>
                        )}
                        {transaction.type === 'buy' && transaction.paymentProof && (
                          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Ver Comprovante
                          </button>
                        )}
                      </>
                    )}
                    
                    {transaction.status === 'completed' && (
                      <>
                        {transaction.paymentProof && (
                          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Ver Comprovante
                          </button>
                        )}
                        {transaction.cryptoTxHash && (
                          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Ver na Blockchain
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}