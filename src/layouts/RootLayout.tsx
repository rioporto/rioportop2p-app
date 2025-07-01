import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'

export default function RootLayout() {
  useEffect(() => {
    // Aplicar dark mode por padrão
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}