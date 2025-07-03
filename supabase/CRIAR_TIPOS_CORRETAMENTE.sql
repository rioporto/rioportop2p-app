-- CRIAR TODOS OS TIPOS NECESSÁRIOS (VERSÃO CORRETA)
-- Execute este script PRIMEIRO, antes do script principal

-- Limpar tipos existentes (se houver)
DROP TYPE IF EXISTS enrollment_status CASCADE;
DROP TYPE IF EXISTS course_status CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS kyc_status CASCADE;
DROP TYPE IF EXISTS kyc_level CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS blog_status CASCADE;
DROP TYPE IF EXISTS pix_key_type CASCADE;
DROP TYPE IF EXISTS pix_payment_status CASCADE;
DROP TYPE IF EXISTS payment_provider CASCADE;
DROP TYPE IF EXISTS course_level CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Criar todos os tipos necessários
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'failed', 'waiting_payment', 'payment_confirmed', 'disputed', 'expired');
CREATE TYPE transaction_type AS ENUM ('buy', 'sell');
CREATE TYPE payment_method AS ENUM ('PIX', 'TED', 'bank_transfer', 'cash');
CREATE TYPE kyc_status AS ENUM ('pending', 'submitted', 'under_review', 'approved', 'rejected', 'expired');
CREATE TYPE kyc_level AS ENUM ('basic', 'intermediate', 'complete');
CREATE TYPE order_status AS ENUM ('open', 'matched', 'completed', 'cancelled', 'expired');
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled', 'expired');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'scheduled', 'archived');
CREATE TYPE pix_key_type AS ENUM ('cpf', 'cnpj', 'email', 'phone', 'random');
CREATE TYPE pix_payment_status AS ENUM ('pending', 'processing', 'confirmed', 'failed', 'refunded');
CREATE TYPE payment_provider AS ENUM ('mercadopago', 'pagseguro', 'gerencianet', 'manual');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- Agora execute o SCRIPT_COMPLETO_FINAL.sql