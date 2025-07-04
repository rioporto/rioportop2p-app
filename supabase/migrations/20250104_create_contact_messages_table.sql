-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 1000),
    type TEXT NOT NULL CHECK (type IN ('general', 'support', 'partnership', 'complaint')),
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    replied_at TIMESTAMPTZ,
    reply_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_type ON contact_messages(type);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view all messages
CREATE POLICY "Admins can view all contact messages" ON contact_messages
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Policy for admins to update messages (mark as read, reply, etc)
CREATE POLICY "Admins can update contact messages" ON contact_messages
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = true
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comment on table
COMMENT ON TABLE contact_messages IS 'Stores contact form submissions from the website';
COMMENT ON COLUMN contact_messages.type IS 'Type of contact: general, support, partnership, complaint';
COMMENT ON COLUMN contact_messages.status IS 'Message status: new, read, replied, archived';
COMMENT ON COLUMN contact_messages.ip_address IS 'IP address of the sender for rate limiting and security';
COMMENT ON COLUMN contact_messages.user_agent IS 'Browser user agent for debugging';