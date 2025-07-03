'use client'

import { useState } from 'react'
import { Shield, Loader2, AlertCircle, Copy, Check, Smartphone, Key } from 'lucide-react'
import { useNotification } from '@/contexts/NotificationContext'

interface TwoFactorSetupProps {
  onComplete?: () => void
}

export default function TwoFactorSetup({ onComplete }: TwoFactorSetupProps) {
  const { addNotification } = useNotification()
  const [step, setStep] = useState<'initial' | 'qrcode' | 'verify' | 'backup'>('initial')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [token, setToken] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copiedSecret, setCopiedSecret] = useState(false)

  const handleSetupStart = async () => {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao configurar 2FA')
      }

      setQrCode(data.qrCode)
      setSecret(data.secret)
      setStep('qrcode')
    } catch (err: any) {
      setError(err.message || 'Erro ao configurar 2FA')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action: 'setup' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar código')
      }

      // Generate backup codes
      const backupResponse = await fetch('/api/auth/2fa/backup-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const backupData = await backupResponse.json()

      if (backupResponse.ok) {
        setBackupCodes(backupData.backupCodes)
        setStep('backup')
      } else {
        addNotification({
          type: 'success',
          title: '2FA Ativado!',
          message: 'Autenticação de dois fatores foi ativada com sucesso',
          duration: 5000
        })
        onComplete?.()
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar código')
    } finally {
      setIsLoading(false)
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    setCopiedSecret(true)
    setTimeout(() => setCopiedSecret(false), 2000)
    addNotification({
      type: 'success',
      title: 'Copiado!',
      message: 'Chave secreta copiada para a área de transferência',
      duration: 2000
    })
  }

  const downloadBackupCodes = () => {
    const content = `Códigos de Backup - RioPorto P2P
=====================================
Guarde estes códigos em um local seguro.
Cada código pode ser usado apenas uma vez.

${backupCodes.join('\n')}

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
  }

  return (
    <div className="max-w-2xl mx-auto">
      {step === 'initial' && (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Configurar Autenticação de Dois Fatores
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Adicione uma camada extra de segurança à sua conta
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                O que você precisará:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>Um smartphone com aplicativo autenticador instalado</li>
                <li>Alguns minutos para configurar</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Aplicativos compatíveis:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div>• Google Authenticator</div>
                <div>• Microsoft Authenticator</div>
                <div>• Authy</div>
                <div>• 1Password</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSetupStart}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Configurando...
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4" />
                Começar Configuração
              </>
            )}
          </button>
        </div>
      )}

      {step === 'qrcode' && (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 p-8 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Escaneie o QR Code
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Use seu aplicativo autenticador para escanear este código
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex justify-center">
            {qrCode && (
              <div className="bg-white p-4 rounded-lg shadow-inner">
                <img src={qrCode} alt="QR Code para 2FA" className="w-64 h-64" />
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Não consegue escanear? Digite manualmente:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white dark:bg-gray-700 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-xs font-mono break-all">
                {secret}
              </code>
              <button
                onClick={copySecret}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {copiedSecret ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Digite o código de 6 dígitos do aplicativo
              </label>
              <input
                id="token"
                name="token"
                type="text"
                autoComplete="one-time-code"
                required
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || token.length !== 6}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar e Ativar 2FA'
              )}
            </button>
          </form>
        </div>
      )}

      {step === 'backup' && (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <Key className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Códigos de Backup
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Guarde estes códigos em um local seguro. Você pode usá-los para acessar sua conta se perder o acesso ao seu aplicativo autenticador.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                <p className="font-medium mb-1">Importante:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cada código pode ser usado apenas uma vez</li>
                  <li>Guarde em um local seguro (não no computador)</li>
                  <li>Não compartilhe com ninguém</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm bg-white dark:bg-gray-700 px-3 py-2 rounded border border-gray-300 dark:border-gray-600">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadBackupCodes}
              className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Baixar Códigos
            </button>
            <button
              onClick={() => {
                addNotification({
                  type: 'success',
                  title: '2FA Ativado!',
                  message: 'Autenticação de dois fatores foi ativada com sucesso',
                  duration: 5000
                })
                onComplete?.()
              }}
              className="flex-1 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
            >
              Concluir Configuração
            </button>
          </div>
        </div>
      )}
    </div>
  )
}