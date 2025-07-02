'use client'

import { StackProvider } from '@stackframe/stack'
import { stackClient } from '@/lib/stack-auth'
import { useEffect } from 'react'

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hide any default Stack UI elements
    const hideStackUI = () => {
      // Hide UserButton if it exists
      const stackButtons = document.querySelectorAll('[data-stack-component="UserButton"], [class*="stack-user-button"]')
      stackButtons.forEach(button => {
        (button as HTMLElement).style.display = 'none'
      })
      
      // Hide any duplicate theme toggles
      const themeButtons = document.querySelectorAll('[aria-label="Toggle theme"]')
      if (themeButtons.length > 1) {
        // Keep only the first one (our custom one)
        for (let i = 1; i < themeButtons.length; i++) {
          (themeButtons[i] as HTMLElement).style.display = 'none'
        }
      }
    }
    
    // Run immediately and on DOM changes
    hideStackUI()
    const observer = new MutationObserver(hideStackUI)
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => observer.disconnect()
  }, [])
  
  if (!stackClient) {
    // If Stack Auth is not configured, just render children without provider
    return <>{children}</>
  }
  
  return (
    <StackProvider app={stackClient}>
      {children}
    </StackProvider>
  )
}