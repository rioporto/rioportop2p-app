-- Admin Schema for Rio Porto P2P
-- Complete administrative dashboard tables and functions

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

-- FAQ management
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

CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id),
  message TEXT NOT NULL,
  attachments JSONB,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System notifications templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  channel VARCHAR(50) NOT NULL CHECK (channel IN ('email', 'sms', 'push', 'in_app')),
  subject VARCHAR(255),
  template TEXT NOT NULL,
  variables JSONB, -- Available variables for the template
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crypto price management
CREATE TABLE IF NOT EXISTS crypto_price_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  api_endpoint TEXT NOT NULL,
  api_key_setting VARCHAR(100), -- Reference to admin_settings
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  rate_limit INTEGER, -- requests per minute
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crypto_price_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
  price_adjustment_type VARCHAR(20) CHECK (price_adjustment_type IN ('fixed', 'percentage')),
  price_adjustment_value DECIMAL(10,4),
  buy_spread DECIMAL(5,4) DEFAULT 0, -- Additional spread for buy orders
  sell_spread DECIMAL(5,4) DEFAULT 0, -- Additional spread for sell orders
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

-- Platform statistics views
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

-- Transaction analytics view
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

-- User growth view
CREATE OR REPLACE VIEW user_growth_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as new_users,
  COUNT(*) FILTER (WHERE kyc_level != 'basic') as verified_users,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('day', created_at)) as cumulative_users
FROM users_profile
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Functions
-- Generate ticket number
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

-- Calculate platform metrics
CREATE OR REPLACE FUNCTION calculate_daily_metrics()
RETURNS void AS $$
BEGIN
  -- Delete existing metrics for today
  DELETE FROM dashboard_metrics WHERE metric_date = CURRENT_DATE;
  
  -- User metrics
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
  
  -- Transaction metrics
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
  
  -- Order metrics
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

-- Admin dashboard search function
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
  -- Search users
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
  
  -- Search transactions
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
  
  -- Search orders
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

-- Triggers
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_faq_categories_updated_at
  BEFORE UPDATE ON faq_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON faq_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER generate_ticket_number_trigger
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL)
  EXECUTE FUNCTION generate_ticket_number();

-- RLS Policies
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

-- Admin only policies
CREATE POLICY "Admins can manage settings" ON admin_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Public can view FAQ
CREATE POLICY "Public can view FAQ categories" ON faq_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view FAQ items" ON faq_items
  FOR SELECT USING (is_active = true);

-- Users can view own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users_profile
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ));

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Initial data
INSERT INTO admin_settings (key, value, description, category) VALUES
  ('platform_name', '"Rio Porto P2P"', 'Nome da plataforma', 'general'),
  ('platform_fee_percentage', '3.5', 'Taxa da plataforma em porcentagem', 'fees'),
  ('min_transaction_amount', '10', 'Valor mínimo de transação em BRL', 'limits'),
  ('max_transaction_amount', '50000', 'Valor máximo de transação em BRL', 'limits'),
  ('kyc_auto_approve', 'false', 'Aprovar KYC automaticamente', 'kyc'),
  ('maintenance_mode', 'false', 'Modo de manutenção', 'general'),
  ('support_email', '"suporte@rioportop2p.com"', 'Email de suporte', 'contact'),
  ('support_whatsapp', '"+5521999999999"', 'WhatsApp de suporte', 'contact');

INSERT INTO faq_categories (name, slug, description, order_index) VALUES
  ('Começando', 'comecando', 'Primeiros passos na plataforma', 1),
  ('Segurança', 'seguranca', 'Dicas e práticas de segurança', 2),
  ('Transações', 'transacoes', 'Como comprar e vender', 3),
  ('KYC', 'kyc', 'Verificação de identidade', 4),
  ('Taxas', 'taxas', 'Taxas e limites', 5),
  ('Problemas', 'problemas', 'Resolução de problemas', 6);

INSERT INTO notification_templates (code, name, channel, subject, template, variables) VALUES
  ('welcome_email', 'Email de Boas Vindas', 'email', 'Bem-vindo ao Rio Porto P2P', 
   'Olá {{name}}, bem-vindo ao Rio Porto P2P! Sua conta foi criada com sucesso.', 
   '{"name": "Nome do usuário"}'::jsonb),
  ('transaction_created', 'Transação Criada', 'in_app', NULL,
   'Nova transação de {{type}} de {{crypto}} no valor de R$ {{amount}}',
   '{"type": "Tipo da transação", "crypto": "Criptomoeda", "amount": "Valor"}'::jsonb),
  ('kyc_approved', 'KYC Aprovado', 'email', 'Sua verificação foi aprovada!',
   'Parabéns {{name}}! Sua verificação de nível {{level}} foi aprovada.',
   '{"name": "Nome do usuário", "level": "Nível KYC"}'::jsonb);