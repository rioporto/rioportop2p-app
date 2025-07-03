-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'failed');
CREATE TYPE transaction_type AS ENUM ('buy', 'sell');
CREATE TYPE payment_method AS ENUM ('PIX', 'TED', 'bank_transfer', 'cash');
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
CREATE TYPE kyc_level AS ENUM ('basic', 'intermediate', 'complete');
CREATE TYPE order_status AS ENUM ('open', 'matched', 'completed', 'cancelled', 'expired');
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');

-- Users Profile (extends auth.users)
CREATE TABLE IF NOT EXISTS users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    cpf TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    kyc_level kyc_level DEFAULT 'basic',
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    reputation_score INTEGER DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    volume_traded DECIMAL(20, 2) DEFAULT 0,
    is_online BOOLEAN DEFAULT false,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferred_payment_methods payment_method[] DEFAULT '{}',
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC Documents
CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'identity', 'address', 'selfie', 'income'
    document_url TEXT NOT NULL,
    document_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    status kyc_status DEFAULT 'pending',
    verified_by UUID REFERENCES users_profile(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cryptocurrencies supported
CREATE TABLE IF NOT EXISTS cryptocurrencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    min_amount DECIMAL(20, 8) NOT NULL,
    max_amount DECIMAL(20, 8) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    network TEXT,
    contract_address TEXT,
    decimals INTEGER DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders (P2P Order Book)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    crypto_amount DECIMAL(20, 8) NOT NULL,
    fiat_amount DECIMAL(20, 2) NOT NULL,
    price_per_unit DECIMAL(20, 2) NOT NULL,
    min_limit DECIMAL(20, 2),
    max_limit DECIMAL(20, 2),
    payment_methods payment_method[] NOT NULL,
    payment_time_limit INTEGER DEFAULT 30, -- minutes
    terms TEXT,
    status order_status DEFAULT 'open',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    buyer_id UUID NOT NULL REFERENCES users_profile(id),
    seller_id UUID NOT NULL REFERENCES users_profile(id),
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    type transaction_type NOT NULL,
    crypto_amount DECIMAL(20, 8) NOT NULL,
    fiat_amount DECIMAL(20, 2) NOT NULL,
    price_per_unit DECIMAL(20, 2) NOT NULL,
    fee_amount DECIMAL(20, 2) NOT NULL,
    fee_percentage DECIMAL(5, 4) NOT NULL,
    total_amount DECIMAL(20, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    status transaction_status DEFAULT 'pending',
    payment_proof_url TEXT,
    payment_confirmed_at TIMESTAMP WITH TIME ZONE,
    crypto_tx_hash TEXT,
    crypto_released_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES users_profile(id),
    cancellation_reason TEXT,
    dispute_id UUID,
    rating_buyer INTEGER CHECK (rating_buyer >= 1 AND rating_buyer <= 5),
    rating_seller INTEGER CHECK (rating_seller >= 1 AND rating_seller <= 5),
    feedback_buyer TEXT,
    feedback_seller TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users_profile(id),
    receiver_id UUID NOT NULL REFERENCES users_profile(id),
    message TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price History
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    price_brl DECIMAL(20, 2) NOT NULL,
    price_usd DECIMAL(20, 2),
    volume_24h DECIMAL(20, 2),
    change_24h DECIMAL(10, 4),
    market_cap DECIMAL(20, 2),
    source TEXT DEFAULT 'internal', -- 'internal', 'binance', 'coinmarketcap'
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'transaction', 'kyc', 'price_alert', 'system'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Activity Logs
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users_profile(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_profile_email ON users_profile(email);
CREATE INDEX idx_users_profile_cpf ON users_profile(cpf);
CREATE INDEX idx_users_profile_role ON users_profile(role);
CREATE INDEX idx_users_profile_kyc_level ON users_profile(kyc_level);

CREATE INDEX idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX idx_kyc_documents_status ON kyc_documents(status);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_crypto_id ON orders(crypto_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_type ON orders(type);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

CREATE INDEX idx_chat_messages_transaction_id ON chat_messages(transaction_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_receiver_id ON chat_messages(receiver_id);

CREATE INDEX idx_price_history_crypto_id ON price_history(crypto_id);
CREATE INDEX idx_price_history_recorded_at ON price_history(recorded_at DESC);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON kyc_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cryptocurrencies_updated_at BEFORE UPDATE ON cryptocurrencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default cryptocurrencies
INSERT INTO cryptocurrencies (symbol, name, logo_url, min_amount, max_amount, decimals) VALUES
    ('BTC', 'Bitcoin', '/crypto-logos/btc.png', 0.00001, 10, 8),
    ('ETH', 'Ethereum', '/crypto-logos/eth.png', 0.0001, 100, 18),
    ('USDT', 'Tether', '/crypto-logos/usdt.png', 1, 100000, 6),
    ('BNB', 'Binance Coin', '/crypto-logos/bnb.png', 0.001, 1000, 18),
    ('SOL', 'Solana', '/crypto-logos/sol.png', 0.01, 10000, 9),
    ('XRP', 'Ripple', '/crypto-logos/xrp.png', 1, 100000, 6),
    ('ADA', 'Cardano', '/crypto-logos/ada.png', 1, 100000, 6),
    ('DOGE', 'Dogecoin', '/crypto-logos/doge.png', 1, 1000000, 8)
ON CONFLICT (symbol) DO NOTHING;

-- Row Level Security Policies
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY users_profile_policy ON users_profile
    FOR ALL USING (auth.uid() = id OR role = 'admin' OR role = 'moderator');

-- Users can manage their own KYC documents
CREATE POLICY kyc_documents_policy ON kyc_documents
    FOR ALL USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    ));

-- Users can see all open orders and manage their own
CREATE POLICY orders_select_policy ON orders
    FOR SELECT USING (status = 'open' OR user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    ));

CREATE POLICY orders_modify_policy ON orders
    FOR ALL USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    ));

-- Users can see their own transactions
CREATE POLICY transactions_policy ON transactions
    FOR ALL USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    ));

-- Users can see messages from their transactions
CREATE POLICY chat_messages_policy ON chat_messages
    FOR ALL USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    ));

-- Users can see their own notifications
CREATE POLICY notifications_policy ON notifications
    FOR ALL USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    ));