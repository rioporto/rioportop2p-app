'use client'

import { useState } from 'react'
import { useNotification } from '@/contexts/NotificationContext'
import NotificationBell from '@/components/notifications/NotificationBell'
import { getUser } from '@/lib/supabase'
import { NotificationType } from '@/types/notification'

export default function TestNotificationsPage() {
  const { addToastNotification } = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState('')

  const notificationTypes: NotificationType[] = [
    'transaction',
    'kyc',
    'course',
    'system',
    'p2p_trade',
    'price_alert'
  ]

  const sampleNotifications = {
    transaction: {
      title: 'Transação Concluída',
      message: 'Sua compra de 0.001 BTC foi processada com sucesso.',
      metadata: {
        transactionId: '123456',
        transactionType: 'buy',
        amount: 0.001,
        currency: 'BTC',
        status: 'completed'
      }
    },
    kyc: {
      title: 'Verificação KYC Aprovada',
      message: 'Parabéns! Sua verificação de identidade foi aprovada.',
      metadata: {
        kycLevel: 2,
        kycStatus: 'approved'
      }
    },
    course: {
      title: 'Novo Curso Disponível',
      message: 'O curso "Trading Avançado de Criptomoedas" está disponível.',
      metadata: {
        courseId: 'course-123',
        courseTitle: 'Trading Avançado de Criptomoedas',
        url: '/courses/trading-avancado'
      }
    },
    system: {
      title: 'Manutenção Programada',
      message: 'O sistema passará por manutenção das 2h às 4h de amanhã.',
      metadata: {
        priority: 'high',
        action: 'maintenance'
      }
    },
    p2p_trade: {
      title: 'Nova Oferta P2P',
      message: 'João Silva quer comprar 500 USDT pelo seu preço.',
      metadata: {
        tradeId: 'trade-456',
        tradeAmount: 500,
        tradeCurrency: 'USDT',
        tradePartner: 'João Silva',
        url: '/p2p/trade/456'
      }
    },
    price_alert: {
      title: 'Alerta de Preço - Bitcoin',
      message: 'Bitcoin atingiu R$ 350.000 - seu alerta foi acionado!',
      metadata: {
        alertId: 'alert-789',
        alertPrice: 350000,
        currentPrice: 350500,
        url: '/dashboard'
      }
    }
  }

  const createNotification = async (type: NotificationType) => {
    setIsLoading(true)
    
    try {
      // Get current user ID
      const { user } = await getUser()
      if (!user) {
        addToastNotification({
          type: 'error',
          title: 'Erro',
          message: 'Você precisa estar logado para testar notificações'
        })
        return
      }

      const notification = sampleNotifications[type]
      
      // Create notification via API
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId || user.id,
          type,
          ...notification
        })
      })

      if (response.ok) {
        addToastNotification({
          type: 'success',
          title: 'Notificação Criada',
          message: `Uma notificação do tipo "${type}" foi criada com sucesso!`
        })
      } else {
        const error = await response.json()
        addToastNotification({
          type: 'error',
          title: 'Erro ao criar notificação',
          message: error.error || 'Erro desconhecido'
        })
      }
    } catch (error) {
      addToastNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao criar notificação'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentUserId = async () => {
    const { user } = await getUser()
    if (user) {
      setUserId(user.id)
      addToastNotification({
        type: 'info',
        title: 'ID do Usuário',
        message: `Seu ID: ${user.id}`
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Teste de Notificações em Tempo Real
            </h1>
            <NotificationBell />
          </div>

          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Como testar:
              </h2>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
                <li>Clique no botão "Obter ID do Usuário" para ver seu ID</li>
                <li>Clique em qualquer tipo de notificação abaixo para criar uma</li>
                <li>Observe o ícone de sino no canto superior direito - o contador será atualizado em tempo real</li>
                <li>Clique no sino para ver as notificações</li>
                <li>Abra esta página em outra aba/janela para ver as notificações chegando em tempo real</li>
              </ol>
            </div>

            {/* User ID Section */}
            <div className="space-y-2">
              <button
                onClick={getCurrentUserId}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Obter ID do Usuário
              </button>
              {userId && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID do Usuário (para enviar notificação para outro usuário):
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="ID do usuário destinatário"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Você pode modificar o ID para enviar notificações para outros usuários (requer permissão de admin)
                  </p>
                </div>
              )}
            </div>

            {/* Notification Types */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Criar Notificações de Teste:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {notificationTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => createNotification(type)}
                    disabled={isLoading}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${isLoading 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:shadow-lg hover:scale-105 cursor-pointer'
                      }
                      ${getButtonStyle(type)}
                    `}
                  >
                    <div className="text-center">
                      <div className="font-semibold capitalize mb-1">
                        {type.replace('_', ' ')}
                      </div>
                      <div className="text-xs opacity-75">
                        {sampleNotifications[type].title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Toast Notifications Test */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Testar Notificações Toast (UI apenas):
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => addToastNotification({
                    type: 'success',
                    title: 'Sucesso!',
                    message: 'Esta é uma notificação de sucesso'
                  })}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Sucesso
                </button>
                <button
                  onClick={() => addToastNotification({
                    type: 'error',
                    title: 'Erro!',
                    message: 'Esta é uma notificação de erro'
                  })}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Erro
                </button>
                <button
                  onClick={() => addToastNotification({
                    type: 'warning',
                    title: 'Atenção!',
                    message: 'Esta é uma notificação de aviso'
                  })}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Aviso
                </button>
                <button
                  onClick={() => addToastNotification({
                    type: 'info',
                    title: 'Informação',
                    message: 'Esta é uma notificação informativa'
                  })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getButtonStyle(type: NotificationType): string {
  switch (type) {
    case 'transaction':
      return 'border-green-500 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20'
    case 'kyc':
      return 'border-blue-500 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20'
    case 'course':
      return 'border-purple-500 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20'
    case 'system':
      return 'border-yellow-500 text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
    case 'p2p_trade':
      return 'border-indigo-500 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20'
    case 'price_alert':
      return 'border-orange-500 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20'
    default:
      return 'border-gray-500 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/20'
  }
}