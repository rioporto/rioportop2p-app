'use client'

import { useState, useEffect } from 'react'
import { Shield, Loader2, AlertCircle, Check, X, Key, Smartphone } from 'lucide-react'
import { useNotification } from '@/contexts/NotificationContext'
import TwoFactorSetup from '@/components/auth/TwoFactorSetup'

export default function SecuritySettingsPage() {
  const { addNotification } = useNotification()
  const [isLoading, setIsLoading] = useState(true)
  const [twoFactorStatus, setTwoFactorStatus] = useState({
    enabled: false,
    verified: false,
    backupCodesGenerated: false,
    remainingBackupCodes: 0
  })
  const [showSetup, setShowSetup] = useState(false)
  const [showDisable, setShowDisable] = useState(false)
  const [disableForm, setDisableForm] = useState({ password: '', token: '' })
  const [isDisabling, setIsDisabling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTwoFactorStatus()
  }, [])

  const fetchTwoFactorStatus = async () => {
    try {
      const [statusResponse, backupResponse] = await Promise.all([
        fetch('/api/auth/2fa/setup'),
        fetch('/api/auth/2fa/backup-codes')
      ])

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        const backupData = await backupResponse.json()
        
        setTwoFactorStatus({
          ...statusData,
          remainingBackupCodes: backupData.remainingCodes || 0
        })
      }
    } catch (error) {
      console.error('Error fetching 2FA status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsDisabling(true)

    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disableForm)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao desativar 2FA')
      }

      addNotification({
        type: 'success',
        title: '2FA Desativado',
        message: 'Autenticação de dois fatores foi desativada',
        duration: 5000
      })

      setShowDisable(false)
      setDisableForm({ password: '', token: '' })
      await fetchTwoFactorStatus()
    } catch (err: any) {
      setError(err.message || 'Erro ao desativar 2FA')
    } finally {
      setIsDisabling(false)
    }
  }

  const handleRegenerateBackupCodes = async () => {
    if (!confirm('Isso invalidará todos os códigos de backup existentes. Deseja continuar?')) {
      return
    }

    try {
      const response = await fetch('/api/auth/2fa/backup-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar códigos de backup')
      }

      // Show backup codes in a modal or download them
      const content = `Códigos de Backup - RioPorto P2P
=====================================
Guarde estes códigos em um local seguro.
Cada código pode ser usado apenas uma vez.

${data.backupCodes.join('\n')}

Data de geração: ${new Date().toLocaleString('pt-BR')}
=====================================`

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'rioporto-p2p-backup-codes.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      addNotification({
        type: 'success',
        title: 'Novos códigos gerados!',
        message: 'Seus códigos de backup foram regenerados e baixados',
        duration: 5000
      })

      await fetchTwoFactorStatus()
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: err.message || 'Erro ao gerar códigos de backup',
        duration: 5000
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configurações de Segurança
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie a segurança da sua conta e métodos de autenticação
        </p>
      </div>

      {/* 2FA Status Card */}
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${twoFactorStatus.enabled ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Shield className={`h-6 w-6 ${twoFactorStatus.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Autenticação de Dois Fatores (2FA)
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Adicione uma camada extra de segurança usando um aplicativo autenticador
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            twoFactorStatus.enabled 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {twoFactorStatus.enabled ? 'Ativado' : 'Desativado'}
          </div>
        </div>

        {!twoFactorStatus.enabled && !showSetup && (
          <button
            onClick={() => setShowSetup(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            <Smartphone className="h-4 w-4" />
            Configurar 2FA
          </button>
        )}

        {twoFactorStatus.enabled && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Códigos de Backup
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {twoFactorStatus.remainingBackupCodes} códigos restantes
                  </p>
                </div>
              </div>
              <button
                onClick={handleRegenerateBackupCodes}
                className="text-sm font-medium text-orange-600 hover:text-orange-500"
              >
                Regenerar Códigos
              </button>
            </div>

            {!showDisable ? (
              <button
                onClick={() => setShowDisable(true)}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Desativar 2FA
              </button>
            ) : (
              <form onSubmit={handleDisable2FA} className="space-y-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-medium text-red-900 dark:text-red-100">
                  Desativar Autenticação de Dois Fatores
                </h3>
                
                {error && (
                  <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Senha da Conta
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={disableForm.password}
                    onChange={(e) => setDisableForm({ ...disableForm, password: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Código de Autenticação
                  </label>
                  <input
                    id="token"
                    type="text"
                    required
                    value={disableForm.token}
                    onChange={(e) => setDisableForm({ ...disableForm, token: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDisable(false)
                      setDisableForm({ password: '', token: '' })
                      setError('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isDisabling || disableForm.token.length !== 6}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isDisabling ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Desativando...
                      </span>
                    ) : (
                      'Desativar 2FA'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Setup Component */}
      {showSetup && !twoFactorStatus.enabled && (
        <TwoFactorSetup 
          onComplete={() => {
            setShowSetup(false)
            fetchTwoFactorStatus()
          }}
        />
      )}

      {/* Additional Security Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
          Dicas de Segurança
        </h3>
        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Use uma senha forte e única para sua conta</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Ative a autenticação de dois fatores para proteção extra</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Mantenha seus códigos de backup em um local seguro</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Nunca compartilhe sua senha ou códigos de autenticação</span>
          </li>
        </ul>
      </div>
    </div>
  )
}