'use client'

import { useState, useEffect } from 'react'
import { Check, X, Clock, AlertCircle } from 'lucide-react'
import { manualPixProvider } from '@/lib/pix/manual-provider'
import { useAuth } from '@/hooks/useAuth'
import { AdminGuard } from '@/components/auth/AdminGuard'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PendingPayment {
  id: string
  pix_id: string
  amount: number
  status: string
  created_at: string
  expires_at: string
  qr_code_text: string
  is_manual: boolean
  transactions: {
    id: string
    amount: number
    buyer_id: string
    seller_id: string
    users_profile: Array<{
      name: string
      email: string
    }>
  }
}

export default function AdminPixPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<PendingPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    loadPendingPayments()
    const interval = setInterval(loadPendingPayments, 30000) // Atualiza a cada 30s
    return () => clearInterval(interval)
  }, [user])

  const loadPendingPayments = async () => {
    if (!user?.id) return

    try {
      const data = await manualPixProvider.listPendingPayments(user.id)
      setPayments(data || [])
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const confirmPayment = async (pixId: string) => {
    if (!user?.id || processingId) return
    
    setProcessingId(pixId)
    try {
      await manualPixProvider.confirmPayment(pixId, user.id)
      await loadPendingPayments()
      alert('Pagamento confirmado com sucesso!')
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error)
      alert('Erro ao confirmar pagamento')
    } finally {
      setProcessingId(null)
    }
  }

  const cancelPayment = async (pixId: string) => {
    if (!user?.id || processingId) return
    
    if (!confirm('Tem certeza que deseja cancelar este pagamento?')) return
    
    setProcessingId(pixId)
    try {
      await manualPixProvider.cancelPayment(pixId)
      await loadPendingPayments()
      alert('Pagamento cancelado')
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error)
      alert('Erro ao cancelar pagamento')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gerenciar Pagamentos PIX
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Confirme ou cancele pagamentos PIX manuais pendentes
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Nenhum pagamento pendente no momento
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Transação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comprador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Chave PIX
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Criado em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {payments.map((payment) => {
                    const buyer = payment.transactions.users_profile[0]
                    const isExpired = new Date(payment.expires_at) < new Date()
                    
                    return (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {payment.transactions.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            <div className="font-medium">{buyer?.name}</div>
                            <div className="text-xs">{buyer?.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                          R$ {payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="max-w-xs truncate" title={payment.qr_code_text}>
                            {payment.qr_code_text}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(payment.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isExpired ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Expirado
                            </span>
                          ) : payment.is_manual ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Manual
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Automático
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => confirmPayment(payment.pix_id)}
                              disabled={processingId === payment.pix_id || isExpired}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirmar
                            </button>
                            <button
                              onClick={() => cancelPayment(payment.pix_id)}
                              disabled={processingId === payment.pix_id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-400 mb-2">
              Instruções para Confirmação Manual
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>Verifique em seu app bancário se o pagamento foi recebido</li>
              <li>Confira se o valor corresponde ao da transação</li>
              <li>Confirme que o pagador é o comprador da transação</li>
              <li>Clique em "Confirmar" apenas após verificar o recebimento</li>
              <li>Em caso de dúvida, entre em contato com o suporte</li>
            </ol>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}