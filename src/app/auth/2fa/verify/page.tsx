'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Loader2, AlertCircle, Smartphone } from 'lucide-react'
import { useNotification } from '@/contexts/NotificationContext'

function TwoFactorVerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToastNotification } = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const userId = searchParams.get('userId')

  useEffect(() => {
    if (!userId) {
      router.push('/login')
    }
  }, [userId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/2fa/complete-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar código')
      }

      addToastNotification({
        type: 'success',
        title: 'Login realizado!',
        message: 'Autenticação de dois fatores verificada com sucesso',
        duration: 3000
      })

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar código')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <Shield className="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Verificação de Dois Fatores
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Digite o código de 6 dígitos do seu aplicativo autenticador
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 p-8 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código de Autenticação
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
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Digite o código de 6 dígitos gerado pelo seu aplicativo
              </p>
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
                'Verificar Código'
              )}
            </button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Problemas com o código?
              </p>
              <button
                type="button"
                className="text-sm font-medium text-orange-600 hover:text-orange-500"
                onClick={() => {
                  addToastNotification({
                    type: 'info',
                    title: 'Use um código de backup',
                    message: 'Se você salvou seus códigos de backup, pode usar um deles no lugar do código do aplicativo',
                    duration: 5000
                  })
                }}
              >
                Usar código de backup
              </button>
            </div>
          </div>
        </form>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Aplicativos compatíveis:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                <li>Google Authenticator</li>
                <li>Microsoft Authenticator</li>
                <li>Authy</li>
                <li>1Password</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TwoFactorVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    }>
      <TwoFactorVerifyContent />
    </Suspense>
  )
}