'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { Mail, CheckCircle, Bitcoin } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-lg blur-md opacity-30"></div>
              <Bitcoin className="h-12 w-12 text-orange-500 relative" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Rio Porto P2P
            </span>
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-slate-700/50 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Verifique seu email!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enviamos um link de verificação para:
            </p>
            
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 mb-6">
              <p className="font-medium text-gray-900 dark:text-white flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                {email || 'seu email'}
              </p>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Clique no link enviado para verificar sua conta e começar a usar a plataforma.
            </p>
            
            <div className="space-y-4">
              <Link
                href="/login"
                className="block w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                Ir para Login
              </Link>
              
              <button
                type="button"
                className="block w-full py-3 px-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                Reenviar email
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Não recebeu o email? Verifique sua pasta de spam ou{' '}
          <Link href="/contact" className="font-medium text-orange-600 hover:text-orange-500">
            entre em contato
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}