-- Create crypto_prices table for storing cryptocurrency price data
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

-- Create indexes for better query performance
CREATE INDEX idx_crypto_prices_symbol ON crypto_prices(symbol);
CREATE INDEX idx_crypto_prices_created_at ON crypto_prices(created_at DESC);
CREATE INDEX idx_crypto_prices_symbol_created ON crypto_prices(symbol, created_at DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on row update
CREATE TRIGGER update_crypto_prices_updated_at BEFORE UPDATE
  ON crypto_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for the latest prices
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

-- Grant permissions (adjust based on your Supabase setup)
GRANT SELECT ON crypto_prices TO anon;
GRANT SELECT ON crypto_prices TO authenticated;
GRANT INSERT, UPDATE ON crypto_prices TO service_role;
GRANT SELECT ON latest_crypto_prices TO anon;
GRANT SELECT ON latest_crypto_prices TO authenticated;