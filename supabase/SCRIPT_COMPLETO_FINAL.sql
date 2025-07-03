-- SCRIPT COMPLETO FINAL - RIO PORTO P2P
-- Este script unifica todas as migrations em ordem correta
-- Resolve dependências e usa is_admin em vez de role

-- =====================================================
-- 1. EXTENSÕES E CONFIGURAÇÕES INICIAIS
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 2. TIPOS CUSTOMIZADOS (ENUMS)
-- =====================================================

-- Transaction types
DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('buy', 'sell');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('PIX', 'TED', 'bank_transfer', 'cash');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- KYC types
DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_level AS ENUM ('basic', 'intermediate', 'complete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_verification_status AS ENUM ('pending', 'processing', 'approved', 'rejected', 'expired', 'manual_review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_document_type AS ENUM ('rg', 'cnh', 'passport', 'proof_of_address', 'selfie');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_risk_level AS ENUM ('low', 'medium', 'high', 'very_high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Order types
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('open', 'matched', 'completed', 'cancelled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Course types
DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 3. FUNÇÃO GENÉRICA DE UPDATE TIMESTAMP
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. TABELAS BASE (SEM DEPENDÊNCIAS)
-- =====================================================

-- Users Profile (extends auth.users)
CREATE TABLE IF NOT EXISTS users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    cpf TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    kyc_level kyc_level DEFAULT 'basic',
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    reputation_score INTEGER DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    volume_traded DECIMAL(20, 2) DEFAULT 0,
    is_online BOOLEAN DEFAULT false,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferred_payment_methods payment_method[] DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cryptocurrencies supported
CREATE TABLE IF NOT EXISTS cryptocurrencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    min_amount DECIMAL(20, 8) NOT NULL,
    max_amount DECIMAL(20, 8) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    network TEXT,
    contract_address TEXT,
    decimals INTEGER DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABELAS DEPENDENTES DE users_profile
-- =====================================================

-- KYC Documents
CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL,
    document_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    status kyc_status DEFAULT 'pending',
    verified_by UUID REFERENCES users_profile(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders (P2P Order Book)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    crypto_amount DECIMAL(20, 8) NOT NULL,
    fiat_amount DECIMAL(20, 2) NOT NULL,
    price_per_unit DECIMAL(20, 2) NOT NULL,
    min_limit DECIMAL(20, 2),
    max_limit DECIMAL(20, 2),
    payment_methods payment_method[] NOT NULL,
    payment_time_limit INTEGER DEFAULT 30,
    terms TEXT,
    status order_status DEFAULT 'open',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    buyer_id UUID NOT NULL REFERENCES users_profile(id),
    seller_id UUID NOT NULL REFERENCES users_profile(id),
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    type transaction_type NOT NULL,
    crypto_amount DECIMAL(20, 8) NOT NULL,
    fiat_amount DECIMAL(20, 2) NOT NULL,
    price_per_unit DECIMAL(20, 2) NOT NULL,
    fee_amount DECIMAL(20, 2) NOT NULL,
    fee_percentage DECIMAL(5, 4) NOT NULL,
    total_amount DECIMAL(20, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    status transaction_status DEFAULT 'pending',
    payment_proof_url TEXT,
    payment_confirmed_at TIMESTAMP WITH TIME ZONE,
    crypto_tx_hash TEXT,
    crypto_released_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES users_profile(id),
    cancellation_reason TEXT,
    dispute_id UUID,
    rating_buyer INTEGER CHECK (rating_buyer >= 1 AND rating_buyer <= 5),
    rating_seller INTEGER CHECK (rating_seller >= 1 AND rating_seller <= 5),
    feedback_buyer TEXT,
    feedback_seller TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users_profile(id),
    receiver_id UUID NOT NULL REFERENCES users_profile(id),
    message TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price History
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    price_brl DECIMAL(20, 2) NOT NULL,
    price_usd DECIMAL(20, 2),
    volume_24h DECIMAL(20, 2),
    change_24h DECIMAL(10, 4),
    market_cap DECIMAL(20, 2),
    source TEXT DEFAULT 'internal',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Activity Logs
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users_profile(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. MÓDULO DE BLOG
-- =====================================================

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  icon_url TEXT,
  color VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  thumbnail_image TEXT,
  author_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  reading_time INTEGER,
  is_featured BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for posts and tags
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog post likes table
CREATE TABLE IF NOT EXISTS blog_post_likes (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Blog comment likes table
CREATE TABLE IF NOT EXISTS blog_comment_likes (
  comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

-- =====================================================
-- 7. MÓDULO DE CURSOS
-- =====================================================

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT NOT NULL,
  instructor_id UUID NOT NULL REFERENCES users_profile(id),
  category VARCHAR(100) NOT NULL,
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  duration_hours DECIMAL(5,2),
  price DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'BRL',
  thumbnail_url TEXT,
  preview_video_url TEXT,
  status course_status DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT false,
  max_students INTEGER,
  prerequisites TEXT[],
  learning_outcomes TEXT[],
  target_audience TEXT,
  language VARCHAR(5) DEFAULT 'pt-BR',
  certificate_available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  completion_time_days INTEGER,
  tags TEXT[],
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT[],
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course modules
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, display_order)
);

-- Course lessons
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('video', 'text', 'quiz', 'assignment', 'live')),
  content_url TEXT,
  content_text TEXT,
  duration_minutes INTEGER,
  display_order INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false,
  resources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, display_order)
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  status enrollment_status DEFAULT 'active',
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  certificate_issued_at TIMESTAMPTZ,
  certificate_url TEXT,
  last_accessed_at TIMESTAMPTZ,
  total_time_spent_minutes INTEGER DEFAULT 0,
  UNIQUE(course_id, user_id)
);

-- Lesson progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
);

-- Course reviews
CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Course announcements
CREATE TABLE IF NOT EXISTS course_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES users_profile(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Q&A
CREATE TABLE IF NOT EXISTS course_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course answers
CREATE TABLE IF NOT EXISTS course_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES course_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id),
  content TEXT NOT NULL,
  is_instructor_answer BOOLEAN DEFAULT false,
  is_accepted BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, display_order)
);

-- Quiz attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  passed BOOLEAN DEFAULT false,
  answers JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER
);

-- Course categories
CREATE TABLE IF NOT EXISTS course_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  parent_id UUID REFERENCES course_categories(id),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course instructors
CREATE TABLE IF NOT EXISTS course_instructors (
  user_id UUID PRIMARY KEY REFERENCES users_profile(id),
  bio TEXT,
  headline VARCHAR(255),
  website_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  total_students INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_courses INTEGER DEFAULT 0,
  expertise_areas TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. MÓDULO KYC AVANÇADO
-- =====================================================

-- Main KYC verifications table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  verification_type VARCHAR(50) NOT NULL,
  status kyc_verification_status DEFAULT 'pending',
  provider VARCHAR(50),
  provider_request_id VARCHAR(255),
  provider_response JSONB,
  score DECIMAL(5,2),
  verified_data JSONB,
  expires_at TIMESTAMPTZ,
  verified_by UUID REFERENCES users_profile(id),
  rejection_reason TEXT,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, verification_type)
);

-- Document analysis results
CREATE TABLE IF NOT EXISTS kyc_document_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES kyc_documents(id) ON DELETE CASCADE,
  analysis_type VARCHAR(50) NOT NULL,
  provider VARCHAR(50),
  provider_request_id VARCHAR(255),
  results JSONB,
  confidence_score DECIMAL(5,2),
  extracted_data JSONB,
  warnings TEXT[],
  errors TEXT[],
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Phone verification
CREATE TABLE IF NOT EXISTS kyc_phone_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  country_code VARCHAR(5) DEFAULT '+55',
  verification_code VARCHAR(6),
  verification_method VARCHAR(20) DEFAULT 'sms',
  status kyc_verification_status DEFAULT 'pending',
  code_sent_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Address verification
CREATE TABLE IF NOT EXISTS kyc_address_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  document_id UUID REFERENCES kyc_documents(id),
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  country VARCHAR(2) DEFAULT 'BR',
  verification_method VARCHAR(50),
  verification_data JSONB,
  coordinates POINT,
  status kyc_verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facial verification
CREATE TABLE IF NOT EXISTS kyc_facial_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  selfie_url TEXT NOT NULL,
  selfie_document_id UUID REFERENCES kyc_documents(id),
  document_photo_url TEXT,
  document_id UUID REFERENCES kyc_documents(id),
  liveness_score DECIMAL(5,2),
  face_match_score DECIMAL(5,2),
  provider VARCHAR(50),
  provider_session_id VARCHAR(255),
  provider_response JSONB,
  status kyc_verification_status DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk assessment
CREATE TABLE IF NOT EXISTS kyc_risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  risk_score DECIMAL(5,2) NOT NULL,
  risk_level kyc_risk_level NOT NULL,
  risk_factors JSONB,
  pep_check BOOLEAN DEFAULT false,
  sanctions_check BOOLEAN DEFAULT false,
  adverse_media_check BOOLEAN DEFAULT false,
  assessment_provider VARCHAR(50),
  provider_response JSONB,
  valid_until TIMESTAMPTZ,
  assessed_by VARCHAR(50) DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CPF verification
CREATE TABLE IF NOT EXISTS kyc_cpf_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  cpf VARCHAR(14) NOT NULL,
  cpf_normalized VARCHAR(11) NOT NULL,
  full_name VARCHAR(255),
  birth_date DATE,
  mother_name VARCHAR(255),
  status kyc_verification_status DEFAULT 'pending',
  situation VARCHAR(50),
  provider VARCHAR(50),
  provider_response JSONB,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(cpf_normalized)
);

-- KYC audit log
CREATE TABLE IF NOT EXISTS kyc_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  performed_by UUID REFERENCES users_profile(id),
  ip_address INET,
  user_agent TEXT,
  old_data JSONB,
  new_data JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC level limits
CREATE TABLE IF NOT EXISTS kyc_level_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kyc_level kyc_level NOT NULL UNIQUE,
  daily_limit DECIMAL(15,2) NOT NULL,
  monthly_limit DECIMAL(15,2) NOT NULL,
  per_transaction_limit DECIMAL(15,2) NOT NULL,
  required_verifications TEXT[] NOT NULL,
  features_enabled TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 9. MÓDULO ADMINISTRATIVO
-- =====================================================

-- Admin settings
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50),
  is_public BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES users_profile(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ categories
CREATE TABLE IF NOT EXISTS faq_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ items
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES faq_categories(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  helpful_yes INTEGER DEFAULT 0,
  helpful_no INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_by UUID REFERENCES users_profile(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users_profile(id),
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')),
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES users_profile(id),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support ticket messages
CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id),
  message TEXT NOT NULL,
  attachments JSONB,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  channel VARCHAR(50) NOT NULL CHECK (channel IN ('email', 'sms', 'push', 'in_app')),
  subject VARCHAR(255),
  template TEXT NOT NULL,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crypto price sources
CREATE TABLE IF NOT EXISTS crypto_price_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  api_endpoint TEXT NOT NULL,
  api_key_setting VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  rate_limit INTEGER,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crypto price overrides
CREATE TABLE IF NOT EXISTS crypto_price_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
  price_adjustment_type VARCHAR(20) CHECK (price_adjustment_type IN ('fixed', 'percentage')),
  price_adjustment_value DECIMAL(10,4),
  buy_spread DECIMAL(5,4) DEFAULT 0,
  sell_spread DECIMAL(5,4) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_by UUID REFERENCES users_profile(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dashboard metrics
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_date DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  metric_value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_date, metric_type)
);

-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users_profile(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  request_data JSONB,
  response_data JSONB,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. SISTEMA PIX
-- =====================================================

-- PIX Keys
CREATE TABLE IF NOT EXISTS pix_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    key_type TEXT NOT NULL CHECK (key_type IN ('cpf', 'cnpj', 'email', 'phone', 'random')),
    key_value TEXT NOT NULL,
    bank_name TEXT,
    account_holder_name TEXT NOT NULL,
    account_holder_document TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, key_type, key_value)
);

-- PIX Payment Details
CREATE TABLE IF NOT EXISTS pix_payment_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    pix_key_id UUID REFERENCES pix_keys(id),
    pix_key_type TEXT NOT NULL,
    pix_key_value TEXT NOT NULL,
    bank_name TEXT,
    account_holder_name TEXT NOT NULL,
    qr_code_string TEXT,
    qr_code_image_url TEXT,
    payment_id TEXT,
    end_to_end_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PIX Webhooks
CREATE TABLE IF NOT EXISTS pix_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL,
    webhook_id TEXT UNIQUE,
    transaction_id UUID REFERENCES transactions(id),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PIX Payment Confirmations
CREATE TABLE IF NOT EXISTS pix_payment_confirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    confirmed_by UUID NOT NULL REFERENCES users_profile(id),
    confirmation_type TEXT NOT NULL CHECK (confirmation_type IN ('buyer', 'seller', 'admin')),
    proof_image_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(transaction_id, confirmed_by)
);

-- =====================================================
-- 11. AUTENTICAÇÃO DE DOIS FATORES
-- =====================================================

-- Two factor auth table
CREATE TABLE IF NOT EXISTS public.two_factor_auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    secret TEXT NOT NULL,
    enabled BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    backup_codes_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id)
);

-- Backup codes table
CREATE TABLE IF NOT EXISTS public.backup_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. PREÇOS DE CRIPTOMOEDAS
-- =====================================================

-- Crypto prices table
CREATE TABLE IF NOT EXISTS crypto_prices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL,
  price_brl DECIMAL(20, 8) NOT NULL,
  price_usd DECIMAL(20, 8) NOT NULL,
  percent_change_24h DECIMAL(10, 4) NOT NULL,
  percent_change_7d DECIMAL(10, 4),
  volume_24h DECIMAL(20, 2) NOT NULL,
  market_cap DECIMAL(20, 2),
  high_24h DECIMAL(20, 8),
  low_24h DECIMAL(20, 8),
  source VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 13. CRIAÇÃO DE ÍNDICES
-- =====================================================

-- Users profile indexes
CREATE INDEX IF NOT EXISTS idx_users_profile_email ON users_profile(email);
CREATE INDEX IF NOT EXISTS idx_users_profile_cpf ON users_profile(cpf);
CREATE INDEX IF NOT EXISTS idx_users_profile_is_admin ON users_profile(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_profile_kyc_level ON users_profile(kyc_level);

-- KYC documents indexes
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_crypto_id ON orders(crypto_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(type);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Chat messages indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_transaction_id ON chat_messages(transaction_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver_id ON chat_messages(receiver_id);

-- Price history indexes
CREATE INDEX IF NOT EXISTS idx_price_history_crypto_id ON price_history(crypto_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at DESC);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Blog indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user ON blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);

-- Course indexes
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_course ON course_questions(course_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON course_questions(lesson_id);

-- KYC advanced indexes
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user ON kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_status ON kyc_verifications(status);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_type ON kyc_verifications(verification_type);
CREATE INDEX IF NOT EXISTS idx_kyc_document_analysis_document ON kyc_document_analysis(document_id);
CREATE INDEX IF NOT EXISTS idx_kyc_phone_verifications_user ON kyc_phone_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_phone_verifications_phone ON kyc_phone_verifications(phone_number);
CREATE INDEX IF NOT EXISTS idx_kyc_cpf_verifications_cpf ON kyc_cpf_verifications(cpf_normalized);
CREATE INDEX IF NOT EXISTS idx_kyc_risk_assessments_user ON kyc_risk_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_audit_log_user ON kyc_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_audit_log_entity ON kyc_audit_log(entity_type, entity_id);

-- PIX indexes
CREATE INDEX IF NOT EXISTS idx_pix_keys_user_id ON pix_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_pix_keys_active ON pix_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_pix_payment_details_transaction_id ON pix_payment_details(transaction_id);
CREATE INDEX IF NOT EXISTS idx_pix_webhooks_transaction_id ON pix_webhooks(transaction_id);
CREATE INDEX IF NOT EXISTS idx_pix_webhooks_webhook_id ON pix_webhooks(webhook_id);

-- 2FA indexes
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_user_id ON public.two_factor_auth(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_codes_user_id ON public.backup_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_codes_used ON public.backup_codes(used);

-- Crypto prices indexes
CREATE INDEX IF NOT EXISTS idx_crypto_prices_symbol ON crypto_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_created_at ON crypto_prices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_symbol_created ON crypto_prices(symbol, created_at DESC);

-- =====================================================
-- 14. FUNÇÕES AUXILIARES
-- =====================================================

-- Blog functions
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET views = views + 1 
  WHERE id = post_id AND status = 'published';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_speed INTEGER := 200;
BEGIN
  word_count := array_length(string_to_array(content, ' '), 1);
  RETURN GREATEST(1, CEIL(word_count::FLOAT / reading_speed));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION auto_calculate_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reading_time := calculate_reading_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Course functions
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'course_enrollments' THEN
    UPDATE courses
    SET total_students = (
      SELECT COUNT(DISTINCT user_id) 
      FROM course_enrollments 
      WHERE course_id = NEW.course_id AND status != 'cancelled'
    )
    WHERE id = NEW.course_id;
  ELSIF TG_TABLE_NAME = 'course_reviews' THEN
    UPDATE courses
    SET 
      total_reviews = (SELECT COUNT(*) FROM course_reviews WHERE course_id = NEW.course_id),
      rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM course_reviews WHERE course_id = NEW.course_id)
    WHERE id = NEW.course_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_course_lesson_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET total_lessons = (
    SELECT COUNT(*)
    FROM course_lessons cl
    JOIN course_modules cm ON cl.module_id = cm.id
    WHERE cm.course_id = NEW.course_id
  )
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress DECIMAL(5,2);
BEGIN
  SELECT COUNT(DISTINCT cl.id) INTO total_lessons
  FROM course_lessons cl
  JOIN course_modules cm ON cl.module_id = cm.id
  JOIN course_enrollments ce ON cm.course_id = ce.course_id
  WHERE ce.id = NEW.enrollment_id;
  
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_progress
  WHERE enrollment_id = NEW.enrollment_id AND is_completed = true;
  
  IF total_lessons > 0 THEN
    progress := (completed_lessons::DECIMAL / total_lessons) * 100;
  ELSE
    progress := 0;
  END IF;
  
  UPDATE course_enrollments
  SET 
    progress_percentage = progress,
    completed_at = CASE WHEN progress = 100 THEN NOW() ELSE NULL END,
    status = CASE WHEN progress = 100 THEN 'completed'::enrollment_status ELSE status END
  WHERE id = NEW.enrollment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- KYC functions
CREATE OR REPLACE FUNCTION validate_cpf(cpf_input VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  cpf_clean VARCHAR;
  sum1 INTEGER := 0;
  sum2 INTEGER := 0;
  digit1 INTEGER;
  digit2 INTEGER;
  i INTEGER;
BEGIN
  cpf_clean := regexp_replace(cpf_input, '[^0-9]', '', 'g');
  
  IF length(cpf_clean) != 11 THEN
    RETURN false;
  END IF;
  
  IF cpf_clean IN ('00000000000', '11111111111', '22222222222', '33333333333', 
                   '44444444444', '55555555555', '66666666666', '77777777777', 
                   '88888888888', '99999999999') THEN
    RETURN false;
  END IF;
  
  FOR i IN 1..9 LOOP
    sum1 := sum1 + (substring(cpf_clean, i, 1)::INTEGER * (11 - i));
  END LOOP;
  
  digit1 := 11 - (sum1 % 11);
  IF digit1 > 9 THEN
    digit1 := 0;
  END IF;
  
  FOR i IN 1..10 LOOP
    sum2 := sum2 + (substring(cpf_clean, i, 1)::INTEGER * (12 - i));
  END LOOP;
  
  digit2 := 11 - (sum2 % 11);
  IF digit2 > 9 THEN
    digit2 := 0;
  END IF;
  
  RETURN substring(cpf_clean, 10, 1)::INTEGER = digit1 
     AND substring(cpf_clean, 11, 1)::INTEGER = digit2;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_kyc_requirements(p_user_id UUID, p_level kyc_level)
RETURNS BOOLEAN AS $$
DECLARE
  v_required_verifications TEXT[];
  v_verification TEXT;
  v_has_verification BOOLEAN;
BEGIN
  SELECT required_verifications INTO v_required_verifications
  FROM kyc_level_limits
  WHERE kyc_level = p_level;
  
  FOREACH v_verification IN ARRAY v_required_verifications LOOP
    SELECT EXISTS(
      SELECT 1 FROM kyc_verifications
      WHERE user_id = p_user_id
      AND verification_type = v_verification
      AND status = 'approved'
      AND (expires_at IS NULL OR expires_at > NOW())
    ) INTO v_has_verification;
    
    IF NOT v_has_verification THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_kyc_level(p_user_id UUID)
RETURNS kyc_level AS $$
DECLARE
  v_new_level kyc_level;
BEGIN
  IF check_kyc_requirements(p_user_id, 'complete') THEN
    v_new_level := 'complete';
  ELSIF check_kyc_requirements(p_user_id, 'intermediate') THEN
    v_new_level := 'intermediate';
  ELSE
    v_new_level := 'basic';
  END IF;
  
  UPDATE users_profile
  SET 
    kyc_level = v_new_level,
    kyc_verified_at = CASE 
      WHEN v_new_level != 'basic' THEN NOW() 
      ELSE kyc_verified_at 
    END
  WHERE id = p_user_id;
  
  RETURN v_new_level;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS VARCHAR AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_kyc_action(
  p_user_id UUID,
  p_action VARCHAR,
  p_entity_type VARCHAR,
  p_entity_id UUID,
  p_performed_by UUID,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO kyc_audit_log (
    user_id, action, entity_type, entity_id, 
    performed_by, old_data, new_data, metadata
  ) VALUES (
    p_user_id, p_action, p_entity_type, p_entity_id,
    p_performed_by, p_old_data, p_new_data, p_metadata
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_update_kyc_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    PERFORM update_user_kyc_level(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Admin functions
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS VARCHAR AS $$
DECLARE
  v_year VARCHAR(2);
  v_month VARCHAR(2);
  v_seq INTEGER;
  v_number VARCHAR(20);
BEGIN
  v_year := TO_CHAR(NOW(), 'YY');
  v_month := TO_CHAR(NOW(), 'MM');
  
  SELECT COUNT(*) + 1 INTO v_seq
  FROM support_tickets
  WHERE created_at >= DATE_TRUNC('month', NOW());
  
  v_number := 'TKT-' || v_year || v_month || '-' || LPAD(v_seq::TEXT, 4, '0');
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_daily_metrics()
RETURNS void AS $$
BEGIN
  DELETE FROM dashboard_metrics WHERE metric_date = CURRENT_DATE;
  
  INSERT INTO dashboard_metrics (metric_date, metric_type, metric_value)
  SELECT 
    CURRENT_DATE,
    'user_metrics',
    jsonb_build_object(
      'total_users', COUNT(*),
      'new_users_today', COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE),
      'active_users_today', COUNT(*) FILTER (WHERE DATE(last_seen_at) = CURRENT_DATE),
      'verified_users', COUNT(*) FILTER (WHERE kyc_level != 'basic'),
      'by_kyc_level', jsonb_object_agg(kyc_level, count) FROM (
        SELECT kyc_level, COUNT(*) FROM users_profile GROUP BY kyc_level
      ) t
    )
  FROM users_profile;
  
  INSERT INTO dashboard_metrics (metric_date, metric_type, metric_value)
  SELECT 
    CURRENT_DATE,
    'transaction_metrics',
    jsonb_build_object(
      'total_transactions', COUNT(*),
      'transactions_today', COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE),
      'volume_today', COALESCE(SUM(total_amount) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 0),
      'fees_today', COALESCE(SUM(fee_amount) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 0),
      'by_status', jsonb_object_agg(status, count) FROM (
        SELECT status, COUNT(*) FROM transactions 
        WHERE DATE(created_at) = CURRENT_DATE 
        GROUP BY status
      ) t,
      'by_crypto', jsonb_object_agg(symbol, data) FROM (
        SELECT c.symbol, jsonb_build_object('count', COUNT(*), 'volume', SUM(t.total_amount))  as data
        FROM transactions t
        JOIN cryptocurrencies c ON t.crypto_id = c.id
        WHERE DATE(t.created_at) = CURRENT_DATE
        GROUP BY c.symbol
      ) t
    )
  FROM transactions;
  
  INSERT INTO dashboard_metrics (metric_date, metric_type, metric_value)
  SELECT 
    CURRENT_DATE,
    'order_metrics',
    jsonb_build_object(
      'total_orders', COUNT(*),
      'open_orders', COUNT(*) FILTER (WHERE status = 'open'),
      'orders_today', COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE),
      'by_type', jsonb_object_agg(type, count) FROM (
        SELECT type, COUNT(*) FROM orders GROUP BY type
      ) t
    )
  FROM orders;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION admin_search(
  p_query TEXT,
  p_types TEXT[] DEFAULT ARRAY['users', 'transactions', 'orders']
)
RETURNS TABLE (
  result_type TEXT,
  result_id UUID,
  title TEXT,
  subtitle TEXT,
  metadata JSONB
) AS $$
BEGIN
  IF 'users' = ANY(p_types) THEN
    RETURN QUERY
    SELECT 
      'user'::TEXT,
      id,
      full_name,
      email,
      jsonb_build_object(
        'cpf', cpf,
        'phone', phone,
        'kyc_level', kyc_level,
        'created_at', created_at
      )
    FROM users_profile
    WHERE 
      full_name ILIKE '%' || p_query || '%' OR
      email ILIKE '%' || p_query || '%' OR
      cpf ILIKE '%' || p_query || '%' OR
      phone ILIKE '%' || p_query || '%'
    LIMIT 10;
  END IF;
  
  IF 'transactions' = ANY(p_types) THEN
    RETURN QUERY
    SELECT 
      'transaction'::TEXT,
      t.id,
      'Transaction #' || LEFT(t.id::TEXT, 8),
      c.symbol || ' - R$ ' || t.total_amount::TEXT,
      jsonb_build_object(
        'status', t.status,
        'type', t.type,
        'created_at', t.created_at
      )
    FROM transactions t
    JOIN cryptocurrencies c ON t.crypto_id = c.id
    WHERE 
      t.id::TEXT ILIKE '%' || p_query || '%'
    LIMIT 10;
  END IF;
  
  IF 'orders' = ANY(p_types) THEN
    RETURN QUERY
    SELECT 
      'order'::TEXT,
      o.id,
      'Order #' || LEFT(o.id::TEXT, 8),
      c.symbol || ' - ' || o.type || ' - R$ ' || o.fiat_amount::TEXT,
      jsonb_build_object(
        'status', o.status,
        'type', o.type,
        'created_at', o.created_at
      )
    FROM orders o
    JOIN cryptocurrencies c ON o.crypto_id = c.id
    WHERE 
      o.id::TEXT ILIKE '%' || p_query || '%'
    LIMIT 10;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- PIX functions
CREATE OR REPLACE FUNCTION generate_pix_qr_code_string(
    p_key_type TEXT,
    p_key_value TEXT,
    p_receiver_name TEXT,
    p_receiver_city TEXT,
    p_amount DECIMAL,
    p_transaction_id TEXT
) RETURNS TEXT AS $$
DECLARE
    v_payload TEXT;
    v_merchant_account TEXT;
    v_merchant_info TEXT;
    v_transaction_info TEXT;
    v_amount_str TEXT;
BEGIN
    v_payload := '00' || '02' || '01';
    
    v_merchant_account := '00' || 'BR.GOV.BCB.PIX' || '01' || to_char(length(p_key_value), 'FM00') || p_key_value;
    v_merchant_info := '26' || to_char(length(v_merchant_account), 'FM00') || v_merchant_account;
    
    v_payload := v_payload || '52' || '04' || '0000';
    v_payload := v_payload || '53' || '03' || '986';
    
    IF p_amount > 0 THEN
        v_amount_str := to_char(p_amount, 'FM999999999.00');
        v_payload := v_payload || '54' || to_char(length(v_amount_str), 'FM00') || v_amount_str;
    END IF;
    
    v_payload := v_payload || '58' || '02' || 'BR';
    v_payload := v_payload || '59' || to_char(length(p_receiver_name), 'FM00') || p_receiver_name;
    v_payload := v_payload || '60' || to_char(length(p_receiver_city), 'FM00') || p_receiver_city;
    
    IF p_transaction_id IS NOT NULL THEN
        v_transaction_info := '05' || to_char(length(p_transaction_id), 'FM00') || p_transaction_id;
        v_payload := v_payload || '62' || to_char(length(v_transaction_info), 'FM00') || v_transaction_info;
    END IF;
    
    v_payload := v_payload || '63' || '04' || 'ABCD';
    
    RETURN v_payload;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_pix_key(p_key_type TEXT, p_key_value TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    CASE p_key_type
        WHEN 'cpf' THEN
            RETURN p_key_value ~ '^\d{11}$';
        WHEN 'cnpj' THEN
            RETURN p_key_value ~ '^\d{14}$';
        WHEN 'email' THEN
            RETURN p_key_value ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
        WHEN 'phone' THEN
            RETURN p_key_value ~ '^\+55\d{10,11}$';
        WHEN 'random' THEN
            RETURN p_key_value ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_pix_key_before_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT validate_pix_key(NEW.key_type, NEW.key_value) THEN
        RAISE EXCEPTION 'Invalid PIX key format for type %', NEW.key_type;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 15. CRIAÇÃO DE VIEWS
-- =====================================================

-- Blog views
CREATE OR REPLACE VIEW blog_posts_published AS
SELECT 
  p.*,
  u.full_name as author_name,
  u.avatar_url as author_avatar,
  CASE WHEN u.is_admin = true THEN 'admin' ELSE 'user' END as author_role,
  c.name as category_name,
  c.slug as category_slug,
  c.color as category_color,
  COUNT(DISTINCT com.id) as comment_count,
  COUNT(DISTINCT pl.user_id) as like_count
FROM blog_posts p
LEFT JOIN users_profile u ON p.author_id = u.id
LEFT JOIN blog_categories c ON p.category_id = c.id
LEFT JOIN blog_comments com ON p.id = com.post_id AND com.status = 'approved'
LEFT JOIN blog_post_likes pl ON p.id = pl.post_id
WHERE p.status = 'published' 
  AND p.published_at <= NOW()
GROUP BY p.id, u.id, c.id;

CREATE OR REPLACE VIEW blog_posts_popular AS
SELECT * FROM blog_posts_published
WHERE published_at >= NOW() - INTERVAL '30 days'
ORDER BY views DESC, like_count DESC
LIMIT 10;

-- Course views
CREATE OR REPLACE VIEW courses_with_stats AS
SELECT 
  c.*,
  i.full_name as instructor_name,
  i.avatar_url as instructor_avatar,
  COUNT(DISTINCT m.id) as module_count,
  COUNT(DISTINCT l.id) as lesson_count,
  SUM(l.duration_minutes) as total_duration_minutes
FROM courses c
LEFT JOIN users_profile i ON c.instructor_id = i.id
LEFT JOIN course_modules m ON c.id = m.course_id
LEFT JOIN course_lessons l ON m.id = l.module_id
GROUP BY c.id, i.id;

CREATE OR REPLACE VIEW user_course_progress AS
SELECT 
  e.*,
  c.title as course_title,
  c.thumbnail_url as course_thumbnail,
  COUNT(DISTINCT p.lesson_id) FILTER (WHERE p.is_completed) as completed_lessons,
  COUNT(DISTINCT l.id) as total_lessons,
  MAX(p.updated_at) as last_activity
FROM course_enrollments e
JOIN courses c ON e.course_id = c.id
LEFT JOIN course_modules m ON c.id = m.course_id
LEFT JOIN course_lessons l ON m.id = l.module_id
LEFT JOIN lesson_progress p ON e.id = p.enrollment_id AND p.lesson_id = l.id
GROUP BY e.id, c.id;

-- Admin views
CREATE OR REPLACE VIEW platform_statistics AS
WITH user_stats AS (
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as new_users_24h,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_7d,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30d,
    COUNT(*) FILTER (WHERE kyc_level = 'complete') as verified_users,
    COUNT(*) FILTER (WHERE last_seen_at >= NOW() - INTERVAL '24 hours') as active_users_24h
  FROM users_profile
),
transaction_stats AS (
  SELECT 
    COUNT(*) as total_transactions,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as transactions_24h,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_transactions,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_transactions,
    COALESCE(SUM(total_amount), 0) as total_volume,
    COALESCE(SUM(total_amount) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours'), 0) as volume_24h,
    COALESCE(SUM(fee_amount), 0) as total_fees,
    COALESCE(SUM(fee_amount) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours'), 0) as fees_24h
  FROM transactions
),
order_stats AS (
  SELECT 
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE status = 'open') as open_orders,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as new_orders_24h
  FROM orders
)
SELECT 
  u.*,
  t.*,
  o.*,
  NOW() as generated_at
FROM user_stats u, transaction_stats t, order_stats o;

CREATE OR REPLACE VIEW transaction_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as transaction_count,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
  SUM(total_amount) as total_volume,
  SUM(fee_amount) as total_fees,
  AVG(total_amount) as avg_transaction_size,
  COUNT(DISTINCT buyer_id) as unique_buyers,
  COUNT(DISTINCT seller_id) as unique_sellers,
  COUNT(DISTINCT crypto_id) as cryptos_traded
FROM transactions
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW user_growth_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as new_users,
  COUNT(*) FILTER (WHERE kyc_level != 'basic') as verified_users,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('day', created_at)) as cumulative_users
FROM users_profile
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Crypto prices view
CREATE OR REPLACE VIEW latest_crypto_prices AS
SELECT DISTINCT ON (symbol) 
  symbol,
  price_brl,
  price_usd,
  percent_change_24h,
  percent_change_7d,
  volume_24h,
  market_cap,
  high_24h,
  low_24h,
  source,
  created_at
FROM crypto_prices
ORDER BY symbol, created_at DESC;

-- =====================================================
-- 16. APLICAÇÃO DE TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON kyc_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cryptocurrencies_updated_at BEFORE UPDATE ON cryptocurrencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blog triggers
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

CREATE TRIGGER calculate_post_reading_time
  BEFORE INSERT OR UPDATE OF content ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_calculate_reading_time();

-- Course triggers
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at
  BEFORE UPDATE ON course_lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_reviews_updated_at
  BEFORE UPDATE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_instructors_updated_at
  BEFORE UPDATE ON course_instructors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_stats_on_enrollment
  AFTER INSERT OR UPDATE OR DELETE ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_course_stats();

CREATE TRIGGER update_course_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_stats();

CREATE TRIGGER update_course_lesson_count_on_module_change
  AFTER INSERT OR UPDATE OR DELETE ON course_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_course_lesson_count();

CREATE TRIGGER update_enrollment_progress_on_lesson_progress
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_progress();

-- KYC triggers
CREATE TRIGGER update_kyc_level_on_verification
  AFTER UPDATE OF status ON kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_kyc_level();

-- Admin triggers
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_categories_updated_at
  BEFORE UPDATE ON faq_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON faq_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER generate_ticket_number_trigger
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL)
  EXECUTE FUNCTION generate_ticket_number();

-- PIX triggers
CREATE TRIGGER update_pix_keys_updated_at BEFORE UPDATE ON pix_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pix_payment_details_updated_at BEFORE UPDATE ON pix_payment_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER validate_pix_key_trigger
    BEFORE INSERT OR UPDATE ON pix_keys
    FOR EACH ROW
    EXECUTE FUNCTION validate_pix_key_before_insert();

-- 2FA trigger
CREATE TRIGGER update_two_factor_auth_updated_at BEFORE UPDATE
    ON public.two_factor_auth
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Crypto prices trigger
CREATE TRIGGER update_crypto_prices_updated_at BEFORE UPDATE
  ON crypto_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 17. POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_document_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_phone_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_address_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_facial_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_cpf_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_level_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_price_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_price_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_payment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_payment_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_codes ENABLE ROW LEVEL SECURITY;

-- Users profile policies
CREATE POLICY users_profile_policy ON users_profile
    FOR ALL USING (auth.uid() = id OR is_admin = true);

-- KYC documents policies
CREATE POLICY kyc_documents_policy ON kyc_documents
    FOR ALL USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

-- Orders policies
CREATE POLICY orders_select_policy ON orders
    FOR SELECT USING (status = 'open' OR user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY orders_modify_policy ON orders
    FOR ALL USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

-- Transactions policies
CREATE POLICY transactions_policy ON transactions
    FOR ALL USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

-- Chat messages policies
CREATE POLICY chat_messages_policy ON chat_messages
    FOR ALL USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

-- Notifications policies
CREATE POLICY notifications_policy ON notifications
    FOR ALL USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

-- Blog policies
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Authors can manage own posts" ON blog_posts
  FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Public can view categories" ON blog_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view tags" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON blog_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON blog_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public can view approved comments" ON blog_comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Comment authors can view own comments" ON blog_comments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can like posts" ON blog_post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts" ON blog_post_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view post likes" ON blog_post_likes
  FOR SELECT USING (true);

-- Course policies
CREATE POLICY "Public can view published courses" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage own courses" ON courses
  FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can manage all courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Enrolled users can view modules" ON course_modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_id = course_modules.course_id
      AND user_id = auth.uid()
    ) OR is_preview = true
  );

CREATE POLICY "Instructors can manage modules" ON course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE id = course_modules.course_id
      AND instructor_id = auth.uid()
    )
  );

CREATE POLICY "Enrolled users can view lessons" ON course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments ce
      JOIN course_modules cm ON ce.course_id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND ce.user_id = auth.uid()
    ) OR is_preview = true
  );

CREATE POLICY "Instructors can manage lessons" ON course_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses c
      JOIN course_modules cm ON c.id = cm.course_id
      WHERE cm.id = course_lessons.module_id
      AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own enrollments" ON course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON course_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON lesson_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE id = lesson_progress.enrollment_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own progress" ON lesson_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE id = lesson_progress.enrollment_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view course reviews" ON course_reviews
  FOR SELECT USING (true);

CREATE POLICY "Enrolled users can create reviews" ON course_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM course_enrollments
      WHERE course_id = course_reviews.course_id
      AND user_id = auth.uid()
      AND status = 'completed'
    )
  );

CREATE POLICY "Users can update own reviews" ON course_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- KYC policies
CREATE POLICY "Users can view own KYC verifications" ON kyc_verifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create KYC verifications" ON kyc_verifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage KYC verifications" ON kyc_verifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Users can view own phone verifications" ON kyc_phone_verifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create phone verifications" ON kyc_phone_verifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own CPF verifications" ON kyc_cpf_verifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Public can view KYC limits" ON kyc_level_limits
  FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Admins can manage settings" ON admin_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Public can view FAQ categories" ON faq_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view FAQ items" ON faq_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users_profile
    WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- PIX policies
CREATE POLICY "Users can view own PIX keys" ON pix_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own PIX keys" ON pix_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PIX keys" ON pix_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PIX keys" ON pix_keys
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Buyers can view seller PIX keys in active transactions" ON pix_keys
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.seller_id = pix_keys.user_id
            AND t.buyer_id = auth.uid()
            AND t.status IN ('pending', 'processing', 'waiting_payment', 'payment_confirmed')
        )
    );

CREATE POLICY "Transaction parties can view payment details" ON pix_payment_details
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.id = pix_payment_details.transaction_id
            AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid())
        )
    );

CREATE POLICY "Sellers can insert payment details" ON pix_payment_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.id = transaction_id
            AND t.seller_id = auth.uid()
        )
    );

CREATE POLICY "Transaction parties can view confirmations" ON pix_payment_confirmations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.id = pix_payment_confirmations.transaction_id
            AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid())
        )
    );

CREATE POLICY "Transaction parties can add confirmations" ON pix_payment_confirmations
    FOR INSERT WITH CHECK (
        auth.uid() = confirmed_by AND
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.id = transaction_id
            AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid())
        )
    );

CREATE POLICY "Only admins can view webhooks" ON pix_webhooks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users_profile
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- 2FA policies
CREATE POLICY "Users can view their own 2FA settings"
    ON public.two_factor_auth
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2FA settings"
    ON public.two_factor_auth
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2FA settings"
    ON public.two_factor_auth
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 2FA settings"
    ON public.two_factor_auth
    FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own backup codes"
    ON public.backup_codes
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own backup codes"
    ON public.backup_codes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backup codes"
    ON public.backup_codes
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backup codes"
    ON public.backup_codes
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 18. INSERÇÃO DE DADOS INICIAIS
-- =====================================================

-- Insert default cryptocurrencies
INSERT INTO cryptocurrencies (symbol, name, logo_url, min_amount, max_amount, decimals) VALUES
    ('BTC', 'Bitcoin', '/crypto-logos/btc.png', 0.00001, 10, 8),
    ('ETH', 'Ethereum', '/crypto-logos/eth.png', 0.0001, 100, 18),
    ('USDT', 'Tether', '/crypto-logos/usdt.png', 1, 100000, 6),
    ('BNB', 'Binance Coin', '/crypto-logos/bnb.png', 0.001, 1000, 18),
    ('SOL', 'Solana', '/crypto-logos/sol.png', 0.01, 10000, 9),
    ('XRP', 'Ripple', '/crypto-logos/xrp.png', 1, 100000, 6),
    ('ADA', 'Cardano', '/crypto-logos/ada.png', 1, 100000, 6),
    ('DOGE', 'Dogecoin', '/crypto-logos/doge.png', 1, 1000000, 8)
ON CONFLICT (symbol) DO NOTHING;

-- Insert blog categories
INSERT INTO blog_categories (name, slug, description, color, display_order) VALUES
  ('Novidades', 'novidades', 'Últimas notícias e atualizações da plataforma', '#3B82F6', 1),
  ('Educação', 'educacao', 'Artigos educacionais sobre criptomoedas e P2P', '#10B981', 2),
  ('Segurança', 'seguranca', 'Dicas de segurança e boas práticas', '#EF4444', 3),
  ('Tutoriais', 'tutoriais', 'Guias passo a passo', '#8B5CF6', 4),
  ('Mercado', 'mercado', 'Análises e tendências do mercado', '#F59E0B', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert blog tags
INSERT INTO blog_tags (name, slug) VALUES
  ('Bitcoin', 'bitcoin'),
  ('Ethereum', 'ethereum'),
  ('P2P', 'p2p'),
  ('Segurança', 'seguranca'),
  ('Tutorial', 'tutorial'),
  ('Iniciantes', 'iniciantes'),
  ('Trading', 'trading'),
  ('PIX', 'pix'),
  ('KYC', 'kyc'),
  ('DeFi', 'defi')
ON CONFLICT (slug) DO NOTHING;

-- Insert course categories
INSERT INTO course_categories (name, slug, description, display_order) VALUES
  ('Blockchain', 'blockchain', 'Fundamentos e aplicações de blockchain', 1),
  ('Criptomoedas', 'criptomoedas', 'Bitcoin, Ethereum e outras criptomoedas', 2),
  ('Trading', 'trading', 'Estratégias e análise técnica', 3),
  ('DeFi', 'defi', 'Finanças descentralizadas', 4),
  ('Segurança', 'seguranca', 'Segurança em crypto e boas práticas', 5),
  ('P2P', 'p2p', 'Trading P2P e estratégias', 6),
  ('Iniciantes', 'iniciantes', 'Conteúdo para quem está começando', 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert KYC level limits
INSERT INTO kyc_level_limits (kyc_level, daily_limit, monthly_limit, per_transaction_limit, required_verifications, features_enabled) VALUES
  ('basic', 1000.00, 5000.00, 1000.00, ARRAY['email'], ARRAY['buy_crypto', 'sell_crypto']),
  ('intermediate', 10000.00, 50000.00, 5000.00, ARRAY['email', 'cpf', 'phone'], ARRAY['buy_crypto', 'sell_crypto', 'withdraw']),
  ('complete', 100000.00, 500000.00, 50000.00, ARRAY['email', 'cpf', 'phone', 'document', 'address', 'facial'], ARRAY['buy_crypto', 'sell_crypto', 'withdraw', 'otc', 'merchant'])
ON CONFLICT (kyc_level) DO NOTHING;

-- Insert admin settings
INSERT INTO admin_settings (key, value, description, category) VALUES
  ('platform_name', '"Rio Porto P2P"', 'Nome da plataforma', 'general'),
  ('platform_fee_percentage', '3.5', 'Taxa da plataforma em porcentagem', 'fees'),
  ('min_transaction_amount', '10', 'Valor mínimo de transação em BRL', 'limits'),
  ('max_transaction_amount', '50000', 'Valor máximo de transação em BRL', 'limits'),
  ('kyc_auto_approve', 'false', 'Aprovar KYC automaticamente', 'kyc'),
  ('maintenance_mode', 'false', 'Modo de manutenção', 'general'),
  ('support_email', '"suporte@rioportop2p.com"', 'Email de suporte', 'contact'),
  ('support_whatsapp', '"+5521999999999"', 'WhatsApp de suporte', 'contact')
ON CONFLICT (key) DO NOTHING;

-- Insert FAQ categories
INSERT INTO faq_categories (name, slug, description, order_index) VALUES
  ('Começando', 'comecando', 'Primeiros passos na plataforma', 1),
  ('Segurança', 'seguranca', 'Dicas e práticas de segurança', 2),
  ('Transações', 'transacoes', 'Como comprar e vender', 3),
  ('KYC', 'kyc', 'Verificação de identidade', 4),
  ('Taxas', 'taxas', 'Taxas e limites', 5),
  ('Problemas', 'problemas', 'Resolução de problemas', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert notification templates
INSERT INTO notification_templates (code, name, channel, subject, template, variables) VALUES
  ('welcome_email', 'Email de Boas Vindas', 'email', 'Bem-vindo ao Rio Porto P2P', 
   'Olá {{name}}, bem-vindo ao Rio Porto P2P! Sua conta foi criada com sucesso.', 
   '{"name": "Nome do usuário"}'::jsonb),
  ('transaction_created', 'Transação Criada', 'in_app', NULL,
   'Nova transação de {{type}} de {{crypto}} no valor de R$ {{amount}}',
   '{"type": "Tipo da transação", "crypto": "Criptomoeda", "amount": "Valor"}'::jsonb),
  ('kyc_approved', 'KYC Aprovado', 'email', 'Sua verificação foi aprovada!',
   'Parabéns {{name}}! Sua verificação de nível {{level}} foi aprovada.',
   '{"name": "Nome do usuário", "level": "Nível KYC"}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 19. PERMISSÕES FINAIS
-- =====================================================

-- Grant permissions for crypto_prices
GRANT SELECT ON crypto_prices TO anon;
GRANT SELECT ON crypto_prices TO authenticated;
GRANT INSERT, UPDATE ON crypto_prices TO service_role;
GRANT SELECT ON latest_crypto_prices TO anon;
GRANT SELECT ON latest_crypto_prices TO authenticated;

-- Grant permissions for notifications
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =====================================================
-- 20. STORAGE BUCKETS (EXECUTAR APÓS CRIAÇÃO DO STORAGE)
-- =====================================================

-- Este bloco precisa ser executado separadamente após a configuração do storage
/*
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own uploads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own uploads" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own uploads" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Transaction parties can view payment proofs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'uploads' AND
    EXISTS (
      SELECT 1 FROM transactions
      WHERE (transactions.buyer_id = auth.uid() OR transactions.seller_id = auth.uid())
      AND storage.filename(name) LIKE '%' || transactions.id || '%'
    )
  );
*/

-- FIM DO SCRIPT