'use client'

import { ReactNode } from 'react'
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react'

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function Alert({
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = ''
}: AlertProps) {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle
  }
  
  const styles = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-900 dark:text-blue-300',
      content: 'text-blue-800 dark:text-blue-400'
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-900 dark:text-green-300',
      content: 'text-green-800 dark:text-green-400'
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      title: 'text-yellow-900 dark:text-yellow-300',
      content: 'text-yellow-800 dark:text-yellow-400'
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-900 dark:text-red-300',
      content: 'text-red-800 dark:text-red-400'
    }
  }
  
  const Icon = icons[type]
  const style = styles[type]
  
  return (
    <div className={`rounded-lg border p-4 ${style.container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${style.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${style.title} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${style.content}`}>
            {children}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'error' ? 'focus:ring-red-500' : 
                type === 'success' ? 'focus:ring-green-500' :
                type === 'warning' ? 'focus:ring-yellow-500' :
                'focus:ring-blue-500'
              }`}
            >
              <X className={`h-4 w-4 ${style.icon}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}