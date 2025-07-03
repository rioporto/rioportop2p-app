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
  AlertTriangle,
  MessageSquare,
  Shield
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import PixPaymentInstructions from '@/components/pix/PixPaymentInstructions'
import TransactionChat from '@/components/transactions/TransactionChat'
import CountdownTimer from '@/components/transactions/CountdownTimer'
import CryptoReleasePanel from '@/components/transactions/CryptoReleasePanel'
import DisputeModal from '@/components/transactions/DisputeModal'

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  buyer: Database['public']['Tables']['users_profile']['Row']
  seller: Database['public']['Tables']['users_profile']['Row']
  crypto: Database['public']['Tables']['cryptocurrencies']['Row']
  order?: Database['public']['Tables']['orders']['Row']
}

export default function P2PTransactionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showDispute, setShowDispute] = useState(false)

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

    const { data: profile } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', user.id)
      .single()

    setCurrentUser({ ...user, profile })
  }

  const loadTransaction = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          buyer:buyer_id(
            id,
            email,
            full_name,
            avatar_url,
            reputation_score,
            total_trades
          ),
          seller:seller_id(
            id,
            email,
            full_name,
            avatar_url,
            reputation_score,
            total_trades
          ),
          crypto:crypto_id(
            id,
            symbol,
            name,
            logo_url
          ),
          order:order_id(
            payment_time_limit
          )
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error

      // Check if current user is part of this transaction
      if (data && currentUser && 
          data.buyer_id !== currentUser.id && 
          data.seller_id !== currentUser.id) {
        router.push('/p2p/transactions')
        return
      }

      setTransaction(data)
    } catch (error) {
      console.error('Error loading transaction:', error)
      router.push('/p2p/transactions')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSent = async (proofUrl: string, endToEndId?: string) => {
    try {
      setActionLoading(true)

      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'processing',
          payment_proof_url: proofUrl,
          payment_confirmed_at: new Date().toISOString(),
          pix_end_to_end_id: endToEndId,
          metadata: {
            ...(typeof transaction?.metadata === 'object' && transaction?.metadata !== null ? transaction.metadata : {}),
            payment_confirmation_method: 'manual'
          } as any
        })
        .eq('id', transaction?.id)

      if (error) throw error

      // Create notification for seller
      await supabase
        .from('notifications')
        .insert({
          user_id: transaction?.seller_id,
          type: 'payment_sent',
          title: 'Pagamento Enviado',
          message: `O comprador enviou o pagamento de R$ ${transaction?.fiat_amount.toFixed(2)}. Verifique e libere a criptomoeda.`,
          data: {
            transaction_id: transaction?.id
          }
        })

      await loadTransaction()
    } catch (error) {
      console.error('Error confirming payment:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReleaseCrypto = async () => {
    try {
      setActionLoading(true)

      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          crypto_released_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .eq('id', transaction?.id)

      if (error) throw error

      // Create notification for buyer
      await supabase
        .from('notifications')
        .insert({
          user_id: transaction?.buyer_id,
          type: 'crypto_released',
          title: 'Criptomoeda Liberada',
          message: `O vendedor liberou ${transaction?.crypto_amount} ${transaction?.crypto.symbol}. A transação foi concluída.`,
          data: {
            transaction_id: transaction?.id
          }
        })

      await loadTransaction()
    } catch (error) {
      console.error('Error releasing crypto:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelTransaction = async (reason: string) => {
    try {
      setActionLoading(true)

      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancelled_by: currentUser?.id,
          cancellation_reason: reason
        })
        .eq('id', transaction?.id)

      if (error) throw error

      // Notify the other party
      const otherPartyId = transaction?.buyer_id === currentUser?.id 
        ? transaction?.seller_id 
        : transaction?.buyer_id

      await supabase
        .from('notifications')
        .insert({
          user_id: otherPartyId,
          type: 'transaction_cancelled',
          title: 'Transação Cancelada',
          message: `A transação foi cancelada. Motivo: ${reason}`,
          data: {
            transaction_id: transaction?.id
          }
        })

      await loadTransaction()
    } catch (error) {
      console.error('Error cancelling transaction:', error)
    } finally {
      setActionLoading(false)
    }
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

  if (loading || !currentUser) {
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
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Transação não encontrada</p>
          <Link
            href="/p2p/transactions"
            className="mt-4 inline-block text-orange-600 hover:text-orange-700"
          >
            Voltar para transações
          </Link>
        </div>
      </div>
    )
  }

  const isBuyer = transaction.buyer_id === currentUser.id
  const isSeller = transaction.seller_id === currentUser.id
  const counterparty = isBuyer ? transaction.seller : transaction.buyer
  const paymentTimeLimit = transaction.order?.payment_time_limit || 30

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/p2p/transactions" className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isBuyer ? 'Compra' : 'Venda'} de {transaction.crypto.symbol}
              </h1>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
              {getStatusIcon(transaction.status)}
              <span className="ml-1">{getStatusText(transaction.status)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resumo da Transação
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Criptomoeda</span>
                  <div className="flex items-center gap-2">
                    {transaction.crypto.logo_url && (
                      <img 
                        src={transaction.crypto.logo_url} 
                        alt={transaction.crypto.symbol}
                        className="h-5 w-5 rounded-full"
                      />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {transaction.crypto_amount} {transaction.crypto.symbol}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Valor em Reais</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    R$ {transaction.fiat_amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Preço por {transaction.crypto.symbol}</span>
                  <span className="text-gray-900 dark:text-white">
                    R$ {transaction.price_per_unit.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Taxa</span>
                  <span className="text-gray-900 dark:text-white">
                    R$ {transaction.fee_amount.toFixed(2)} ({transaction.fee_percentage}%)
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      R$ {transaction.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Método de Pagamento
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.payment_method === 'PIX' ? 'PIX' : transaction.payment_method}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Criada em
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(transaction.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Instructions / Actions */}
            {transaction.status === 'pending' && isBuyer && transaction.payment_method === 'PIX' && (
              <PixPaymentInstructions
                transaction={{
                  id: transaction.id,
                  fiat_amount: transaction.fiat_amount,
                  payment_method: transaction.payment_method,
                  seller_id: transaction.seller_id,
                  created_at: transaction.created_at
                }}
                paymentTimeLimit={paymentTimeLimit}
                onPaymentSent={handlePaymentSent}
                onCancel={() => handleCancelTransaction('Cancelado pelo comprador')}
              />
            )}

            {transaction.status === 'processing' && isSeller && (
              <CryptoReleasePanel
                transaction={{
                  id: transaction.id,
                  crypto_amount: transaction.crypto_amount,
                  fiat_amount: transaction.fiat_amount,
                  payment_proof_url: transaction.payment_proof_url ?? undefined,
                  buyer: {
                    full_name: transaction.buyer.full_name || 'Cliente'
                  },
                  crypto: {
                    symbol: transaction.crypto.symbol,
                    name: transaction.crypto.name
                  }
                }}
                onRelease={handleReleaseCrypto}
              />
            )}

            {/* Status Messages */}
            {transaction.status === 'pending' && isSeller && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      Aguardando Pagamento
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      O comprador tem {paymentTimeLimit} minutos para realizar o pagamento. 
                      Você será notificado quando o pagamento for confirmado.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {transaction.status === 'processing' && isBuyer && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                      Processando Pagamento
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Seu pagamento foi enviado. Aguarde o vendedor verificar e liberar a criptomoeda.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {transaction.status === 'completed' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">
                      Transação Concluída
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      {isBuyer 
                        ? `Você recebeu ${transaction.crypto_amount} ${transaction.crypto.symbol} com sucesso.`
                        : `Você vendeu ${transaction.crypto_amount} ${transaction.crypto.symbol} e recebeu R$ ${transaction.fiat_amount.toFixed(2)}.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {transaction.status === 'cancelled' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-300 mb-1">
                      Transação Cancelada
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {transaction.cancellation_reason || 'Esta transação foi cancelada.'}
                    </p>
                    {transaction.cancelled_at && (
                      <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                        Cancelada em {new Date(transaction.cancelled_at).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Counterparty Info */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {isBuyer ? 'Vendedor' : 'Comprador'}
              </h3>
              
              <div className="flex items-center space-x-3 mb-4">
                {counterparty.avatar_url ? (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={counterparty.avatar_url}
                    alt={counterparty.full_name || ''}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {counterparty.full_name || 'Usuário'}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {counterparty.reputation_score.toFixed(1)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {counterparty.total_trades} negociações
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowChat(true)}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Abrir Chat
              </button>
            </div>

            {/* Security Tips */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Dicas de Segurança
                </h3>
              </div>
              
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Sempre verifique os dados antes de pagar</li>
                <li>• Não compartilhe senhas ou códigos</li>
                <li>• Use apenas o chat da plataforma</li>
                <li>• Guarde todos os comprovantes</li>
                <li>• Em caso de dúvida, abra uma disputa</li>
              </ul>
            </div>

            {/* Timer for pending transactions */}
            {transaction.status === 'pending' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Tempo Restante
                </h3>
                <CountdownTimer
                  deadline={new Date(new Date(transaction.created_at).getTime() + paymentTimeLimit * 60 * 1000).toISOString()}
                  onExpire={() => handleCancelTransaction('Tempo expirado')}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowChat(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <TransactionChat
              transactionId={transaction.id}
              currentUserId={currentUser.id}
              otherPartyName={counterparty.full_name || counterparty.email}
            />
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDispute && (
        <DisputeModal
          isOpen={showDispute}
          transactionId={transaction.id}
          onClose={() => setShowDispute(false)}
          onDisputeCreated={async () => {
            await loadTransaction()
          }}
        />
      )}
    </div>
  )
}