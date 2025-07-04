'use client'

import { useState } from 'react'
import { 
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Clock,
  User,
  Settings,
  AlertCircle,
  TrendingUp
} from 'lucide-react'

interface SecurityEvent {
  id: number
  type: 'login' | 'failed_login' | 'password_change' | 'suspicious_activity' | '2fa_enabled' | '2fa_disabled'
  user: string
  ip: string
  device: string
  location: string
  timestamp: string
  status: 'success' | 'failed' | 'blocked'
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 1,
    type: 'suspicious_activity',
    user: 'joao.silva@email.com',
    ip: '189.45.67.123',
    device: 'iPhone 13',
    location: 'São Paulo, BR',
    timestamp: '2024-03-15 14:30:45',
    status: 'blocked'
  },
  {
    id: 2,
    type: 'failed_login',
    user: 'maria.santos@email.com',
    ip: '201.12.34.567',
    device: 'Windows 11',
    location: 'Rio de Janeiro, BR',
    timestamp: '2024-03-15 13:45:22',
    status: 'failed'
  },
  {
    id: 3,
    type: 'login',
    user: 'pedro.costa@email.com',
    ip: '177.98.12.34',
    device: 'Android 12',
    location: 'Belo Horizonte, BR',
    timestamp: '2024-03-15 12:20:10',
    status: 'success'
  },
  {
    id: 4,
    type: '2fa_enabled',
    user: 'ana.oliveira@email.com',
    ip: '192.45.67.89',
    device: 'MacBook Pro',
    location: 'Porto Alegre, BR',
    timestamp: '2024-03-15 11:15:30',
    status: 'success'
  },
  {
    id: 5,
    type: 'password_change',
    user: 'carlos.mendes@email.com',
    ip: '203.56.78.90',
    device: 'iPad Pro',
    location: 'Brasília, BR',
    timestamp: '2024-03-15 10:05:15',
    status: 'success'
  }
]

const eventTypeConfig = {
  login: { label: 'Login', icon: CheckCircle, color: 'text-green-600' },
  failed_login: { label: 'Login Falhou', icon: XCircle, color: 'text-red-600' },
  password_change: { label: 'Senha Alterada', icon: Key, color: 'text-blue-600' },
  suspicious_activity: { label: 'Atividade Suspeita', icon: AlertTriangle, color: 'text-orange-600' },
  '2fa_enabled': { label: '2FA Ativado', icon: Shield, color: 'text-green-600' },
  '2fa_disabled': { label: '2FA Desativado', icon: Shield, color: 'text-red-600' }
}

const deviceIcons: Record<string, any> = {
  'iPhone': Smartphone,
  'Android': Smartphone,
  'Windows': Monitor,
  'MacBook': Monitor,
  'iPad': Smartphone
}

interface SecurityRule {
  id: number
  name: string
  description: string
  enabled: boolean
  severity: 'low' | 'medium' | 'high'
  triggersCount: number
}

const mockSecurityRules: SecurityRule[] = [
  {
    id: 1,
    name: 'Múltiplas tentativas de login',
    description: 'Bloquear após 5 tentativas falhadas em 15 minutos',
    enabled: true,
    severity: 'high',
    triggersCount: 23
  },
  {
    id: 2,
    name: 'Login de localização incomum',
    description: 'Alertar quando login de novo país',
    enabled: true,
    severity: 'medium',
    triggersCount: 45
  },
  {
    id: 3,
    name: 'Transação de alto valor',
    description: 'Requerer 2FA para transações acima de R$ 10.000',
    enabled: true,
    severity: 'high',
    triggersCount: 12
  },
  {
    id: 4,
    name: 'Múltiplos dispositivos',
    description: 'Alertar ao detectar login de mais de 3 dispositivos',
    enabled: false,
    severity: 'low',
    triggersCount: 8
  }
]

export default function SecurityPage() {
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'events' | 'rules' | 'settings'>('events')

  const filteredEvents = mockSecurityEvents.filter(event => {
    return selectedEventType === null || event.type === selectedEventType
  })

  const stats = {
    totalEvents: mockSecurityEvents.length,
    suspiciousActivities: mockSecurityEvents.filter(e => e.type === 'suspicious_activity').length,
    failedLogins: mockSecurityEvents.filter(e => e.type === 'failed_login').length,
    blockedAttempts: mockSecurityEvents.filter(e => e.status === 'blocked').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Segurança</h1>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Configurar Políticas
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Eventos Hoje</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEvents}</p>
            </div>
            <Activity className="w-8 h-8 text-gray-400 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Atividades Suspeitas</p>
              <p className="text-2xl font-bold text-orange-600">{stats.suspiciousActivities}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Logins Falhados</p>
              <p className="text-2xl font-bold text-red-600">{stats.failedLogins}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bloqueados</p>
              <p className="text-2xl font-bold text-purple-600">{stats.blockedAttempts}</p>
            </div>
            <Lock className="w-8 h-8 text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
        <div className="flex">
          <button
            onClick={() => setSelectedTab('events')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'events'
                ? 'bg-orange-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Eventos de Segurança
          </button>
          <button
            onClick={() => setSelectedTab('rules')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'rules'
                ? 'bg-orange-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Regras de Segurança
          </button>
          <button
            onClick={() => setSelectedTab('settings')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              selectedTab === 'settings'
                ? 'bg-orange-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Configurações
          </button>
        </div>
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'events' && (
        <>
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedEventType(null)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedEventType === null
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Todos
              </button>
              {Object.entries(eventTypeConfig).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setSelectedEventType(type)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedEventType === type
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvents.map((event) => {
                const EventIcon = eventTypeConfig[event.type].icon
                const DeviceIcon = deviceIcons[event.device.split(' ')[0]] || Monitor
                
                return (
                  <div key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <EventIcon className={`w-5 h-5 ${eventTypeConfig[event.type].color}`} />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {eventTypeConfig[event.type].label}
                          </span>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            event.status === 'success' ? 'bg-green-100 text-green-800' :
                            event.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status === 'success' ? 'Sucesso' :
                             event.status === 'failed' ? 'Falhou' : 'Bloqueado'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{event.user}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{event.ip}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{event.device}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{event.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{event.timestamp}</span>
                        </div>
                      </div>

                      <button className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        Detalhes
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {selectedTab === 'rules' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockSecurityRules.map((rule) => (
              <div key={rule.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {rule.name}
                      </h3>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rule.severity === 'high' ? 'bg-red-100 text-red-800' :
                        rule.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.severity === 'high' ? 'Alta' :
                         rule.severity === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {rule.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Acionada {rule.triggersCount} vezes
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={rule.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Configurações Gerais
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">2FA Obrigatório</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Exigir autenticação de dois fatores para todos os usuários
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Sessão Única</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Permitir apenas uma sessão ativa por usuário
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Logs Detalhados</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Registrar todas as ações dos usuários
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Alertas de Segurança
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email para Alertas
                </label>
                <input
                  type="email"
                  defaultValue="security@rioportop2p.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Webhook URL
                </label>
                <input
                  type="url"
                  placeholder="https://api.exemplo.com/webhook"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Configuração de Alertas
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Alertas críticos serão enviados imediatamente. 
                      Outros alertas são agrupados e enviados a cada hora.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}