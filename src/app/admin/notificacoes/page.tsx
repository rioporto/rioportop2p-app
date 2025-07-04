'use client'

import { useState } from 'react'
import { 
  Bell,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  Users,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Settings
} from 'lucide-react'

interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  channel: 'push' | 'email' | 'sms' | 'all'
  target: 'all' | 'specific' | 'segment'
  targetDetails?: string
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  sentAt?: string
  scheduledFor?: string
  createdBy: string
  recipients: number
  opened?: number
  clicked?: number
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Nova funcionalidade disponível',
    message: 'Agora você pode usar o PIX automático em suas transações P2P!',
    type: 'info',
    channel: 'push',
    target: 'all',
    status: 'sent',
    sentAt: '2024-03-15 14:30',
    createdBy: 'Admin João',
    recipients: 1234,
    opened: 987,
    clicked: 234
  },
  {
    id: 2,
    title: 'Manutenção programada',
    message: 'O sistema estará em manutenção no domingo das 02:00 às 06:00',
    type: 'warning',
    channel: 'all',
    target: 'all',
    status: 'scheduled',
    scheduledFor: '2024-03-17 18:00',
    createdBy: 'Admin Maria',
    recipients: 1234
  },
  {
    id: 3,
    title: 'Promoção de taxas',
    message: 'Taxa zero em transações acima de R$ 5.000 este fim de semana!',
    type: 'success',
    channel: 'email',
    target: 'segment',
    targetDetails: 'Usuários VIP',
    status: 'sent',
    sentAt: '2024-03-14 09:00',
    createdBy: 'Admin Carlos',
    recipients: 89,
    opened: 67,
    clicked: 45
  },
  {
    id: 4,
    title: 'Alerta de segurança',
    message: 'Detectamos uma tentativa de acesso suspeita em sua conta',
    type: 'error',
    channel: 'sms',
    target: 'specific',
    targetDetails: '5 usuários',
    status: 'sent',
    sentAt: '2024-03-15 16:45',
    createdBy: 'Sistema',
    recipients: 5,
    opened: 5
  },
  {
    id: 5,
    title: 'Lembrete KYC',
    message: 'Complete seu cadastro para aumentar seus limites',
    type: 'info',
    channel: 'push',
    target: 'segment',
    targetDetails: 'KYC Nível 1',
    status: 'draft',
    createdBy: 'Admin Ana',
    recipients: 342
  }
]

const typeConfig = {
  info: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  success: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  error: { color: 'bg-red-100 text-red-800', icon: XCircle }
}

const channelConfig = {
  push: { label: 'Push', icon: Bell, color: 'text-purple-600' },
  email: { label: 'E-mail', icon: Mail, color: 'text-blue-600' },
  sms: { label: 'SMS', icon: Smartphone, color: 'text-green-600' },
  all: { label: 'Todos', icon: Users, color: 'text-orange-600' }
}

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
  scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Agendada' },
  sent: { color: 'bg-green-100 text-green-800', label: 'Enviada' },
  failed: { color: 'bg-red-100 text-red-800', label: 'Falhou' }
}

export default function NotificationsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [showNewNotification, setShowNewNotification] = useState(false)

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesStatus = selectedStatus === null || notification.status === selectedStatus
    const matchesChannel = selectedChannel === null || notification.channel === selectedChannel
    return matchesStatus && matchesChannel
  })

  const stats = {
    total: mockNotifications.length,
    sent: mockNotifications.filter(n => n.status === 'sent').length,
    scheduled: mockNotifications.filter(n => n.status === 'scheduled').length,
    draft: mockNotifications.filter(n => n.status === 'draft').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notificações</h1>
        <button
          onClick={() => setShowNewNotification(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nova Notificação
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <Bell className="w-8 h-8 text-gray-400 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Enviadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
            </div>
            <Send className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Agendadas</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rascunhos</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-gray-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos Status</option>
              <option value="draft">Rascunhos</option>
              <option value="scheduled">Agendadas</option>
              <option value="sent">Enviadas</option>
              <option value="failed">Falharam</option>
            </select>
            <select
              value={selectedChannel || ''}
              onChange={(e) => setSelectedChannel(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos Canais</option>
              <option value="push">Push</option>
              <option value="email">E-mail</option>
              <option value="sms">SMS</option>
              <option value="all">Todos</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNotifications.map((notification) => {
            const TypeIcon = typeConfig[notification.type].icon
            const ChannelIcon = channelConfig[notification.channel].icon
            
            return (
              <div key={notification.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <TypeIcon className={`w-5 h-5 ${typeConfig[notification.type].color.split(' ')[1]}`} />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[notification.status].color}`}>
                        {statusConfig[notification.status].label}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {notification.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <ChannelIcon className={`w-4 h-4 ${channelConfig[notification.channel].color}`} />
                        <span className="text-gray-600 dark:text-gray-400">
                          {channelConfig[notification.channel].label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {notification.recipients} destinatários
                        </span>
                      </div>

                      {notification.targetDetails && (
                        <span className="text-gray-600 dark:text-gray-400">
                          ({notification.targetDetails})
                        </span>
                      )}

                      {notification.sentAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Enviado: {notification.sentAt}
                          </span>
                        </div>
                      )}

                      {notification.scheduledFor && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Agendado: {notification.scheduledFor}
                          </span>
                        </div>
                      )}
                    </div>

                    {notification.status === 'sent' && notification.opened && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500 dark:text-gray-400">Taxa de abertura:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {((notification.opened / notification.recipients) * 100).toFixed(1)}%
                          </span>
                        </div>
                        {notification.clicked && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 dark:text-gray-400">Taxa de clique:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {((notification.clicked / notification.recipients) * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Criado por {notification.createdBy}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {notification.status === 'draft' && (
                      <>
                        <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
                          Enviar Agora
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          Agendar
                        </button>
                      </>
                    )}
                    <button className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* New Notification Modal (simplified) */}
      {showNewNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Nova Notificação
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                  placeholder="Digite o título da notificação"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mensagem
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Digite a mensagem da notificação"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                    <option value="info">Informação</option>
                    <option value="success">Sucesso</option>
                    <option value="warning">Aviso</option>
                    <option value="error">Erro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Canal
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                    <option value="push">Push</option>
                    <option value="email">E-mail</option>
                    <option value="sms">SMS</option>
                    <option value="all">Todos</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowNewNotification(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Criar Notificação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}