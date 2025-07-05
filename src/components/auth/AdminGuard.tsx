'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        router.push('/login?redirect=/admin')
        return
      }

      try {
        const { data, error } = await supabase
          .from('users_profile')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        if (error || !data?.is_admin) {
          // Não é admin, redirecionar para dashboard
          router.push('/dashboard?error=unauthorized')
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error('Error checking admin status:', error)
        router.push('/dashboard?error=unauthorized')
      } finally {
        setCheckingAdmin(false)
      }
    }

    if (!loading) {
      checkAdminStatus()
    }
  }, [user, loading, router])

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}