-- Create escrow_transactions table
CREATE TABLE IF NOT EXISTS escrow_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  crypto_amount DECIMAL(20, 8) NOT NULL,
  crypto_currency VARCHAR(10) NOT NULL,
  fiat_amount DECIMAL(20, 2) NOT NULL,
  fiat_currency VARCHAR(10) NOT NULL DEFAULT 'BRL',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  escrow_address VARCHAR(255),
  funded_at TIMESTAMPTZ,
  payment_confirmed_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  disputed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT escrow_status_check CHECK (status IN (
    'pending', 
    'funded', 
    'payment_pending', 
    'payment_confirmed', 
    'completed', 
    'disputed', 
    'cancelled'
  ))
);

-- Create escrow_disputes table
CREATE TABLE IF NOT EXISTS escrow_disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  escrow_id UUID REFERENCES escrow_transactions(id) ON DELETE CASCADE,
  disputed_by UUID REFERENCES users_profile(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  resolution TEXT,
  resolved_by UUID REFERENCES users_profile(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT dispute_status_check CHECK (status IN (
    'open',
    'under_review',
    'resolved',
    'escalated'
  ))
);

-- Create escrow_logs table for audit trail
CREATE TABLE IF NOT EXISTS escrow_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  escrow_id UUID REFERENCES escrow_transactions(id) ON DELETE CASCADE,
  event VARCHAR(100) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_escrow_transactions_status ON escrow_transactions(status);
CREATE INDEX idx_escrow_transactions_transaction_id ON escrow_transactions(transaction_id);
CREATE INDEX idx_escrow_transactions_seller_id ON escrow_transactions(seller_id);
CREATE INDEX idx_escrow_transactions_buyer_id ON escrow_transactions(buyer_id);
CREATE INDEX idx_escrow_transactions_expires_at ON escrow_transactions(expires_at);
CREATE INDEX idx_escrow_disputes_escrow_id ON escrow_disputes(escrow_id);
CREATE INDEX idx_escrow_disputes_status ON escrow_disputes(status);
CREATE INDEX idx_escrow_logs_escrow_id ON escrow_logs(escrow_id);
CREATE INDEX idx_escrow_logs_event ON escrow_logs(event);

-- Add RLS policies
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_logs ENABLE ROW LEVEL SECURITY;

-- Escrow transactions policies
CREATE POLICY "Users can view their own escrow transactions"
  ON escrow_transactions FOR SELECT
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

CREATE POLICY "Only system can insert escrow transactions"
  ON escrow_transactions FOR INSERT
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can update their own escrow transactions"
  ON escrow_transactions FOR UPDATE
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Escrow disputes policies
CREATE POLICY "Users can view disputes for their escrows"
  ON escrow_disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM escrow_transactions 
      WHERE id = escrow_disputes.escrow_id 
      AND (seller_id = auth.uid() OR buyer_id = auth.uid())
    )
  );

CREATE POLICY "Users can create disputes for their escrows"
  ON escrow_disputes FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM escrow_transactions 
      WHERE id = escrow_disputes.escrow_id 
      AND (seller_id = auth.uid() OR buyer_id = auth.uid())
    )
  );

-- Escrow logs policies (read-only for users)
CREATE POLICY "Users can view logs for their escrows"
  ON escrow_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM escrow_transactions 
      WHERE id = escrow_logs.escrow_id 
      AND (seller_id = auth.uid() OR buyer_id = auth.uid())
    )
  );

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_escrow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_escrow_transactions_updated_at
  BEFORE UPDATE ON escrow_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

CREATE TRIGGER update_escrow_disputes_updated_at
  BEFORE UPDATE ON escrow_disputes
  FOR EACH ROW
  EXECUTE FUNCTION update_escrow_updated_at();

-- Add comment for documentation
COMMENT ON TABLE escrow_transactions IS 'Stores escrow information for secure P2P transactions';
COMMENT ON TABLE escrow_disputes IS 'Stores dispute information for escrow transactions';
COMMENT ON TABLE escrow_logs IS 'Audit trail for all escrow-related events';