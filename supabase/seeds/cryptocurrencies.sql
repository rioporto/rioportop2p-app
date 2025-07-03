-- Seed cryptocurrencies table with popular crypto assets
INSERT INTO cryptocurrencies (symbol, name, logo_url, min_amount, max_amount, is_active, network, decimals) VALUES
  ('BTC', 'Bitcoin', '/crypto-logos/btc.svg', 0.00001, 10, true, 'Bitcoin', 8),
  ('ETH', 'Ethereum', '/crypto-logos/eth.svg', 0.0001, 100, true, 'Ethereum', 18),
  ('USDT', 'Tether', '/crypto-logos/usdt.svg', 1, 100000, true, 'Multiple', 6),
  ('BNB', 'BNB', '/crypto-logos/bnb.svg', 0.001, 50, true, 'BSC', 18),
  ('SOL', 'Solana', '/crypto-logos/sol.svg', 0.01, 1000, true, 'Solana', 9),
  ('MATIC', 'Polygon', '/crypto-logos/matic.svg', 1, 10000, true, 'Polygon', 18),
  ('DOGE', 'Dogecoin', '/crypto-logos/doge.svg', 1, 100000, true, 'Dogecoin', 8),
  ('DOT', 'Polkadot', '/crypto-logos/dot.svg', 0.1, 1000, true, 'Polkadot', 10),
  ('AVAX', 'Avalanche', '/crypto-logos/avax.svg', 0.01, 500, true, 'Avalanche', 18),
  ('LINK', 'Chainlink', '/crypto-logos/link.svg', 0.1, 1000, true, 'Ethereum', 18)
ON CONFLICT (symbol) DO UPDATE SET
  name = EXCLUDED.name,
  logo_url = EXCLUDED.logo_url,
  min_amount = EXCLUDED.min_amount,
  max_amount = EXCLUDED.max_amount,
  is_active = EXCLUDED.is_active,
  network = EXCLUDED.network,
  decimals = EXCLUDED.decimals;