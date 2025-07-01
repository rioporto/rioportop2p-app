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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          kyc_level: number
          kyc_verified_at: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          kyc_level?: number
          kyc_verified_at?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          kyc_level?: number
          kyc_verified_at?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'buy' | 'sell' | 'exchange'
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          from_currency: string
          to_currency: string
          from_amount: number
          to_amount: number
          exchange_rate: number
          fee_amount: number | null
          payment_method: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'buy' | 'sell' | 'exchange'
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          from_currency: string
          to_currency: string
          from_amount: number
          to_amount: number
          exchange_rate: number
          fee_amount?: number | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'buy' | 'sell' | 'exchange'
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          from_currency?: string
          to_currency?: string
          from_amount?: number
          to_amount?: number
          exchange_rate?: number
          fee_amount?: number | null
          payment_method?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          content: string
          price: number
          duration_hours: number
          level: 'beginner' | 'intermediate' | 'advanced'
          category: string
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          instructor_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          content: string
          price?: number
          duration_hours?: number
          level?: 'beginner' | 'intermediate' | 'advanced'
          category: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          instructor_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          content?: string
          price?: number
          duration_hours?: number
          level?: 'beginner' | 'intermediate' | 'advanced'
          category?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          instructor_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          author_id: string
          author_name: string
          category: string
          tags: string[] | null
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          published_at: string | null
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          author_id: string
          author_name: string
          category: string
          tags?: string[] | null
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          published_at?: string | null
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          author_id?: string
          author_name?: string
          category?: string
          tags?: string[] | null
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          published_at?: string | null
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          category: string
          order: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category: string
          order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string
          order?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          status: 'enrolled' | 'in_progress' | 'completed'
          progress_percentage: number
          enrolled_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          status?: 'enrolled' | 'in_progress' | 'completed'
          progress_percentage?: number
          enrolled_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          status?: 'enrolled' | 'in_progress' | 'completed'
          progress_percentage?: number
          enrolled_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
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
      kyc_level: 1 | 2 | 3
      transaction_type: 'buy' | 'sell' | 'exchange'
      transaction_status: 'pending' | 'processing' | 'completed' | 'cancelled'
      course_level: 'beginner' | 'intermediate' | 'advanced'
      enrollment_status: 'enrolled' | 'in_progress' | 'completed'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]