import { StackClient, StackServerApp } from '@stackframe/stack'

// Client-side configuration
const createStackClient = () => {
  const appId = process.env.NEXT_PUBLIC_STACK_APP_ID
  const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
  
  if (!appId || !publishableClientKey) {
    console.warn('Stack Auth environment variables not found. Using placeholder client.')
    return null as any
  }
  
  return new StackClient({
    appId,
    publishableClientKey,
    baseUrl: process.env.NEXT_PUBLIC_STACK_BASE_URL || 'https://app.stack-auth.com',
  })
}

export const stackClient = createStackClient()

// Server-side configuration
const createStackServerApp = () => {
  const appId = process.env.NEXT_PUBLIC_STACK_APP_ID
  const secretServerKey = process.env.STACK_SECRET_SERVER_KEY
  
  if (!appId || !secretServerKey) {
    console.warn('Stack Auth server environment variables not found.')
    return null as any
  }
  
  return new StackServerApp({
    appId,
    secretServerKey,
    baseUrl: process.env.NEXT_PUBLIC_STACK_BASE_URL || 'https://app.stack-auth.com',
  })
}

export const stackServerApp = createStackServerApp()