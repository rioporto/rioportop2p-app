export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: {
          id: string
          email: string
          full_name: string | null
          cpf: string | null
          phone: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'moderator'
          kyc_level: 'basic' | 'intermediate' | 'complete'
          kyc_verified_at: string | null
          reputation_score: number
          total_trades: number
          volume_traded: number
          is_online: boolean
          last_seen_at: string
          preferred_payment_methods: ('PIX' | 'TED' | 'bank_transfer' | 'cash')[]
          notification_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          cpf?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          kyc_level?: 'basic' | 'intermediate' | 'complete'
          kyc_verified_at?: string | null
          reputation_score?: number
          total_trades?: number
          volume_traded?: number
          is_online?: boolean
          last_seen_at?: string
          preferred_payment_methods?: ('PIX' | 'TED' | 'bank_transfer' | 'cash')[]
          notification_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          cpf?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          kyc_level?: 'basic' | 'intermediate' | 'complete'
          kyc_verified_at?: string | null
          reputation_score?: number
          total_trades?: number
          volume_traded?: number
          is_online?: boolean
          last_seen_at?: string
          preferred_payment_methods?: ('PIX' | 'TED' | 'bank_transfer' | 'cash')[]
          notification_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      kyc_documents: {
        Row: {
          id: string
          user_id: string
          document_type: string
          document_url: string
          document_number: string | null
          issue_date: string | null
          expiry_date: string | null
          status: 'pending' | 'approved' | 'rejected' | 'expired'
          verified_by: string | null
          verified_at: string | null
          rejection_reason: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_type: string
          document_url: string
          document_number?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'expired'
          verified_by?: string | null
          verified_at?: string | null
          rejection_reason?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_type?: string
          document_url?: string
          document_number?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'expired'
          verified_by?: string | null
          verified_at?: string | null
          rejection_reason?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      cryptocurrencies: {
        Row: {
          id: string
          symbol: string
          name: string
          logo_url: string | null
          min_amount: number
          max_amount: number
          is_active: boolean
          network: string | null
          contract_address: string | null
          decimals: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          logo_url?: string | null
          min_amount: number
          max_amount: number
          is_active?: boolean
          network?: string | null
          contract_address?: string | null
          decimals?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          logo_url?: string | null
          min_amount?: number
          max_amount?: number
          is_active?: boolean
          network?: string | null
          contract_address?: string | null
          decimals?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          type: 'buy' | 'sell'
          crypto_id: string
          crypto_amount: number
          fiat_amount: number
          price_per_unit: number
          min_limit: number | null
          max_limit: number | null
          payment_methods: ('PIX' | 'TED' | 'bank_transfer' | 'cash')[]
          payment_time_limit: number
          terms: string | null
          status: 'open' | 'matched' | 'completed' | 'cancelled' | 'expired'
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'buy' | 'sell'
          crypto_id: string
          crypto_amount: number
          fiat_amount: number
          price_per_unit: number
          min_limit?: number | null
          max_limit?: number | null
          payment_methods: ('PIX' | 'TED' | 'bank_transfer' | 'cash')[]
          payment_time_limit?: number
          terms?: string | null
          status?: 'open' | 'matched' | 'completed' | 'cancelled' | 'expired'
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'buy' | 'sell'
          crypto_id?: string
          crypto_amount?: number
          fiat_amount?: number
          price_per_unit?: number
          min_limit?: number | null
          max_limit?: number | null
          payment_methods?: ('PIX' | 'TED' | 'bank_transfer' | 'cash')[]
          payment_time_limit?: number
          terms?: string | null
          status?: 'open' | 'matched' | 'completed' | 'cancelled' | 'expired'
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          order_id: string | null
          buyer_id: string
          seller_id: string
          crypto_id: string
          type: 'buy' | 'sell'
          crypto_amount: number
          fiat_amount: number
          price_per_unit: number
          fee_amount: number
          fee_percentage: number
          total_amount: number
          payment_method: 'PIX' | 'TED' | 'bank_transfer' | 'cash'
          status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
          payment_proof_url: string | null
          payment_confirmed_at: string | null
          crypto_tx_hash: string | null
          crypto_released_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          cancellation_reason: string | null
          dispute_id: string | null
          rating_buyer: number | null
          rating_seller: number | null
          feedback_buyer: string | null
          feedback_seller: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          buyer_id: string
          seller_id: string
          crypto_id: string
          type: 'buy' | 'sell'
          crypto_amount: number
          fiat_amount: number
          price_per_unit: number
          fee_amount: number
          fee_percentage: number
          total_amount: number
          payment_method: 'PIX' | 'TED' | 'bank_transfer' | 'cash'
          status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
          payment_proof_url?: string | null
          payment_confirmed_at?: string | null
          crypto_tx_hash?: string | null
          crypto_released_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          cancellation_reason?: string | null
          dispute_id?: string | null
          rating_buyer?: number | null
          rating_seller?: number | null
          feedback_buyer?: string | null
          feedback_seller?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          buyer_id?: string
          seller_id?: string
          crypto_id?: string
          type?: 'buy' | 'sell'
          crypto_amount?: number
          fiat_amount?: number
          price_per_unit?: number
          fee_amount?: number
          fee_percentage?: number
          total_amount?: number
          payment_method?: 'PIX' | 'TED' | 'bank_transfer' | 'cash'
          status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
          payment_proof_url?: string | null
          payment_confirmed_at?: string | null
          crypto_tx_hash?: string | null
          crypto_released_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          cancellation_reason?: string | null
          dispute_id?: string | null
          rating_buyer?: number | null
          rating_seller?: number | null
          feedback_buyer?: string | null
          feedback_seller?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          transaction_id: string
          sender_id: string
          receiver_id: string
          message: string
          attachment_url: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          sender_id: string
          receiver_id: string
          message: string
          attachment_url?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          sender_id?: string
          receiver_id?: string
          message?: string
          attachment_url?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      price_history: {
        Row: {
          id: string
          crypto_id: string
          price_brl: number
          price_usd: number | null
          volume_24h: number | null
          change_24h: number | null
          market_cap: number | null
          source: string
          recorded_at: string
        }
        Insert: {
          id?: string
          crypto_id: string
          price_brl: number
          price_usd?: number | null
          volume_24h?: number | null
          change_24h?: number | null
          market_cap?: number | null
          source?: string
          recorded_at?: string
        }
        Update: {
          id?: string
          crypto_id?: string
          price_brl?: number
          price_usd?: number | null
          volume_24h?: number | null
          change_24h?: number | null
          market_cap?: number | null
          source?: string
          recorded_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string | null
          old_value: Json | null
          new_value: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          old_value?: Json | null
          new_value?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_value?: Json | null
          new_value?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      transaction_status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
      transaction_type: 'buy' | 'sell'
      payment_method: 'PIX' | 'TED' | 'bank_transfer' | 'cash'
      kyc_status: 'pending' | 'approved' | 'rejected' | 'expired'
      kyc_level: 'basic' | 'intermediate' | 'complete'
      order_status: 'open' | 'matched' | 'completed' | 'cancelled' | 'expired'
      user_role: 'user' | 'admin' | 'moderator'
    }
  }
}