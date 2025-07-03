'use client'

import { useNotification } from '@/contexts/NotificationContext'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  AlertCircle,
  TrendingUp,
  BookOpen,
  ShieldCheck,
  Users,
  DollarSign,
  Loader2
} from 'lucide-react'
import { NotificationType } from '@/types/notification'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface NotificationPanelProps {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    fetchNotifications 
  } = useNotification()
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'transaction':
        return <DollarSign className="w-5 h-5" />
      case 'kyc':
        return <ShieldCheck className="w-5 h-5" />
      case 'course':
        return <BookOpen className="w-5 h-5" />
      case 'system':
        return <AlertCircle className="w-5 h-5" />
      case 'p2p_trade':
        return <Users className="w-5 h-5" />
      case 'price_alert':
        return <TrendingUp className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'transaction':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
      case 'kyc':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
      case 'course':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20'
      case 'system':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
      case 'p2p_trade':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20'
      case 'price_alert':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const handleNotificationClick = async (notification: any) => {
    // Mark as read if not already
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    // Navigate based on metadata
    if (notification.metadata?.url) {
      router.push(notification.metadata.url)
      onClose()
    }
  }

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    setDeletingId(notificationId)
    await deleteNotification(notificationId)
    setDeletingId(null)
  }

  return (
    <div className="w-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notificações
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma notificação no momento
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors
                  ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                `}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, notification.id)}
                    disabled={deletingId === notification.id}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {deletingId === notification.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              router.push('/dashboard/notifications')
              onClose()
            }}
            className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver todas as notificações
          </button>
        </div>
      )}
    </div>
  )
}