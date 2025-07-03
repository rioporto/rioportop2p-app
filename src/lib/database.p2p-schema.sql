-- P2P Trading Tables Extension
-- This file contains additional tables needed for P2P trading functionality

-- Cryptocurrencies table
CREATE TABLE IF NOT EXISTS cryptocurrencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    min_amount DECIMAL(20, 8) DEFAULT 0.00000001,
    max_amount DECIMAL(20, 8) DEFAULT 1000000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles extension for P2P
CREATE TABLE IF NOT EXISTS users_profile (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    reputation_score DECIMAL(3, 2) DEFAULT 5.00 CHECK (reputation_score >= 0 AND reputation_score <= 5),
    total_trades INTEGER DEFAULT 0,
    successful_trades INTEGER DEFAULT 0,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- P2P Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matched', 'completed', 'cancelled', 'expired')),
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    crypto_amount DECIMAL(20, 8) NOT NULL CHECK (crypto_amount > 0),
    fiat_amount DECIMAL(20, 2) NOT NULL CHECK (fiat_amount > 0),
    price_per_unit DECIMAL(20, 2) NOT NULL CHECK (price_per_unit > 0),
    min_limit DECIMAL(20, 2),
    max_limit DECIMAL(20, 2),
    payment_methods TEXT[] NOT NULL,
    payment_time_limit INTEGER DEFAULT 30, -- minutes
    terms TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_limits CHECK (
        (min_limit IS NULL AND max_limit IS NULL) OR
        (min_limit IS NOT NULL AND max_limit IS NOT NULL AND min_limit <= max_limit)
    )
);

-- P2P Transactions table (matches between orders)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 
        'payment_sent', 
        'payment_confirmed', 
        'completed', 
        'cancelled', 
        'disputed'
    )),
    crypto_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    crypto_amount DECIMAL(20, 8) NOT NULL CHECK (crypto_amount > 0),
    fiat_amount DECIMAL(20, 2) NOT NULL CHECK (fiat_amount > 0),
    price_per_unit DECIMAL(20, 2) NOT NULL CHECK (price_per_unit > 0),
    payment_method TEXT NOT NULL,
    payment_deadline TIMESTAMPTZ NOT NULL,
    payment_proof_url TEXT,
    payment_sent_at TIMESTAMPTZ,
    payment_confirmed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    disputed_at TIMESTAMPTZ,
    dispute_reason TEXT,
    escrow_address TEXT,
    escrow_tx_hash TEXT,
    release_tx_hash TEXT,
    buyer_crypto_address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT buyer_seller_different CHECK (buyer_id != seller_id)
);

-- Transaction messages/chat
CREATE TABLE IF NOT EXISTS transaction_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    attachment_url TEXT,
    attachment_type TEXT,
    is_system_message BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes table
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    reporter_id UUID NOT NULL REFERENCES users(id),
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_urls TEXT[],
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'closed')),
    resolution TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_crypto_id ON orders(crypto_id);
CREATE INDEX idx_orders_type ON orders(type);
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transaction_messages_transaction_id ON transaction_messages(transaction_id);
CREATE INDEX idx_disputes_transaction_id ON disputes(transaction_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view all open orders" ON orders
    FOR SELECT USING (status = 'open' OR user_id = auth.uid());

CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own orders" ON orders
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can create transactions" ON transactions
    FOR INSERT WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can update their own transactions" ON transactions
    FOR UPDATE USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- RLS Policies for transaction messages
CREATE POLICY "Users can view messages for their transactions" ON transaction_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transactions
            WHERE transactions.id = transaction_messages.transaction_id
            AND (transactions.buyer_id = auth.uid() OR transactions.seller_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their transactions" ON transaction_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM transactions
            WHERE transactions.id = transaction_messages.transaction_id
            AND (transactions.buyer_id = auth.uid() OR transactions.seller_id = auth.uid())
        )
    );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Trigger to update timestamps
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_profile_updated_at BEFORE UPDATE ON users_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cryptocurrencies_updated_at BEFORE UPDATE ON cryptocurrencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();