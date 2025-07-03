'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { supabase, getUser } from '@/lib/supabase'
import { DatabaseNotification, NotificationType, EnhancedNotification } from '@/types/notification'
import { RealtimeChannel } from '@supabase/supabase-js'

export type ToastNotificationType = 'success' | 'error' | 'warning' | 'info'

export interface ToastNotification {
  id: string
  type: ToastNotificationType
  title: string
  message?: string
  duration?: number
  actions?: {
    label: string
    onClick: () => void
  }[]
}

interface NotificationContextData {
  // Toast notifications (temporary UI notifications)
  toastNotifications: ToastNotification[]
  addToastNotification: (notification: Omit<ToastNotification, 'id'>) => void
  removeToastNotification: (id: string) => void
  clearToastNotifications: () => void
  
  // Database notifications (persistent notifications)
  notifications: EnhancedNotification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: (limit?: number, offset?: number) => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de um NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  // Toast notifications state
  const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([])
  
  // Database notifications state
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null)

  // Toast notification methods
  const addToastNotification = useCallback((notification: Omit<ToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification: ToastNotification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    }

    setToastNotifications(prev => [...prev, newNotification])

    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeToastNotification(id)
      }, newNotification.duration)
    }
  }, [])

  const removeToastNotification = useCallback((id: string) => {
    setToastNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearToastNotifications = useCallback(() => {
    setToastNotifications([])
  }, [])

  // Database notification methods
  const fetchNotifications = useCallback(async (limit = 20, offset = 0) => {
    if (!userId) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/notifications?limit=${limit}&offset=${offset}`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      addToastNotification({
        type: 'error',
        title: 'Erro ao carregar notificações',
        message: 'Não foi possível carregar suas notificações'
      })
    } finally {
      setIsLoading(false)
    }
  }, [userId, addToastNotification])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read: true })
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true, read_at: new Date().toISOString() } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      addToastNotification({
        type: 'error',
        title: 'Erro ao marcar notificação',
        message: 'Não foi possível marcar a notificação como lida'
      })
    }
  }, [addToastNotification])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST'
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
        )
        setUnreadCount(0)
        addToastNotification({
          type: 'success',
          title: 'Notificações marcadas como lidas',
          message: 'Todas as notificações foram marcadas como lidas'
        })
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      addToastNotification({
        type: 'error',
        title: 'Erro ao marcar notificações',
        message: 'Não foi possível marcar todas as notificações como lidas'
      })
    }
  }, [addToastNotification])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const notification = notifications.find(n => n.id === notificationId)
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        if (notification && !notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
        addToastNotification({
          type: 'success',
          title: 'Notificação removida',
          message: 'A notificação foi removida com sucesso'
        })
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      addToastNotification({
        type: 'error',
        title: 'Erro ao remover notificação',
        message: 'Não foi possível remover a notificação'
      })
    }
  }, [notifications, addToastNotification])

  // Setup user and real-time subscription
  useEffect(() => {
    const setupUser = async () => {
      const { user } = await getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    setupUser()
  }, [])

  // Fetch initial notifications when user is set
  useEffect(() => {
    if (userId) {
      fetchNotifications()
    }
  }, [userId, fetchNotifications])

  // Setup real-time subscription
  useEffect(() => {
    if (!userId || !supabase) return

    // Clean up previous subscription
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
    }

    // Create new subscription
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as DatabaseNotification
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
          
          // Show toast notification for new notifications
          addToastNotification({
            type: 'info',
            title: newNotification.title,
            message: newNotification.message,
            duration: 7000
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const updatedNotification = payload.new as DatabaseNotification
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          )
          
          // Update unread count if notification was marked as read
          if (payload.old && !payload.old.read && updatedNotification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1))
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const deletedNotification = payload.old as DatabaseNotification
          setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id))
          if (!deletedNotification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1))
          }
        }
      )
      .subscribe()

    setRealtimeChannel(channel)

    // Cleanup on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, addToastNotification])

  return (
    <NotificationContext.Provider 
      value={{ 
        toastNotifications, 
        addToastNotification, 
        removeToastNotification, 
        clearToastNotifications,
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
      }}
    >
      {children}
      <ToastNotificationContainer />
    </NotificationContext.Provider>
  )
}

function ToastNotificationContainer() {
  const { toastNotifications, removeToastNotification } = useNotification()

  const getIcon = (type: ToastNotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <XCircle className="w-5 h-5" />
      case 'warning':
        return <AlertCircle className="w-5 h-5" />
      case 'info':
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = (type: ToastNotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {toastNotifications.map(notification => (
        <div
          key={notification.id}
          className={`
            flex items-start gap-3 p-4 rounded-lg border shadow-lg
            transform transition-all duration-300 ease-in-out
            ${getStyles(notification.type)}
          `}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">{notification.title}</h4>
            {notification.message && (
              <p className="text-sm mt-1 opacity-90">{notification.message}</p>
            )}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="text-sm font-medium underline hover:no-underline"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => removeToastNotification(notification.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}