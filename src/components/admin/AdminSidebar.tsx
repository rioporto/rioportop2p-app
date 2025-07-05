'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  GraduationCap, 
  BookOpen, 
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronRight,
  Bitcoin,
  FileCheck,
  TrendingUp,
  Bell,
  Shield,
  Key
} from 'lucide-react'

interface MenuItem {
  name: string
  href?: string
  icon: any
  submenu?: { name: string; href: string }[]
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { 
    name: 'Usuários', 
    icon: Users,
    submenu: [
      { name: 'Listar Usuários', href: '/admin/usuarios' },
      { name: 'KYC Pendentes', href: '/admin/usuarios/kyc' },
      { name: 'Verificações', href: '/admin/usuarios/verificacoes' }
    ]
  },
  { 
    name: 'Transações', 
    icon: ArrowLeftRight,
    submenu: [
      { name: 'Todas Transações', href: '/admin/transacoes' },
      { name: 'Disputas', href: '/admin/transacoes/disputas' },
      { name: 'Relatórios', href: '/admin/transacoes/relatorios' }
    ]
  },
  {
    name: 'Conteúdo',
    icon: BookOpen,
    submenu: [
      { name: 'Blog', href: '/admin/blog' },
      { name: 'Cursos', href: '/admin/cursos' },
      { name: 'FAQ', href: '/admin/faq' }
    ]
  },
  {
    name: 'Financeiro',
    icon: TrendingUp,
    submenu: [
      { name: 'Cotações', href: '/admin/cotacoes' },
      { name: 'Taxas', href: '/admin/taxas' },
      { name: 'Faturamento', href: '/admin/faturamento' },
      { name: 'Chaves PIX', href: '/admin/pix-keys' },
      { name: 'Pagamentos PIX', href: '/admin/pix-payments' }
    ]
  },
  { name: 'Notificações', href: '/admin/notificacoes', icon: Bell },
  { name: 'Segurança', href: '/admin/seguranca', icon: Shield },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => pathname === href
  const isParentActive = (submenu?: { href: string }[]) => {
    return submenu?.some(item => pathname.startsWith(item.href)) || false
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg lg:static lg:inset-0">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <Bitcoin className="w-8 h-8 mr-2" />
          <span className="text-xl font-bold">Admin P2P</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isExpanded = expandedItems.includes(item.name)
            const isItemActive = item.href ? isActive(item.href) : isParentActive(item.submenu)

            return (
              <div key={item.name}>
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                        isItemActive
                          ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded && item.submenu && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                              isActive(subitem.href)
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isItemActive
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <span className="text-orange-600 dark:text-orange-400 font-semibold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Administrador</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Acesso total</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}