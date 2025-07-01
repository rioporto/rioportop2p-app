'use client'

import { StackProvider } from '@stackframe/stack'
import { stackClient } from '@/lib/stack-auth'

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
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