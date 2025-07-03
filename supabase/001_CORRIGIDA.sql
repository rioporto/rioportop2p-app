-- VERSÃO CORRIGIDA DA MIGRATION 001
-- Este arquivo adapta a migration para funcionar com a estrutura existente

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types (apenas os que não existem)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('buy', 'sell');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('PIX', 'TED', 'bank_transfer', 'cash');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('open', 'matched', 'completed', 'cancelled', 'expired');
    END IF;
END $$;

-- Adicionar colunas faltantes à users_profile existente
ALTER TABLE users_profile 
ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_trades INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS volume_traded DECIMAL(20, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS preferred_payment_methods TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb;

-- Cryptocurrencies
CREATE TABLE IF NOT EXISTS cryptocurrencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT true,
    min_amount DECIMAL(20, 8) DEFAULT 0.00000001,
    max_amount DECIMAL(20, 8) DEFAULT 1000000,
    decimal_places INTEGER DEFAULT 8,
    network_fee DECIMAL(20, 8),
    confirmation_blocks INTEGER DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    address TEXT NOT NULL,
    balance DECIMAL(20, 8) DEFAULT 0,
    locked_balance DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, crypto_id)
);

-- P2P Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    type transaction_type NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    price DECIMAL(20, 2) NOT NULL,
    min_limit DECIMAL(20, 2),
    max_limit DECIMAL(20, 2),
    payment_methods payment_method[] NOT NULL,
    payment_time_limit INTEGER DEFAULT 15, -- minutes
    status order_status DEFAULT 'open',
    terms TEXT,
    auto_reply_message TEXT,
    completed_trades INTEGER DEFAULT 0,
    remaining_amount DECIMAL(20, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    buyer_id UUID NOT NULL REFERENCES users_profile(id),
    seller_id UUID NOT NULL REFERENCES users_profile(id),
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    amount DECIMAL(20, 8) NOT NULL,
    price_per_unit DECIMAL(20, 2) NOT NULL,
    fee_amount DECIMAL(20, 2) NOT NULL,
    fee_percentage DECIMAL(5, 4) NOT NULL,
    total_amount DECIMAL(20, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    status TEXT DEFAULT 'pending',
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
    source TEXT DEFAULT 'internal',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_profile_email ON users_profile(email);
CREATE INDEX IF NOT EXISTS idx_users_profile_cpf ON users_profile(cpf);
CREATE INDEX IF NOT EXISTS idx_users_profile_is_admin ON users_profile(is_admin);

CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_crypto_id ON orders(crypto_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(type);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_transaction_id ON chat_messages(transaction_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver_id ON chat_messages(receiver_id);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adaptadas para usar is_admin)
CREATE POLICY "Users can view own wallets" ON wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view all orders" ON orders
    FOR ALL USING (true);

CREATE POLICY "Users can manage own orders" ON orders
    FOR ALL USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Users can view related transactions" ON transactions
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Users can manage own transactions" ON transactions
    FOR ALL USING (auth.uid() = buyer_id OR auth.uid() = seller_id OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Users can view related messages" ON chat_messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

CREATE POLICY "Users can send messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Everyone can view price history" ON price_history
    FOR SELECT USING (true);

CREATE POLICY "Only admins can view logs" ON admin_logs
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM users_profile WHERE id = auth.uid() AND is_admin = true
    ));

-- Insert default cryptocurrencies
INSERT INTO cryptocurrencies (symbol, name, icon_url) VALUES
    ('BTC', 'Bitcoin', '/crypto-icons/btc.png'),
    ('ETH', 'Ethereum', '/crypto-icons/eth.png'),
    ('USDT', 'Tether', '/crypto-icons/usdt.png'),
    ('BNB', 'Binance Coin', '/crypto-icons/bnb.png'),
    ('USDC', 'USD Coin', '/crypto-icons/usdc.png')
ON CONFLICT (symbol) DO NOTHING;