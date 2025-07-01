import { StackClientApp, StackServerApp } from '@stackframe/stack'

// Client-side configuration
const createStackClient = () => {
  const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
  const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
  
  if (!projectId || !publishableClientKey) {
    console.warn('Stack Auth environment variables not found. Using placeholder client.')
    return null as any
  }
  
  return new StackClientApp({
    projectId,
    publishableClientKey,
    baseUrl: process.env.NEXT_PUBLIC_STACK_BASE_URL || 'https://app.stack-auth.com',
    tokenStore: 'cookie', // Use cookie-based token storage
  })
}

export const stackClient = createStackClient()

// Server-side configuration
const createStackServerApp = () => {
  const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
  const secretServerKey = process.env.STACK_SECRET_SERVER_KEY
  
  if (!projectId || !secretServerKey) {
    console.warn('Stack Auth server environment variables not found.')
    return null as any
  }
  
  return new StackServerApp({
    projectId,
    secretServerKey,
    baseUrl: process.env.NEXT_PUBLIC_STACK_BASE_URL || 'https://app.stack-auth.com',
  } as any)
}

export const stackServerApp = createStackServerApp()