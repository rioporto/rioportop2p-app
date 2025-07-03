-- CORREÇÕES FINAIS PARA AS MIGRATIONS
-- Execute este script no SQL Editor do Supabase

-- ========================================
-- O QUE FALTA FAZER:
-- ========================================

-- 1. PRIMEIRA COISA: Execute 001_initial_schema.sql
--    Se der erro de "type already exists", edite o arquivo e remova as linhas:
--    - CREATE TYPE transaction_status...
--    - CREATE TYPE course_level...
--    (ou outros tipos que já existam)

-- 2. DEPOIS execute este script de correções:

-- Corrigir referências em 006_pix_payment_system.sql
-- O arquivo usa "users(id)" mas deveria ser "users_profile(id)"
-- Execute esta versão corrigida:

-- PIX Keys table (versão corrigida)
CREATE TABLE IF NOT EXISTS pix_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,  -- Corrigido!
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

-- 3. Para o erro "column u.role does not exist" em 002_blog_schema.sql:
--    Execute as tabelas primeiro e depois crie a view corrigida:

DROP VIEW IF EXISTS blog_posts_view;

CREATE VIEW blog_posts_view AS
SELECT 
  bp.*,
  u.full_name as author_name,
  u.avatar_url as author_avatar,
  CASE 
    WHEN u.is_admin = true THEN 'admin'
    ELSE 'user'
  END as author_role,  -- Corrigido para usar is_admin
  bc.name as category_name,
  bc.slug as category_slug,
  array_agg(
    DISTINCT jsonb_build_object(
      'id', bt.id,
      'name', bt.name,
      'slug', bt.slug
    )
  ) FILTER (WHERE bt.id IS NOT NULL) as tags
FROM blog_posts bp
LEFT JOIN users_profile u ON bp.author_id = u.id
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
GROUP BY bp.id, u.id, bc.id;

-- 4. Criar tabela cryptocurrencies para 005_admin_schema.sql:
CREATE TABLE IF NOT EXISTS cryptocurrencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT true,
    min_amount DECIMAL(20, 8) DEFAULT 0.00000001,
    max_amount DECIMAL(20, 8) DEFAULT 1000000,
    decimal_places INTEGER DEFAULT 8,
    network_fee DECIMAL(20, 8),
    confirmation_blocks INTEGER DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir criptomoedas padrão
INSERT INTO cryptocurrencies (symbol, name, icon_url, is_active) VALUES
    ('BTC', 'Bitcoin', '/crypto-icons/btc.png', true),
    ('ETH', 'Ethereum', '/crypto-icons/eth.png', true),
    ('USDT', 'Tether', '/crypto-icons/usdt.png', true),
    ('BNB', 'Binance Coin', '/crypto-icons/bnb.png', true),
    ('USDC', 'USD Coin', '/crypto-icons/usdc.png', true)
ON CONFLICT (symbol) DO NOTHING;

-- ========================================
-- ORDEM DE EXECUÇÃO CORRETA:
-- ========================================
-- 1. Execute 001_initial_schema.sql (remova CREATE TYPE duplicados)
-- 2. Execute este script (CORRECOES_FINAIS.sql)
-- 3. Execute 002_blog_schema.sql (sem a CREATE VIEW, pois já criamos acima)
-- 4. Execute 003_courses_schema.sql (remova CREATE TYPE course_level se der erro)
-- 5. Execute 004_kyc_schema.sql
-- 6. Execute 005_admin_schema.sql
-- 7. Execute 006_pix_payment_system.sql (sem a CREATE TABLE pix_keys, pois já criamos)
-- 8. Execute 007_create_storage_buckets.sql (apenas se quiser as policies)

-- ========================================
-- JÁ FUNCIONARAM:
-- ========================================
-- ✅ create_notifications_table.sql
-- ✅ 20250103_create_crypto_prices_table.sql
-- ✅ 008_two_factor_auth.sql
-- ✅ Storage buckets criados no dashboard

-- ========================================
-- APÓS TUDO, CRIE SEU USUÁRIO ADMIN:
-- ========================================
-- Faça login no app primeiro, depois execute:
/*
UPDATE users_profile 
SET is_admin = true
WHERE email = 'seu-email@example.com';
*/