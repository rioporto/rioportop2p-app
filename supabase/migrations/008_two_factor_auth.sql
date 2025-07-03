-- Create two_factor_auth table for storing 2FA settings
CREATE TABLE IF NOT EXISTS public.two_factor_auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    secret TEXT NOT NULL,
    enabled BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    backup_codes_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id)
);

-- Create backup_codes table for storing recovery codes
CREATE TABLE IF NOT EXISTS public.backup_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_two_factor_auth_user_id ON public.two_factor_auth(user_id);
CREATE INDEX idx_backup_codes_user_id ON public.backup_codes(user_id);
CREATE INDEX idx_backup_codes_used ON public.backup_codes(used);

-- RLS policies for two_factor_auth
ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 2FA settings"
    ON public.two_factor_auth
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2FA settings"
    ON public.two_factor_auth
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2FA settings"
    ON public.two_factor_auth
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 2FA settings"
    ON public.two_factor_auth
    FOR DELETE
    USING (auth.uid() = user_id);

-- RLS policies for backup_codes
ALTER TABLE public.backup_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own backup codes"
    ON public.backup_codes
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own backup codes"
    ON public.backup_codes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backup codes"
    ON public.backup_codes
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backup codes"
    ON public.backup_codes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_two_factor_auth_updated_at BEFORE UPDATE
    ON public.two_factor_auth
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Add 2FA related columns to users table if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_verified_at TIMESTAMP WITH TIME ZONE;