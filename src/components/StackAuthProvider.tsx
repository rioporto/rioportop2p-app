'use client'

import { StackProvider } from '@stackframe/stack'
import { stackClient } from '@/lib/stack-auth'

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackClient}>
      {children}
    </StackProvider>
  )
}