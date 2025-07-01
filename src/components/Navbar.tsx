import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bitcoin, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const location = useLocation()

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const navItems = [
    { name: 'Início', path: '/' },
    { name: 'Cotação P2P', path: '/cotacao' },
    { name: 'OTC', path: '/otc' },
    { name: 'KYC', path: '/kyc' },
    { name: 'Blog', path: '/blog' },
    { name: 'Cursos', path: '/cursos' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Rio Porto P2P</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button variant="default" className="hidden md:flex">
              Entrar
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-sm text-muted-foreground">Tema</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
              >
                {isDark ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Claro
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Escuro
                  </>
                )}
              </Button>
            </div>
            <Button variant="default" className="w-full">
              Entrar
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

