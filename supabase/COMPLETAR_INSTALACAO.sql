-- SCRIPT PARA COMPLETAR A INSTALAÇÃO
-- Execute este script APÓS corrigir o erro da função dashboard_metrics

-- ========================================
-- 1. VERIFICAR O QUE JÁ FOI CRIADO
-- ========================================
-- Execute esta query para ver quais tabelas já existem:
/*
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
*/

-- ========================================
-- 2. CRIAR O QUE FALTA
-- ========================================

-- Se a tabela dashboard_metrics não existir
CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_date, metric_type)
);

-- Criar índices que podem estar faltando
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_date ON dashboard_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_type ON dashboard_metrics(metric_type);

-- ========================================
-- 3. INSERIR DADOS INICIAIS (se ainda não existirem)
-- ========================================

-- Criptomoedas padrão
INSERT INTO cryptocurrencies (symbol, name, icon_url, is_active) VALUES
  ('BTC', 'Bitcoin', '/crypto-icons/btc.png', true),
  ('ETH', 'Ethereum', '/crypto-icons/eth.png', true),
  ('USDT', 'Tether', '/crypto-icons/usdt.png', true),
  ('BNB', 'Binance Coin', '/crypto-icons/bnb.png', true),
  ('USDC', 'USD Coin', '/crypto-icons/usdc.png', true)
ON CONFLICT (symbol) DO NOTHING;

-- Categorias do blog
INSERT INTO blog_categories (name, slug, description, color, display_order) VALUES
  ('Novidades', 'novidades', 'Últimas notícias e atualizações da plataforma', '#3B82F6', 1),
  ('Educação', 'educacao', 'Artigos educacionais sobre criptomoedas e P2P', '#10B981', 2),
  ('Segurança', 'seguranca', 'Dicas de segurança e boas práticas', '#EF4444', 3),
  ('Tutoriais', 'tutoriais', 'Guias passo a passo', '#8B5CF6', 4),
  ('Mercado', 'mercado', 'Análises e tendências do mercado', '#F59E0B', 5)
ON CONFLICT (slug) DO NOTHING;

-- Tags do blog
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

-- Categorias de cursos
INSERT INTO course_categories (name, slug, description, display_order) VALUES
  ('Blockchain', 'blockchain', 'Fundamentos e aplicações de blockchain', 1),
  ('Criptomoedas', 'criptomoedas', 'Bitcoin, Ethereum e outras criptomoedas', 2),
  ('Trading', 'trading', 'Estratégias e análise técnica', 3),
  ('DeFi', 'defi', 'Finanças descentralizadas', 4),
  ('Segurança', 'seguranca', 'Segurança em crypto e boas práticas', 5),
  ('P2P', 'p2p', 'Trading P2P e estratégias', 6),
  ('Iniciantes', 'iniciantes', 'Conteúdo para quem está começando', 7)
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- 4. VERIFICAÇÃO FINAL
-- ========================================
-- Execute para confirmar que tudo foi criado:
/*
SELECT 
  'Tabelas criadas:' as info,
  COUNT(*) as total 
FROM information_schema.tables 
WHERE table_schema = 'public';

SELECT 
  'Tipos criados:' as info,
  COUNT(*) as total 
FROM pg_type t 
JOIN pg_namespace n ON t.typnamespace = n.oid 
WHERE n.nspname = 'public' AND t.typtype = 'e';

SELECT 
  'Funções criadas:' as info,
  COUNT(*) as total 
FROM information_schema.routines 
WHERE routine_schema = 'public';
*/

-- ========================================
-- 5. CRIAR USUÁRIO ADMIN
-- ========================================
-- Após fazer o cadastro no site, execute:
/*
UPDATE users_profile 
SET is_admin = true
WHERE email = 'SEU-EMAIL@gmail.com';
*/

-- 🎉 PRONTO! Agora faça o deploy!