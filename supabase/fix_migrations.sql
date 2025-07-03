-- Script para corrigir os erros das migrations
-- Execute este script ANTES das migrations individuais

-- 1. Limpar tipos existentes (se necessário)
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS course_level CASCADE;
DROP TYPE IF EXISTS kyc_status CASCADE;

-- 2. Verificar se a tabela users_profile existe
-- Se não existir, vamos criar a estrutura básica primeiro
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users_profile') THEN
        -- Criar tabela users_profile básica
        CREATE TABLE users_profile (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            phone TEXT,
            avatar_url TEXT,
            is_admin BOOLEAN DEFAULT false,
            kyc_level INTEGER DEFAULT 1 CHECK (kyc_level >= 1 AND kyc_level <= 3),
            kyc_status TEXT DEFAULT 'pending',
            two_factor_enabled BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Habilitar RLS
        ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
        
        -- Criar política básica
        CREATE POLICY "Users can view own profile" ON users_profile
            FOR SELECT USING (auth.uid() = id);
    END IF;
END $$;

-- 3. Verificar e ajustar a tabela transactions
-- Primeiro, vamos verificar se existe e tem as colunas corretas
DO $$ 
BEGIN
    -- Se a tabela transactions existe mas usa buyer_id/seller_id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'transactions' AND column_name = 'buyer_id') THEN
        
        -- Renomear colunas para o padrão correto
        ALTER TABLE transactions RENAME COLUMN buyer_id TO user_id;
        
        -- Se seller_id existe, podemos removê-la ou mantê-la como partner_id
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transactions' AND column_name = 'seller_id') THEN
            ALTER TABLE transactions RENAME COLUMN seller_id TO partner_id;
        END IF;
    END IF;
END $$;

-- 4. Criar tipos necessários (se não existirem)
DO $$ 
BEGIN
    -- transaction_status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        CREATE TYPE transaction_status AS ENUM (
            'pending',
            'processing',
            'waiting_payment',
            'payment_confirmed',
            'completed',
            'cancelled',
            'expired',
            'disputed'
        );
    END IF;
    
    -- course_level
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_level') THEN
        CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');
    END IF;
    
    -- kyc_status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kyc_status') THEN
        CREATE TYPE kyc_status AS ENUM ('pending', 'submitted', 'under_review', 'approved', 'rejected');
    END IF;
END $$;

-- 5. Garantir que as extensões necessárias estão habilitadas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Agora você pode executar as migrations individuais na ordem:
-- 1. 001_initial_schema.sql
-- 2. 002_blog_schema.sql
-- 3. 003_courses_schema.sql
-- 4. 004_kyc_schema.sql
-- 5. 005_admin_schema.sql
-- 6. 006_pix_payment_system.sql
-- 7. create_notifications_table.sql (já funcionou)
-- 8. 20250103_create_crypto_prices_table.sql (já funcionou)
-- 9. 007_create_storage_buckets.sql
-- 10. 008_two_factor_auth.sql (já funcionou)