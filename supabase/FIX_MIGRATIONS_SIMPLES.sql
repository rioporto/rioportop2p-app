-- SCRIPT SIMPLIFICADO PARA CORRIGIR AS MIGRATIONS
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar e criar a tabela users_profile se não existir
CREATE TABLE IF NOT EXISTS users_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    cpf TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    kyc_level INTEGER DEFAULT 1,
    kyc_status TEXT DEFAULT 'pending',
    reputation_score INTEGER DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Agora você pode executar as seguintes migrations que falharam:
-- - 002_blog_schema.sql
-- - 003_courses_schema.sql (remova CREATE TYPE course_level se já existir)
-- - 004_kyc_schema.sql
-- - 005_admin_schema.sql

-- 3. Para a migration 006_pix_payment_system.sql, você tem duas opções:

-- OPÇÃO A: Modificar o arquivo para usar buyer_id e seller_id (recomendado)
-- Edite o arquivo e substitua:
-- "transactions.user_id" por "transactions.buyer_id"
-- "transactions.partner_id" por "transactions.seller_id"

-- OPÇÃO B: Executar este comando antes da migration 006:
-- (NÃO RECOMENDADO se você já tem dados)
/*
ALTER TABLE transactions 
    RENAME COLUMN buyer_id TO user_id;
ALTER TABLE transactions 
    RENAME COLUMN seller_id TO partner_id;
*/

-- 4. Para o arquivo 007_create_storage_buckets.sql:
-- Execute apenas os comandos SQL, ignore os comandos de storage
-- Os buckets devem ser criados manualmente no dashboard do Supabase

-- RESUMO DO QUE JÁ FUNCIONOU:
-- ✅ create_notifications_table.sql
-- ✅ 20250103_create_crypto_prices_table.sql  
-- ✅ 008_two_factor_auth.sql

-- APÓS EXECUTAR TUDO, CRIE OS STORAGE BUCKETS NO DASHBOARD:
-- 1. Vá para Storage no Supabase
-- 2. Crie os seguintes buckets:
--    - kyc-documents (privado)
--    - payment-proofs (privado)
--    - avatars (público)
--    - crypto-logos (público)
--    - blog-images (público)
--    - course-materials (privado)