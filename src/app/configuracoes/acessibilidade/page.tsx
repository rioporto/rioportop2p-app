'use client'

import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { Eye, Volume2, Move, Keyboard, AlertCircle, RotateCcw } from 'lucide-react'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { Alert } from '@/components/ui/Alert'
import { useState } from 'react'

export default function ConfiguracoesAcessibilidadePage() {
  const { preferences, updatePreference, resetPreferences } = useUserPreferences()
  const [showResetAlert, setShowResetAlert] = useState(false)
  const [showSavedAlert, setShowSavedAlert] = useState(false)

  const handleReset = () => {
    resetPreferences()
    setShowResetAlert(true)
    setTimeout(() => setShowResetAlert(false), 3000)
  }

  const handlePreferenceChange = (key: any, value: any) => {
    updatePreference(key, value)
    setShowSavedAlert(true)
    setTimeout(() => setShowSavedAlert(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Configurações de Acessibilidade
        </h1>

        {showSavedAlert && (
          <Alert type="success" dismissible onDismiss={() => setShowSavedAlert(false)}>
            Preferências salvas automaticamente
          </Alert>
        )}

        {showResetAlert && (
          <Alert type="info" dismissible onDismiss={() => setShowResetAlert(false)}>
            Todas as preferências foram restauradas para o padrão
          </Alert>
        )}

        {/* Visual Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Configurações Visuais
          </h2>

          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Alto Contraste</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Aumenta o contraste entre texto e fundo
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.highContrast}
                  onChange={(e) => handlePreferenceChange('highContrast', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Font Size */}
            <div>
              <h3 className="font-medium mb-2">Tamanho da Fonte</h3>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePreferenceChange('fontSize', size)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      preferences.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {size === 'small' && 'Pequena'}
                    {size === 'medium' && 'Média'}
                    {size === 'large' && 'Grande'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Motion Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Move className="w-5 h-5" />
            Configurações de Movimento
          </h2>

          <div className="space-y-4">
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Reduzir Movimento</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Minimiza animações e transições
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.reducedMotion}
                  onChange={(e) => handlePreferenceChange('reducedMotion', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Autoplay Videos */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Reproduzir Vídeos Automaticamente</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Inicia vídeos sem interação do usuário
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoplayVideos}
                  onChange={(e) => handlePreferenceChange('autoplayVideos', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Interaction Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Configurações de Interação
          </h2>

          <div className="space-y-4">
            {/* Keyboard Shortcuts */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Atalhos de Teclado</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Habilita comandos rápidos via teclado
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.keyboardShortcuts}
                  onChange={(e) => handlePreferenceChange('keyboardShortcuts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Confirm Actions */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Confirmar Ações Importantes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pede confirmação antes de ações críticas
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.confirmBeforeActions}
                  onChange={(e) => handlePreferenceChange('confirmBeforeActions', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Configurações de Notificação
          </h2>

          <div className="space-y-4">
            {/* Sound Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Alertas Sonoros</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toca sons para notificações importantes
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.soundAlerts}
                  onChange={(e) => handlePreferenceChange('soundAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Visual Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Alertas Visuais</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mostra indicadores visuais para notificações
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.visualAlerts}
                  onChange={(e) => handlePreferenceChange('visualAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Reset Button */}
        <div className="flex justify-end">
          <LoadingButton
            onClick={handleReset}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar Padrões
          </LoadingButton>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Sobre as Configurações de Acessibilidade
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Estas configurações são salvas automaticamente em seu navegador e serão aplicadas 
            sempre que você acessar a plataforma. Algumas configurações podem detectar 
            automaticamente as preferências do seu sistema operacional.
          </p>
        </div>
      </div>
    </div>
  )
}