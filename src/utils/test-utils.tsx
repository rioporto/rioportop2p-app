import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { NotificationProvider } from '@/contexts/NotificationContext'

// Mock providers that wrap the app
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }