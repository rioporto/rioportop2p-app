-- CORREÇÃO DO ERRO NA FUNÇÃO calculate_dashboard_metrics
-- Execute este script para corrigir o erro de sintaxe

-- Primeiro, remover a função com erro (se existir)
DROP FUNCTION IF EXISTS calculate_dashboard_metrics();

-- Criar a função corrigida
CREATE OR REPLACE FUNCTION calculate_dashboard_metrics()
RETURNS void AS $$
DECLARE
  kyc_level_counts jsonb;
  transaction_status_counts jsonb;
BEGIN
  -- Limpar métricas do dia
  DELETE FROM dashboard_metrics WHERE metric_date = CURRENT_DATE;
  
  -- Calcular contagens de KYC levels
  SELECT jsonb_object_agg(kyc_level::text, count) INTO kyc_level_counts
  FROM (
    SELECT kyc_level, COUNT(*) as count 
    FROM users_profile 
    GROUP BY kyc_level
  ) t;
  
  -- Inserir métricas de usuários
  INSERT INTO dashboard_metrics (metric_date, metric_type, metric_value)
  SELECT 
    CURRENT_DATE,
    'user_metrics',
    jsonb_build_object(
      'total_users', COUNT(*),
      'new_users_today', COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE),
      'active_users_today', COUNT(*) FILTER (WHERE DATE(last_seen_at) = CURRENT_DATE),
      'verified_users', COUNT(*) FILTER (WHERE kyc_level != 'basic'),
      'by_kyc_level', COALESCE(kyc_level_counts, '{}'::jsonb)
    )
  FROM users_profile;
  
  -- Calcular contagens de status de transações
  SELECT jsonb_object_agg(status, count) INTO transaction_status_counts
  FROM (
    SELECT status, COUNT(*) as count 
    FROM transactions 
    WHERE DATE(created_at) = CURRENT_DATE
    GROUP BY status
  ) t;
  
  -- Inserir métricas de transações
  INSERT INTO dashboard_metrics (metric_date, metric_type, metric_value)
  SELECT 
    CURRENT_DATE,
    'transaction_metrics',
    jsonb_build_object(
      'total_transactions', COUNT(*),
      'transactions_today', COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE),
      'total_volume_brl', COALESCE(SUM(total_amount), 0),
      'volume_today_brl', COALESCE(SUM(total_amount) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 0),
      'by_status', COALESCE(transaction_status_counts, '{}'::jsonb),
      'avg_transaction_value', COALESCE(AVG(total_amount), 0),
      'completed_today', COUNT(*) FILTER (WHERE status = 'completed' AND DATE(completed_at) = CURRENT_DATE)
    )
  FROM transactions;
  
  -- Inserir métricas de criptomoedas
  INSERT INTO dashboard_metrics (metric_date, metric_type, metric_value)
  SELECT 
    CURRENT_DATE,
    'crypto_metrics',
    jsonb_build_object(
      'active_cryptos', COUNT(*) FILTER (WHERE is_active = true),
      'total_market_cap_brl', COALESCE(SUM(
        (SELECT market_cap FROM crypto_prices WHERE crypto_id = c.id ORDER BY created_at DESC LIMIT 1)
      ), 0),
      'top_cryptos', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'symbol', c2.symbol,
            'price_brl', cp.price_brl,
            'change_24h', cp.change_24h
          ) ORDER BY cp.market_cap DESC
        )
        FROM cryptocurrencies c2
        JOIN LATERAL (
          SELECT * FROM crypto_prices 
          WHERE crypto_id = c2.id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) cp ON true
        LIMIT 5
      )
    )
  FROM cryptocurrencies c;
  
  -- Inserir métricas de KYC
  INSERT INTO dashboard_metrics (metric_date, metric_type, metric_value)
  SELECT 
    CURRENT_DATE,
    'kyc_metrics',
    jsonb_build_object(
      'pending_verifications', COUNT(*) FILTER (WHERE status = 'pending'),
      'approved_today', COUNT(*) FILTER (WHERE status = 'approved' AND DATE(verified_at) = CURRENT_DATE),
      'rejected_today', COUNT(*) FILTER (WHERE status = 'rejected' AND DATE(verified_at) = CURRENT_DATE),
      'total_documents', COUNT(*),
      'avg_verification_time_hours', COALESCE(
        AVG(EXTRACT(EPOCH FROM (verified_at - created_at))/3600) FILTER (WHERE verified_at IS NOT NULL),
        0
      )
    )
  FROM kyc_documents;
END;
$$ LANGUAGE plpgsql;

-- Agora continue executando o resto do SCRIPT_COMPLETO_FINAL.sql
-- Ou execute este script separado que contém apenas as partes que faltam