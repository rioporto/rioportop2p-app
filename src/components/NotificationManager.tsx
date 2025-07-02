'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { useNotification } from '@/contexts/NotificationContext'

interface NotificationSettings {
  enabled: boolean
  sound: boolean
  transactionUpdates: boolean
  priceAlerts: boolean
  securityAlerts: boolean
  marketingUpdates: boolean
}

export default function NotificationManager() {
  const { addNotification } = useNotification()
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    sound: true,
    transactionUpdates: true,
    priceAlerts: true,
    securityAlerts: true,
    marketingUpdates: false
  })

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      // Load saved settings
      const savedSettings = localStorage.getItem('notificationSettings')
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }
  }, [])

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(settings))
  }, [settings])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      addNotification({
        type: 'error',
        title: 'Notificações não suportadas',
        message: 'Seu navegador não suporta notificações.'
      })
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, enabled: true }))
        addNotification({
          type: 'success',
          title: 'Notificações ativadas',
          message: 'Você receberá notificações importantes sobre suas transações.'
        })
        
        // Send test notification
        sendBrowserNotification(
          'Rio Porto P2P',
          'Notificações ativadas com sucesso!',
          '/icon-192x192.png'
        )
      } else {
        addNotification({
          type: 'warning',
          title: 'Permissão negada',
          message: 'Você pode ativar as notificações nas configurações do navegador.'
        })
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error)
    }
  }

  const sendBrowserNotification = (title: string, body: string, icon?: string) => {
    if (permission === 'granted' && settings.enabled) {
      const notification = new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/icon-192x192.png',
        requireInteraction: false,
        silent: !settings.sound
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000)
    }
  }

  // Example function to simulate different types of notifications
  const sendTestNotification = (type: keyof NotificationSettings) => {
    const messages = {
      transactionUpdates: {
        title: 'Transação Atualizada',
        body: 'Sua compra de 0.001 BTC foi confirmada!'
      },
      priceAlerts: {
        title: 'Alerta de Preço',
        body: 'Bitcoin atingiu R$ 650.000!'
      },
      securityAlerts: {
        title: 'Alerta de Segurança',
        body: 'Novo login detectado em sua conta.'
      },
      marketingUpdates: {
        title: 'Promoção Especial',
        body: 'Taxa zero em transações acima de R$ 10.000!'
      }
    }

    const message = messages[type as keyof typeof messages]
    if (message && settings[type]) {
      sendBrowserNotification(message.title, message.body)
      addNotification({
        type: 'info',
        title: message.title,
        message: message.body
      })
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-orange-500" />
          Configurações de Notificações
        </h2>
        {permission === 'granted' && settings.enabled ? (
          <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
            <Bell className="w-4 h-4" />
            Ativo
          </span>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <BellOff className="w-4 h-4" />
            Inativo
          </span>
        )}
      </div>

      {permission === 'default' && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Ative as notificações para receber alertas importantes sobre suas transações, mudanças de preço e atualizações de segurança.
          </p>
          <button
            onClick={requestPermission}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Ativar Notificações
          </button>
        </div>
      )}

      {permission === 'denied' && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">
            As notificações foram bloqueadas. Para ativá-las, você precisa permitir notificações nas configurações do seu navegador.
          </p>
        </div>
      )}

      {permission === 'granted' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Notificações Ativadas</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receba notificações no navegador</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Som de Notificação</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reproduzir som ao receber notificações</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => setSettings(prev => ({ ...prev, sound: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          <h3 className="font-medium text-gray-900 dark:text-white mt-6 mb-3">Tipos de Notificação</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Atualizações de Transações</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status de compras, vendas e transferências</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.transactionUpdates}
                  onChange={(e) => setSettings(prev => ({ ...prev, transactionUpdates: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Alertas de Preço</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mudanças significativas nos preços</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.priceAlerts}
                  onChange={(e) => setSettings(prev => ({ ...prev, priceAlerts: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Alertas de Segurança</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Logins, mudanças de senha e atividades suspeitas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.securityAlerts}
                  onChange={(e) => setSettings(prev => ({ ...prev, securityAlerts: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Promoções e Novidades</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ofertas especiais e novos recursos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.marketingUpdates}
                  onChange={(e) => setSettings(prev => ({ ...prev, marketingUpdates: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

          {settings.enabled && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Testar Notificações</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => sendTestNotification('transactionUpdates')}
                  disabled={!settings.transactionUpdates}
                  className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Transação
                </button>
                <button
                  onClick={() => sendTestNotification('priceAlerts')}
                  disabled={!settings.priceAlerts}
                  className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Preço
                </button>
                <button
                  onClick={() => sendTestNotification('securityAlerts')}
                  disabled={!settings.securityAlerts}
                  className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Segurança
                </button>
                <button
                  onClick={() => sendTestNotification('marketingUpdates')}
                  disabled={!settings.marketingUpdates}
                  className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Promoção
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}