-- SCRIPT FINAL PARA CORRIGIR AS MIGRATIONS
-- Execute este script no SQL Editor do Supabase

-- ===================================================
-- PASSO 1: Executar PRIMEIRO a migration 001_initial_schema.sql
-- ===================================================
-- IMPORTANTE: Execute o arquivo 001_initial_schema.sql ANTES de continuar!
-- Se der erro de "type already exists", remova as linhas CREATE TYPE que já existem

-- ===================================================
-- PASSO 2: Corrigir erro na 002_blog_schema.sql
-- ===================================================
-- O erro acontece porque a coluna 'role' está em users_profile, não em auth.users
-- Execute este comando para corrigir a view:

DROP VIEW IF EXISTS blog_posts_view;

CREATE VIEW blog_posts_view AS
SELECT 
  bp.*,
  u.full_name as author_name,
  u.avatar_url as author_avatar,
  u.is_admin as author_is_admin,  -- Mudado de u.role para u.is_admin
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

-- ===================================================
-- PASSO 3: Para 004_kyc_schema.sql
-- ===================================================
-- O erro mostra que kyc_documents não existe
-- Verifique se a tabela foi criada na 001_initial_schema.sql
-- Se não foi criada, execute isto primeiro:

CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_url TEXT NOT NULL,
    document_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    status TEXT DEFAULT 'pending',
    verified_by UUID REFERENCES users_profile(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================
-- PASSO 4: Para 005_admin_schema.sql
-- ===================================================
-- Criar a tabela cryptocurrencies que está faltando:

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

-- Inserir algumas criptomoedas padrão
INSERT INTO cryptocurrencies (symbol, name, icon_url, is_active) VALUES
    ('BTC', 'Bitcoin', '/crypto-icons/btc.png', true),
    ('ETH', 'Ethereum', '/crypto-icons/eth.png', true),
    ('USDT', 'Tether', '/crypto-icons/usdt.png', true),
    ('BNB', 'Binance Coin', '/crypto-icons/bnb.png', true),
    ('USDC', 'USD Coin', '/crypto-icons/usdc.png', true)
ON CONFLICT (symbol) DO NOTHING;

-- ===================================================
-- PASSO 5: Sobre transactions.buyer_id e seller_id
-- ===================================================
-- Estes não são arquivos! São colunas da tabela transactions
-- Você precisa editar os arquivos:
-- - 006_pix_payment_system.sql
-- - 007_create_storage_buckets.sql
-- 
-- E substituir no texto desses arquivos:
-- "transactions.user_id" por "transactions.buyer_id"
-- "transactions.partner_id" por "transactions.seller_id"

-- ===================================================
-- ORDEM CORRETA DE EXECUÇÃO:
-- ===================================================
-- 1. Execute 001_initial_schema.sql (se ainda não executou)
-- 2. Execute este script (FIX_FINAL_MIGRATIONS.sql)
-- 3. Execute 002_blog_schema.sql (depois da correção acima)
-- 4. Execute 003_courses_schema.sql (remova CREATE TYPE course_level se der erro)
-- 5. Execute 004_kyc_schema.sql
-- 6. Execute 005_admin_schema.sql
-- 7. Edite e execute 006_pix_payment_system.sql
-- 8. Edite e execute 007_create_storage_buckets.sql (só a parte SQL)

-- As outras já estão OK:
-- ✅ create_notifications_table.sql
-- ✅ 20250103_create_crypto_prices_table.sql
-- ✅ 008_two_factor_auth.sql
-- ✅ Storage buckets criados