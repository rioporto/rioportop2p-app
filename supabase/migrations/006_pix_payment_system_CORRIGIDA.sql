-- PIX Payment System Tables and Extensions (VERSÃO CORRIGIDA)
-- Usa users_profile em vez de users

-- PIX Keys table for storing seller's PIX keys
CREATE TABLE IF NOT EXISTS pix_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE, -- CORRIGIDO
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

-- PIX Payment Confirmations (manual confirmations by users)
CREATE TABLE IF NOT EXISTS pix_payment_confirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    confirmed_by UUID NOT NULL REFERENCES users_profile(id), -- CORRIGIDO
    confirmation_type TEXT NOT NULL CHECK (confirmation_type IN ('buyer', 'seller', 'admin')),
    proof_image_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(transaction_id, confirmed_by)
);

-- Enable RLS
ALTER TABLE pix_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_payment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pix_payment_confirmations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for PIX Keys
CREATE POLICY "Users can view own PIX keys" ON pix_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own PIX keys" ON pix_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PIX keys" ON pix_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PIX keys" ON pix_keys
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Buyers can view seller PIX keys in active transactions" ON pix_keys
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.seller_id = pix_keys.user_id
            AND t.buyer_id = auth.uid()
            AND t.status IN ('pending', 'processing', 'waiting_payment', 'payment_confirmed')
        )
    );

-- RLS Policies for PIX Payment Details
CREATE POLICY "Transaction parties can view payment details" ON pix_payment_details
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.id = pix_payment_details.transaction_id
            AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid())
        )
    );

CREATE POLICY "Sellers can insert payment details" ON pix_payment_details
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.id = transaction_id
            AND t.seller_id = auth.uid()
        )
    );

-- RLS Policies for Payment Confirmations
CREATE POLICY "Transaction parties can view confirmations" ON pix_payment_confirmations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.id = pix_payment_confirmations.transaction_id
            AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid())
        )
    );

CREATE POLICY "Transaction parties can add confirmations" ON pix_payment_confirmations
    FOR INSERT WITH CHECK (
        auth.uid() = confirmed_by AND
        EXISTS (
            SELECT 1 FROM transactions t
            WHERE t.id = transaction_id
            AND (t.buyer_id = auth.uid() OR t.seller_id = auth.uid())
        )
    );

-- RLS Policies for Webhooks (admin only)
CREATE POLICY "Only admins can view webhooks" ON pix_webhooks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users_profile
            WHERE id = auth.uid() AND is_admin = true
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

-- Function to validate PIX key format
CREATE OR REPLACE FUNCTION validate_pix_key(p_key_type TEXT, p_key_value TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    CASE p_key_type
        WHEN 'cpf' THEN
            -- Basic CPF validation (11 digits)
            RETURN p_key_value ~ '^\d{11}$';
        WHEN 'cnpj' THEN
            -- Basic CNPJ validation (14 digits)
            RETURN p_key_value ~ '^\d{14}$';
        WHEN 'email' THEN
            -- Basic email validation
            RETURN p_key_value ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
        WHEN 'phone' THEN
            -- Brazilian phone validation (+5511999999999)
            RETURN p_key_value ~ '^\+55\d{10,11}$';
        WHEN 'random' THEN
            -- Random key validation (UUID format)
            RETURN p_key_value ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Add validation trigger
CREATE OR REPLACE FUNCTION validate_pix_key_before_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT validate_pix_key(NEW.key_type, NEW.key_value) THEN
        RAISE EXCEPTION 'Invalid PIX key format for type %', NEW.key_type;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_pix_key_trigger
    BEFORE INSERT OR UPDATE ON pix_keys
    FOR EACH ROW
    EXECUTE FUNCTION validate_pix_key_before_insert();