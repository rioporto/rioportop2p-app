import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client for browser (uses anon key)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Client for server with service role (only use server-side)
export const createServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Typed helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Common queries
export const queries = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  // Get user's transactions
  getUserTransactions: async (userId: string, limit = 10) => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        buyer:buyer_id(id, full_name, avatar_url),
        seller:seller_id(id, full_name, avatar_url),
        crypto:crypto_id(symbol, name, logo_url)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    return { data, error }
  },

  // Get open orders
  getOpenOrders: async (type?: 'buy' | 'sell', cryptoId?: string) => {
    let query = supabase
      .from('orders')
      .select(`
        *,
        user:user_id(id, full_name, avatar_url, reputation_score, total_trades),
        crypto:crypto_id(symbol, name, logo_url)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
    
    if (type) query = query.eq('type', type)
    if (cryptoId) query = query.eq('crypto_id', cryptoId)
    
    const { data, error } = await query
    return { data, error }
  },

  // Get crypto prices
  getCryptoPrices: async () => {
    const { data, error } = await supabase
      .from('cryptocurrencies')
      .select(`
        *,
        latest_price:price_history(price_brl, change_24h, volume_24h)
      `)
      .eq('is_active', true)
      .order('latest_price.recorded_at', { ascending: false })
      .limit(1, { foreignTable: 'price_history' })
    
    return { data, error }
  },

  // Get unread notifications count
  getUnreadNotificationsCount: async (userId: string) => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    
    return { count, error }
  }
}

// Realtime subscriptions
export const subscriptions = {
  // Subscribe to chat messages for a transaction
  subscribeToChatMessages: (transactionId: string, callback: (message: Tables<'chat_messages'>) => void) => {
    return supabase
      .channel(`chat:${transactionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `transaction_id=eq.${transactionId}`
        },
        (payload) => callback(payload.new as Tables<'chat_messages'>)
      )
      .subscribe()
  },

  // Subscribe to transaction status updates
  subscribeToTransactionUpdates: (transactionId: string, callback: (transaction: Tables<'transactions'>) => void) => {
    return supabase
      .channel(`transaction:${transactionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transactions',
          filter: `id=eq.${transactionId}`
        },
        (payload) => callback(payload.new as Tables<'transactions'>)
      )
      .subscribe()
  },

  // Subscribe to new notifications
  subscribeToNotifications: (userId: string, callback: (notification: Tables<'notifications'>) => void) => {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback(payload.new as Tables<'notifications'>)
      )
      .subscribe()
  }
}