-- PIX Payment System Tables and Extensions

-- PIX Keys table for storing seller's PIX keys
CREATE TABLE IF NOT EXISTS pix_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_type TEXT NOT NULL CHECK (key_type IN ('cpf', 'cnpj', 'email', 'phone', 'random')),
    key_value TEXT NOT NULL,
    bank_name TEXT,
    account_holder_name TEXT NOT NULL,
    account_holder_document TEXT NOT NULL, -- CPF or CNPJ
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, key_type, key_value)
);

-- PIX Payment Details table for storing transaction-specific PIX info
CREATE TABLE IF NOT EXISTS pix_payment_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    pix_key_id UUID REFERENCES pix_keys(id),
    pix_key_type TEXT NOT NULL,
    pix_key_value TEXT NOT NULL,
    bank_name TEXT,
    account_holder_name TEXT NOT NULL,
    qr_code_string TEXT, -- EMV code for QR code generation
    qr_code_image_url TEXT, -- Pre-generated QR code image URL
    payment_id TEXT, -- External payment provider ID
    end_to_end_id TEXT, -- E2E ID from PIX transaction
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PIX Webhooks table for tracking payment confirmations
CREATE TABLE IF NOT EXISTS pix_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL, -- 'mercadopago', 'pagseguro', 'manual', etc
    webhook_id TEXT UNIQUE,
    transaction_id UUID REFERENCES transactions(id),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add PIX-specific columns to transactions table if they don't exist
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS pix_payment_details_id UUID REFERENCES pix_payment_details(id),
ADD COLUMN IF NOT EXISTS pix_end_to_end_id TEXT,
ADD COLUMN IF NOT EXISTS pix_provider TEXT CHECK (pix_provider IN ('mercadopago', 'pagseguro', 'gerencianet', 'banco_inter', 'manual'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pix_keys_user_id ON pix_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_pix_keys_active ON pix_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_pix_payment_details_transaction_id ON pix_payment_details(transaction_id);
CREATE INDEX IF NOT EXISTS idx_pix_webhooks_transaction_id ON pix_webhooks(transaction_id);
CREATE INDEX IF NOT EXISTS idx_pix_webhooks_webhook_id ON pix_webhooks(webhook_id);
CREATE INDEX IF NOT EXISTS idx_transactions_pix_payment_details_id ON transactions(pix_payment_details_id);

-- Enable RLS
ALTER TABLE pix_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_payment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pix_keys
CREATE POLICY "Users can view their own PIX keys" ON pix_keys
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own PIX keys" ON pix_keys
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own PIX keys" ON pix_keys
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own PIX keys" ON pix_keys
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for pix_payment_details
CREATE POLICY "Users can view PIX details for their transactions" ON pix_payment_details
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transactions
            WHERE transactions.id = pix_payment_details.transaction_id
            AND (transactions.buyer_id = auth.uid() OR transactions.seller_id = auth.uid())
        )
    );

-- RLS Policies for pix_webhooks (admin only for security)
CREATE POLICY "Only admins can view webhooks" ON pix_webhooks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users_profile
            WHERE users_profile.id = auth.uid()
            AND users_profile.role = 'admin'
        )
    );

-- Update triggers
CREATE TRIGGER update_pix_keys_updated_at BEFORE UPDATE ON pix_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pix_payment_details_updated_at BEFORE UPDATE ON pix_payment_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate PIX QR Code string (EMV format)
CREATE OR REPLACE FUNCTION generate_pix_qr_code_string(
    p_key_type TEXT,
    p_key_value TEXT,
    p_receiver_name TEXT,
    p_receiver_city TEXT,
    p_amount DECIMAL,
    p_transaction_id TEXT
) RETURNS TEXT AS $$
DECLARE
    v_payload TEXT;
    v_merchant_account TEXT;
    v_merchant_info TEXT;
    v_transaction_info TEXT;
    v_amount_str TEXT;
BEGIN
    -- This is a simplified version. In production, use a proper PIX library
    -- Format: ID|Length|Value
    
    -- Payload Format Indicator
    v_payload := '00' || '02' || '01';
    
    -- Merchant Account Information
    v_merchant_account := '00' || 'BR.GOV.BCB.PIX' || '01' || to_char(length(p_key_value), 'FM00') || p_key_value;
    v_merchant_info := '26' || to_char(length(v_merchant_account), 'FM00') || v_merchant_account;
    
    -- Merchant Category Code
    v_payload := v_payload || '52' || '04' || '0000';
    
    -- Transaction Currency (BRL)
    v_payload := v_payload || '53' || '03' || '986';
    
    -- Transaction Amount
    IF p_amount > 0 THEN
        v_amount_str := to_char(p_amount, 'FM999999999.00');
        v_payload := v_payload || '54' || to_char(length(v_amount_str), 'FM00') || v_amount_str;
    END IF;
    
    -- Country Code
    v_payload := v_payload || '58' || '02' || 'BR';
    
    -- Merchant Name
    v_payload := v_payload || '59' || to_char(length(p_receiver_name), 'FM00') || p_receiver_name;
    
    -- Merchant City
    v_payload := v_payload || '60' || to_char(length(p_receiver_city), 'FM00') || p_receiver_city;
    
    -- Additional Data Field Template
    IF p_transaction_id IS NOT NULL THEN
        v_transaction_info := '05' || to_char(length(p_transaction_id), 'FM00') || p_transaction_id;
        v_payload := v_payload || '62' || to_char(length(v_transaction_info), 'FM00') || v_transaction_info;
    END IF;
    
    -- CRC16 would be calculated here in a real implementation
    v_payload := v_payload || '63' || '04' || 'ABCD';
    
    RETURN v_payload;
END;
$$ LANGUAGE plpgsql;