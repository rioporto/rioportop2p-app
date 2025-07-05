import { NextRequest } from 'next/server'
import { stackServerApp } from '@/lib/stack-auth'

export interface AuthUser {
  id: string
  email?: string
  emailVerified?: boolean
  displayName?: string
}

/**
 * Get authenticated user from request
 */
export async function getUserFromToken(req: NextRequest): Promise<AuthUser | null> {
  try {
    const user = await stackServerApp.getUser()
    
    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.primaryEmail ?? undefined,
      emailVerified: user.primaryEmailVerified,
      displayName: user.displayName ?? undefined
    }
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

/**
 * Verify if user has a specific role
 */
export async function userHasRole(userId: string, role: string): Promise<boolean> {
  try {
    // TODO: Implement role checking with Stack Auth or database
    // For now, return false
    return false
  } catch (error) {
    console.error('Error checking user role:', error)
    return false
  }
}

/**
 * Require authentication middleware
 */
export async function requireAuth(req: NextRequest): Promise<AuthUser> {
  const user = await getUserFromToken(req)
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}