import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create a dummy client for build time when env vars are not available
const createSupabaseClient = () => {
  // Check if we're using placeholder values
  const isPlaceholder = supabaseUrl === 'https://placeholder.supabase.co' || 
                       supabaseUrl === 'your-supabase-url' ||
                       !supabaseUrl.includes('supabase.co')
  
  if (isPlaceholder) {
    console.warn('Supabase environment variables not properly configured. Using placeholder client.')
    // Return a mock client that won't throw errors during build
    return {
      auth: {
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: new Error('Supabase not configured') }),
        getUser: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
        getSession: async () => ({ data: { session: null }, error: new Error('Supabase not configured') }),
      },
      from: () => ({
        select: () => ({ data: null, error: new Error('Supabase not configured') }),
        insert: () => ({ data: null, error: new Error('Supabase not configured') }),
        update: () => ({ data: null, error: new Error('Supabase not configured') }),
        delete: () => ({ data: null, error: new Error('Supabase not configured') }),
      })
    } as any
  }
  
  try {
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null as any
  }
}

export const supabase = createSupabaseClient()

// Auth helper functions
export const signUp = async (email: string, password: string, metadata?: any) => {
  if (!supabase?.auth?.signUp) {
    return { data: null, error: new Error('Supabase not configured') }
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  if (!supabase?.auth?.signInWithPassword) {
    return { data: null, error: new Error('Supabase not configured') }
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase?.auth?.signOut) {
    return { error: new Error('Supabase not configured') }
  }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getUser = async () => {
  if (!supabase?.auth?.getUser) {
    return { user: null, error: new Error('Supabase not configured') }
  }
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  if (!supabase?.auth?.getSession) {
    return { session: null, error: new Error('Supabase not configured') }
  }
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}