'use client'

import { useState } from 'react'
import { 
  Settings,
  Globe,
  Bell,
  Mail,
  Database,
  Shield,
  Zap,
  Save,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Server,
  Clock,
  DollarSign
} from 'lucide-react'

interface ConfigSection {
  id: string
  title: string
  icon: any
  description: string
}

const configSections: ConfigSection[] = [
  {
    id: 'general',
    title: 'Configurações Gerais',
    icon: Settings,
    description: 'Configurações básicas do sistema'
  },
  {
    id: 'email',
    title: 'E-mail e Notificações',
    icon: Mail,
    description: 'Configurações de envio de e-mail e notificações'
  },
  {
    id: 'api',
    title: 'APIs e Integrações',
    icon: Zap,
    description: 'Chaves de API e integrações externas'
  },
  {
    id: 'database',
    title: 'Banco de Dados',
    icon: Database,
    description: 'Configurações e manutenção do banco de dados'
  },
  {
    id: 'security',
    title: 'Segurança',
    icon: Shield,
    description: 'Políticas de segurança e autenticação'
  },
  {
    id: 'system',
    title: 'Sistema',
    icon: Server,
    description: 'Configurações do servidor e performance'
  }
]

export default function ConfigurationsPage() {
  const [selectedSection, setSelectedSection] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="w-4 h-4" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar Alterações
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Seções
              </h2>
              <nav className="space-y-1">
                {configSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        selectedSection === section.id
                          ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {section.title}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {selectedSection === 'general' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informações do Sistema
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome da Plataforma
                    </label>
                    <input
                      type="text"
                      defaultValue="Rio Porto P2P"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      URL do Site
                    </label>
                    <input
                      type="url"
                      defaultValue="https://rioportop2p.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Idioma Padrão
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fuso Horário
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                      <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="Europe/London">London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Configurações de Moeda
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Moeda Padrão
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                      <option value="BRL">Real Brasileiro (BRL)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Formato de Número
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                      <option value="pt-BR">1.234,56</option>
                      <option value="en-US">1,234.56</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'email' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Configurações de E-mail
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Provedor de E-mail
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                      <option value="resend">Resend</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="smtp">SMTP Personalizado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      E-mail de Envio
                    </label>
                    <input
                      type="email"
                      defaultValue="noreply@rioportop2p.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome do Remetente
                    </label>
                    <input
                      type="text"
                      defaultValue="Rio Porto P2P"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Templates de E-mail
                </h2>
                <div className="space-y-3">
                  {['Boas-vindas', 'Confirmação de Transação', 'Redefinição de Senha', 'KYC Aprovado', 'KYC Rejeitado'].map((template) => (
                    <div key={template} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{template}</span>
                      <button className="text-orange-600 hover:text-orange-700 text-sm">
                        Editar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'api' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Chaves de API
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CoinMarketCap API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        defaultValue="••••••••••••••••"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                      />
                      <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Mostrar
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Google Maps API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        defaultValue="••••••••••••••••"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                      />
                      <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Mostrar
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      PIX API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        defaultValue="••••••••••••••••"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                      />
                      <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Mostrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Webhooks
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">PIX Webhook</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">https://api.rioportop2p.com/webhooks/pix</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Ativo</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">KYC Webhook</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">https://api.rioportop2p.com/webhooks/kyc</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Ativo</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'database' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Status do Banco de Dados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tipo</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">PostgreSQL</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Versão</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">14.5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Conectado</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tamanho</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">245 MB</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Conexões</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">12/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Uptime</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">45 dias</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Manutenção
                </h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Backup Manual</span>
                    <Database className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Limpar Cache</span>
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Otimizar Tabelas</span>
                    <Zap className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'security' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Políticas de Senha
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Comprimento mínimo</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Número mínimo de caracteres</p>
                    </div>
                    <input
                      type="number"
                      defaultValue="8"
                      min="6"
                      max="32"
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Exigir caracteres especiais</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pelo menos um caractere especial</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Exigir números</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pelo menos um número</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Sessões
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Tempo de expiração</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tempo até logout automático</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="120">2 horas</option>
                      <option value="240">4 horas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'system' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informações do Sistema
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Versão do Sistema</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">2.1.0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Node.js</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">v18.17.0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Next.js</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">14.0.4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Ambiente</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Produção</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">CPU</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">32%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Memória</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '67%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Disco</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
              Atenção
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Alterações nas configurações podem afetar o funcionamento do sistema. 
              Certifique-se de testar em ambiente de desenvolvimento antes de aplicar em produção.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}