-- ============================================
-- SCRIPT PARA EXECUTAR MIGRATIONS FALTANTES
-- Execute este script no Supabase Dashboard
-- ============================================

-- 1. NOTIFICATIONS TABLE
-- ============================================
-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('transaction', 'kyc', 'course', 'system', 'p2p_trade', 'price_alert')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can view own notifications" ON public.notifications
            FOR SELECT
            USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can update own notifications" ON public.notifications
            FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own notifications' AND tablename = 'notifications') THEN
        CREATE POLICY "Users can delete own notifications" ON public.notifications
            FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 2. TWO FACTOR AUTH
-- ============================================
-- Create two_factor_auth table
CREATE TABLE IF NOT EXISTS public.two_factor_auth (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    secret TEXT NOT NULL,
    enabled BOOLEAN DEFAULT false,
    backup_codes TEXT[] DEFAULT '{}',
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_user_id ON public.two_factor_auth(user_id);
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_enabled ON public.two_factor_auth(enabled);

-- Enable RLS
ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own 2FA settings' AND tablename = 'two_factor_auth') THEN
        CREATE POLICY "Users can view own 2FA settings" ON public.two_factor_auth
            FOR SELECT
            USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own 2FA settings' AND tablename = 'two_factor_auth') THEN
        CREATE POLICY "Users can update own 2FA settings" ON public.two_factor_auth
            FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own 2FA settings' AND tablename = 'two_factor_auth') THEN
        CREATE POLICY "Users can insert own 2FA settings" ON public.two_factor_auth
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Grant permissions
GRANT ALL ON public.two_factor_auth TO authenticated;
GRANT ALL ON public.two_factor_auth TO service_role;

-- 3. PIX KEYS
-- ============================================
-- Create pix_keys table
CREATE TABLE IF NOT EXISTS public.pix_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    key_type TEXT NOT NULL CHECK (key_type IN ('cpf', 'cnpj', 'email', 'phone', 'random')),
    key_value TEXT NOT NULL,
    bank_name TEXT,
    account_holder_name TEXT NOT NULL,
    account_holder_document TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pix_keys_user_id ON public.pix_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_pix_keys_is_active ON public.pix_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_pix_keys_key_type ON public.pix_keys(key_type);

-- Enable RLS
ALTER TABLE public.pix_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own PIX keys' AND tablename = 'pix_keys') THEN
        CREATE POLICY "Users can view own PIX keys" ON public.pix_keys
            FOR SELECT
            USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own PIX keys' AND tablename = 'pix_keys') THEN
        CREATE POLICY "Users can insert own PIX keys" ON public.pix_keys
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own PIX keys' AND tablename = 'pix_keys') THEN
        CREATE POLICY "Users can update own PIX keys" ON public.pix_keys
            FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own PIX keys' AND tablename = 'pix_keys') THEN
        CREATE POLICY "Users can delete own PIX keys" ON public.pix_keys
            FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Grant permissions
GRANT ALL ON public.pix_keys TO authenticated;
GRANT ALL ON public.pix_keys TO service_role;

-- 4. CRYPTO PRICES
-- ============================================
-- Create crypto_prices table
CREATE TABLE IF NOT EXISTS public.crypto_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    price_usd DECIMAL(20,8) NOT NULL,
    price_brl DECIMAL(20,8) NOT NULL,
    change_24h DECIMAL(10,2),
    volume_24h DECIMAL(20,2),
    market_cap DECIMAL(20,2),
    last_updated TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(symbol, last_updated)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_crypto_prices_symbol ON public.crypto_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_last_updated ON public.crypto_prices(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_crypto_prices_created_at ON public.crypto_prices(created_at DESC);

-- Enable RLS
ALTER TABLE public.crypto_prices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (read-only for all authenticated users)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view crypto prices' AND tablename = 'crypto_prices') THEN
        CREATE POLICY "Anyone can view crypto prices" ON public.crypto_prices
            FOR SELECT
            USING (true);
    END IF;
END $$;

-- Grant permissions
GRANT SELECT ON public.crypto_prices TO authenticated;
GRANT ALL ON public.crypto_prices TO service_role;

-- 5. CONTACT MESSAGES (bonus - já estava no arquivo)
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
    replied_at TIMESTAMPTZ,
    reply_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Grant permissions
GRANT SELECT ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
-- Lista todas as tabelas criadas
SELECT 'Tabelas criadas com sucesso:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('notifications', 'two_factor_auth', 'pix_keys', 'crypto_prices', 'contact_messages')
ORDER BY table_name;