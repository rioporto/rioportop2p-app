import { StackClient, StackServerApp } from '@stackframe/stack'

// Client-side configuration
export const stackClient = new StackClient({
  appId: process.env.NEXT_PUBLIC_STACK_APP_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_STACK_BASE_URL || 'https://app.stack-auth.com',
})

// Server-side configuration
export const stackServerApp = new StackServerApp({
  appId: process.env.NEXT_PUBLIC_STACK_APP_ID!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_STACK_BASE_URL || 'https://app.stack-auth.com',
})