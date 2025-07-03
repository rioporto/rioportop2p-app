// Extended database types including blog, courses, KYC, and admin tables
import { Database as BaseDatabase } from './database'

export interface ExtendedDatabase extends BaseDatabase {
  public: BaseDatabase['public'] & {
    Tables: BaseDatabase['public']['Tables'] & {
      // Blog tables
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          icon_url: string | null
          color: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          icon_url?: string | null
          color?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          icon_url?: string | null
          color?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string
          featured_image: string | null
          thumbnail_image: string | null
          author_id: string
          category_id: string | null
          status: 'draft' | 'published' | 'scheduled' | 'archived'
          published_at: string | null
          scheduled_for: string | null
          views: number
          likes: number
          reading_time: number | null
          is_featured: boolean
          allow_comments: boolean
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string | null
          content: string
          featured_image?: string | null
          thumbnail_image?: string | null
          author_id: string
          category_id?: string | null
          status?: 'draft' | 'published' | 'scheduled' | 'archived'
          published_at?: string | null
          scheduled_for?: string | null
          views?: number
          likes?: number
          reading_time?: number | null
          is_featured?: boolean
          allow_comments?: boolean
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['blog_posts']['Insert']>
      }
      blog_tags: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['blog_tags']['Insert']>
      }
      blog_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          parent_id: string | null
          content: string
          status: 'pending' | 'approved' | 'rejected' | 'spam'
          is_edited: boolean
          edited_at: string | null
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          parent_id?: string | null
          content: string
          status?: 'pending' | 'approved' | 'rejected' | 'spam'
          is_edited?: boolean
          edited_at?: string | null
          likes?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['blog_comments']['Insert']>
      }
      // Courses tables
      courses: {
        Row: {
          id: string
          slug: string
          title: string
          subtitle: string | null
          description: string
          instructor_id: string
          category: string
          level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          duration_hours: number | null
          price: number
          currency: string
          thumbnail_url: string | null
          preview_video_url: string | null
          status: 'draft' | 'published' | 'archived'
          is_featured: boolean
          is_free: boolean
          max_students: number | null
          prerequisites: string[] | null
          learning_outcomes: string[] | null
          target_audience: string | null
          certificate_available: boolean
          rating_average: number
          rating_count: number
          enrolled_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          subtitle?: string | null
          description: string
          instructor_id: string
          category: string
          level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
          duration_hours?: number | null
          price?: number
          currency?: string
          thumbnail_url?: string | null
          preview_video_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          is_free?: boolean
          max_students?: number | null
          prerequisites?: string[] | null
          learning_outcomes?: string[] | null
          target_audience?: string | null
          certificate_available?: boolean
          rating_average?: number
          rating_count?: number
          enrolled_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['courses']['Insert']>
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          order_index: number
          duration_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          order_index: number
          duration_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['course_modules']['Insert']>
      }
      course_lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          video_url: string | null
          video_duration_seconds: number | null
          content: string | null
          attachments: Json | null
          duration_minutes: number
          order_index: number
          is_free: boolean
          quiz_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          video_url?: string | null
          video_duration_seconds?: number | null
          content?: string | null
          attachments?: Json | null
          duration_minutes: number
          order_index: number
          is_free?: boolean
          quiz_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['course_lessons']['Insert']>
      }
      course_enrollments: {
        Row: {
          id: string
          course_id: string
          user_id: string
          status: 'active' | 'completed' | 'cancelled' | 'expired'
          progress_percentage: number
          last_accessed_at: string | null
          enrolled_at: string
          started_at: string | null
          completed_at: string | null
          expires_at: string | null
          certificate_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          user_id: string
          status?: 'active' | 'completed' | 'cancelled' | 'expired'
          progress_percentage?: number
          last_accessed_at?: string | null
          enrolled_at?: string
          started_at?: string | null
          completed_at?: string | null
          expires_at?: string | null
          certificate_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['course_enrollments']['Insert']>
      }
      // KYC tables
      kyc_verifications: {
        Row: {
          id: string
          user_id: string
          verification_type: string
          status: 'pending' | 'processing' | 'approved' | 'rejected' | 'expired' | 'manual_review'
          provider: string | null
          provider_request_id: string | null
          provider_response: Json | null
          score: number | null
          verified_data: Json | null
          expires_at: string | null
          verified_by: string | null
          rejection_reason: string | null
          attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          verification_type: string
          status?: 'pending' | 'processing' | 'approved' | 'rejected' | 'expired' | 'manual_review'
          provider?: string | null
          provider_request_id?: string | null
          provider_response?: Json | null
          score?: number | null
          verified_data?: Json | null
          expires_at?: string | null
          verified_by?: string | null
          rejection_reason?: string | null
          attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['kyc_verifications']['Insert']>
      }
      kyc_cpf_verifications: {
        Row: {
          id: string
          user_id: string
          cpf: string
          cpf_normalized: string
          full_name: string | null
          birth_date: string | null
          mother_name: string | null
          status: 'pending' | 'processing' | 'approved' | 'rejected' | 'expired' | 'manual_review'
          situation: string | null
          provider: string | null
          provider_response: Json | null
          last_checked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cpf: string
          cpf_normalized: string
          full_name?: string | null
          birth_date?: string | null
          mother_name?: string | null
          status?: 'pending' | 'processing' | 'approved' | 'rejected' | 'expired' | 'manual_review'
          situation?: string | null
          provider?: string | null
          provider_response?: Json | null
          last_checked_at?: string | null
          created_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['kyc_cpf_verifications']['Insert']>
      }
      // Admin tables
      admin_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          category: string | null
          is_public: boolean
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          category?: string | null
          is_public?: boolean
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['admin_settings']['Insert']>
      }
      faq_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          order_index: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['faq_categories']['Insert']>
      }
      faq_items: {
        Row: {
          id: string
          category_id: string | null
          question: string
          answer: string
          slug: string
          tags: string[] | null
          views: number
          helpful_yes: number
          helpful_no: number
          is_featured: boolean
          is_active: boolean
          order_index: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          question: string
          answer: string
          slug: string
          tags?: string[] | null
          views?: number
          helpful_yes?: number
          helpful_no?: number
          is_featured?: boolean
          is_active?: boolean
          order_index?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['faq_items']['Insert']>
      }
      support_tickets: {
        Row: {
          id: string
          ticket_number: string
          user_id: string | null
          category: string
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed'
          subject: string
          description: string
          assigned_to: string | null
          resolved_at: string | null
          closed_at: string | null
          satisfaction_rating: number | null
          tags: string[] | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ticket_number?: string
          user_id?: string | null
          category: string
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed'
          subject: string
          description: string
          assigned_to?: string | null
          resolved_at?: string | null
          closed_at?: string | null
          satisfaction_rating?: number | null
          tags?: string[] | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ExtendedDatabase['public']['Tables']['support_tickets']['Insert']>
      }
    }
    Views: BaseDatabase['public']['Views'] & {
      blog_posts_published: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string
          featured_image: string | null
          author_id: string
          author_name: string
          author_avatar: string | null
          author_role: string
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          category_color: string | null
          status: string
          published_at: string
          views: number
          likes: number
          comment_count: number
          like_count: number
          reading_time: number | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
      }
      platform_statistics: {
        Row: {
          total_users: number
          new_users_24h: number
          new_users_7d: number
          new_users_30d: number
          verified_users: number
          active_users_24h: number
          total_transactions: number
          transactions_24h: number
          completed_transactions: number
          cancelled_transactions: number
          total_volume: number
          volume_24h: number
          total_fees: number
          fees_24h: number
          total_orders: number
          open_orders: number
          new_orders_24h: number
          generated_at: string
        }
      }
    }
    Functions: BaseDatabase['public']['Functions'] & {
      validate_cpf: {
        Args: { cpf_input: string }
        Returns: boolean
      }
      check_kyc_requirements: {
        Args: { p_user_id: string; p_level: 'basic' | 'intermediate' | 'complete' }
        Returns: boolean
      }
      update_user_kyc_level: {
        Args: { p_user_id: string }
        Returns: 'basic' | 'intermediate' | 'complete'
      }
      calculate_course_progress: {
        Args: { p_enrollment_id: string }
        Returns: number
      }
      complete_lesson: {
        Args: { p_enrollment_id: string; p_lesson_id: string }
        Returns: void
      }
      increment_post_views: {
        Args: { post_id: string }
        Returns: void
      }
      admin_search: {
        Args: { p_query: string; p_types?: string[] }
        Returns: {
          result_type: string
          result_id: string
          title: string
          subtitle: string
          metadata: Json
        }[]
      }
    }
    Enums: BaseDatabase['public']['Enums'] & {
      course_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
      course_status: 'draft' | 'published' | 'archived'
      enrollment_status: 'active' | 'completed' | 'cancelled' | 'expired'
      kyc_verification_status: 'pending' | 'processing' | 'approved' | 'rejected' | 'expired' | 'manual_review'
      kyc_risk_level: 'low' | 'medium' | 'high' | 'very_high'
    }
  }
}

export type Tables<T extends keyof ExtendedDatabase['public']['Tables']> = ExtendedDatabase['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof ExtendedDatabase['public']['Tables']> = ExtendedDatabase['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof ExtendedDatabase['public']['Tables']> = ExtendedDatabase['public']['Tables'][T]['Update']
export type Enums<T extends keyof ExtendedDatabase['public']['Enums']> = ExtendedDatabase['public']['Enums'][T]
export type Views<T extends keyof ExtendedDatabase['public']['Views']> = ExtendedDatabase['public']['Views'][T]['Row']