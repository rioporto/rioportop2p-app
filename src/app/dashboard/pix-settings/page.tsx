'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Key, AlertCircle, Info } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PixKeyManager from '@/components/pix/PixKeyManager'

export default function PixSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', user.id)
        .single()

      setUserProfile(profile)
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard" className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configurações PIX
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                Sobre as Chaves PIX
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                As chaves PIX cadastradas aqui serão usadas para receber pagamentos quando você vender criptomoedas. 
                Certifique-se de que as informações estejam corretas para evitar problemas nas transações.
              </p>
            </div>
          </div>
        </div>

        {/* KYC Warning if not verified */}
        {userProfile && userProfile.kyc_level !== 'complete' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                  Verificação Necessária
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
                  Para usar todas as funcionalidades do PIX, complete sua verificação KYC.
                </p>
                <Link
                  href="/kyc"
                  className="inline-flex items-center px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800/30 dark:hover:bg-yellow-800/40 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Completar Verificação
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* PIX Key Manager */}
        <PixKeyManager />

        {/* Important Notes */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Informações Importantes
            </h3>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Tipos de Chave PIX:</strong>
              <ul className="mt-1 ml-4 list-disc">
                <li>CPF: Use apenas seu próprio CPF</li>
                <li>CNPJ: Para contas empresariais</li>
                <li>E-mail: Deve ser um e-mail válido cadastrado no banco</li>
                <li>Telefone: Número com DDD, sem espaços ou caracteres especiais</li>
                <li>Chave Aleatória: Gerada pelo banco, geralmente com 32 caracteres</li>
              </ul>
            </div>
            
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Segurança:</strong>
              <ul className="mt-1 ml-4 list-disc">
                <li>Nunca compartilhe suas chaves PIX fora da plataforma</li>
                <li>Verifique sempre os dados antes de confirmar uma transação</li>
                <li>Use apenas chaves PIX de contas em seu nome</li>
                <li>Mantenha suas chaves atualizadas</li>
              </ul>
            </div>
            
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Verificação:</strong>
              <p className="mt-1">
                Chaves PIX marcadas como "Verificadas" passaram por nossa validação. 
                Isso aumenta a confiança dos compradores e pode resultar em transações mais rápidas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}