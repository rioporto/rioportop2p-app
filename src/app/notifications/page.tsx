'use client'

import { Bell, Send, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import NotificationManager from '@/components/NotificationManager'
import { useNotification } from '@/contexts/NotificationContext'

export default function NotificationsPage() {
  const { addNotification } = useNotification()

  const testNotifications = [
    {
      type: 'success' as const,
      title: 'Transação Confirmada',
      message: 'Sua compra de 0.01 BTC foi processada com sucesso!',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      type: 'error' as const,
      title: 'Erro na Transação',
      message: 'Não foi possível processar sua solicitação. Tente novamente.',
      icon: <XCircle className="w-5 h-5" />
    },
    {
      type: 'warning' as const,
      title: 'Atenção Necessária',
      message: 'Sua verificação KYC expira em 7 dias. Atualize seus documentos.',
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      type: 'info' as const,
      title: 'Nova Funcionalidade',
      message: 'Agora você pode configurar alertas de preço personalizados!',
      icon: <Info className="w-5 h-5" />
    }
  ]

  const sendTestNotification = (notification: typeof testNotifications[0]) => {
    addNotification({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      duration: 5000
    })
  }

  const sendNotificationWithAction = () => {
    addNotification({
      type: 'info',
      title: 'Documento Pendente',
      message: 'Você tem um documento aguardando verificação.',
      duration: 10000,
      actions: [
        {
          label: 'Ver Documento',
          onClick: () => {
            window.location.href = '/kyc/verify'
          }
        },
        {
          label: 'Lembrar Depois',
          onClick: () => {
            console.log('Lembrete adiado')
          }
        }
      ]
    })
  }

  const sendPersistentNotification = () => {
    addNotification({
      type: 'warning',
      title: 'Manutenção Programada',
      message: 'O sistema estará em manutenção hoje às 22h por 2 horas.',
      duration: 0 // Won't auto-dismiss
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
            <Bell className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sistema de Notificações
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Configure suas preferências de notificação e mantenha-se atualizado sobre suas transações e alertas importantes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Notification Settings */}
          <div>
            <NotificationManager />
          </div>

          {/* Test Notifications */}
          <div className="space-y-6">
            {/* Demo Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Testar Notificações
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Clique nos botões abaixo para ver diferentes tipos de notificações em ação.
              </p>

              <div className="space-y-3">
                {testNotifications.map((notification, index) => (
                  <button
                    key={index}
                    onClick={() => sendTestNotification(notification)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md ${
                      notification.type === 'success' 
                        ? 'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700' 
                        : notification.type === 'error'
                        ? 'border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700'
                        : notification.type === 'warning'
                        ? 'border-yellow-200 dark:border-yellow-800 hover:border-yellow-300 dark:hover:border-yellow-700'
                        : 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className={`${
                      notification.type === 'success' 
                        ? 'text-green-600 dark:text-green-400' 
                        : notification.type === 'error'
                        ? 'text-red-600 dark:text-red-400'
                        : notification.type === 'warning'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {notification.icon}
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                    </div>
                    <Send className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 space-y-3">
                <button
                  onClick={sendNotificationWithAction}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  <Bell className="w-5 h-5" />
                  Notificação com Ações
                </button>
                
                <button
                  onClick={sendPersistentNotification}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
                >
                  <AlertCircle className="w-5 h-5" />
                  Notificação Persistente
                </button>
              </div>
            </div>

            {/* Notification Examples */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quando você receberá notificações?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Confirmações de Transação</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quando suas compras ou vendas forem confirmadas
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Alertas de Preço</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quando o preço atingir seus limites configurados
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Verificações Pendentes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lembretes sobre documentos ou ações necessárias
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Alertas de Segurança</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Atividades suspeitas ou tentativas de acesso
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Dicas sobre Notificações
              </h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>• As notificações do navegador funcionam mesmo com a aba fechada</li>
                <li>• Você pode personalizar quais tipos de notificação deseja receber</li>
                <li>• As notificações respeitam o modo "Não Perturbe" do seu dispositivo</li>
                <li>• Suas preferências são salvas localmente e sincronizadas com sua conta</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}