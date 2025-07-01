import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function RootLayout() {
  useEffect(() => {
    // Aplicar dark mode por padrão
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}