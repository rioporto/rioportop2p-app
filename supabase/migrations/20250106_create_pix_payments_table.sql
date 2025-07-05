-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create pix_payments table for storing PIX payment records
CREATE TABLE IF NOT EXISTS pix_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  pix_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled', 'failed')),
  qr_code TEXT,
  qr_code_text TEXT,
  is_manual BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_pix_payments_transaction_id ON pix_payments(transaction_id);
CREATE INDEX idx_pix_payments_pix_id ON pix_payments(pix_id);
CREATE INDEX idx_pix_payments_status ON pix_payments(status);

-- Enable RLS
ALTER TABLE pix_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own PIX payments" ON pix_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM transactions 
      WHERE transactions.id = pix_payments.transaction_id 
      AND (transactions.buyer_id = auth.uid() OR transactions.seller_id = auth.uid())
    )
  );

-- Admin access policy
CREATE POLICY "Admins can manage all PIX payments" ON pix_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users_profile
      WHERE users_profile.id = auth.uid()
      AND users_profile.is_admin = true
    )
  );

-- Service role can manage all PIX payments
CREATE POLICY "Service role can manage PIX payments" ON pix_payments
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create updated_at trigger
CREATE TRIGGER update_pix_payments_updated_at BEFORE UPDATE ON pix_payments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();