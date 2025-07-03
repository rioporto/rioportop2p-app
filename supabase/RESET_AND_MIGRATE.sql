-- SCRIPT COMPLETO PARA RESETAR E RECRIAR O BANCO
-- ATENÇÃO: Este script vai APAGAR TODOS OS DADOS!
-- Execute apenas se você tem certeza!

-- ================================================
-- PARTE 1: LIMPAR TUDO (DROP)
-- ================================================

-- Desabilitar temporariamente as verificações de chave estrangeira
SET session_replication_role = 'replica';

-- Drop todas as tabelas (em ordem reversa de dependência)
DROP TABLE IF EXISTS admin_activity_logs CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS admin_permissions CASCADE;
DROP TABLE IF EXISTS two_factor_backup_codes CASCADE;
DROP TABLE IF EXISTS two_factor_auth CASCADE;
DROP TABLE IF EXISTS pix_payment_confirmations CASCADE;
DROP TABLE IF EXISTS pix_payments CASCADE;
DROP TABLE IF EXISTS pix_keys CASCADE;
DROP TABLE IF EXISTS crypto_prices CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS course_progress CASCADE;
DROP TABLE IF EXISTS lesson_attachments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS course_reviews CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS blog_post_tags CASCADE;
DROP TABLE IF EXISTS blog_tags CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;
DROP TABLE IF EXISTS kyc_verifications CASCADE;
DROP TABLE IF EXISTS kyc_documents CASCADE;
DROP TABLE IF EXISTS transaction_disputes CASCADE;
DROP TABLE IF EXISTS transaction_messages CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS p2p_orders CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS users_profile CASCADE;

-- Drop todos os tipos
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS kyc_status CASCADE;
DROP TYPE IF EXISTS kyc_level CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS course_level CASCADE;
DROP TYPE IF EXISTS course_category CASCADE;
DROP TYPE IF EXISTS blog_status CASCADE;
DROP TYPE IF EXISTS pix_key_type CASCADE;
DROP TYPE IF EXISTS pix_payment_status CASCADE;
DROP TYPE IF EXISTS payment_provider CASCADE;

-- Drop funções
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Reabilitar verificações de chave estrangeira
SET session_replication_role = 'origin';

-- ================================================
-- PARTE 2: CRIAR TUDO DO ZERO
-- ================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Agora execute as migrations na ordem:
-- 1. 001_initial_schema.sql
-- 2. 002_blog_schema.sql
-- 3. 003_courses_schema.sql
-- 4. 004_kyc_schema.sql
-- 5. 005_admin_schema.sql
-- 6. 006_pix_payment_system.sql
-- 7. create_notifications_table.sql
-- 8. 20250103_create_crypto_prices_table.sql
-- 9. 007_create_storage_buckets.sql (executar apenas a parte SQL, não os comandos do storage)
-- 10. 008_two_factor_auth.sql

-- ================================================
-- PARTE 3: CRIAR USUÁRIO ADMIN (após todas as migrations)
-- ================================================
-- Após executar todas as migrations e criar seu primeiro usuário, execute:
/*
UPDATE users_profile 
SET 
    role = 'admin',
    kyc_level = 'complete',
    kyc_verified_at = NOW()
WHERE email = 'seu-email@example.com';
*/