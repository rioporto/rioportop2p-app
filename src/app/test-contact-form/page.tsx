'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TestContactFormPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to contact page immediately
    router.push('/contato')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Redirecionando...</h1>
        <p className="text-gray-600">Você será redirecionado para a página de contato</p>
      </div>
    </div>
  )
}