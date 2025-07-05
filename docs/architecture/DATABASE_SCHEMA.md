# RioPorto P2P - Database Schema Documentation

This document provides comprehensive documentation of the database schema for the RioPorto P2P platform.

## Table of Contents

1. [Overview](#overview)
2. [Database Architecture](#database-architecture)
3. [Core Tables](#core-tables)
4. [Supporting Tables](#supporting-tables)
5. [Storage Buckets](#storage-buckets)
6. [Indexes and Performance](#indexes-and-performance)
7. [Row Level Security (RLS)](#row-level-security-rls)
8. [Triggers and Functions](#triggers-and-functions)
9. [Migrations](#migrations)
10. [Best Practices](#best-practices)

## Overview

The RioPorto P2P platform uses PostgreSQL via Supabase as its primary database. The schema is designed to support:

- Multi-level user authentication and KYC
- P2P cryptocurrency trading
- PIX payment integration
- Real-time notifications
- Content management (blog and courses)
- Administrative functions

## Database Architecture

### Technology Stack
- **Database**: PostgreSQL 15+
- **Platform**: Supabase
- **Extensions**: 
  - `uuid-ossp` - UUID generation
  - `pg_stat_statements` - Query performance monitoring
  - `pgcrypto` - Cryptographic functions

### Design Principles
- Normalized structure to prevent data redundancy
- Strong referential integrity with foreign keys
- Row Level Security for data protection
- Optimized indexes for query performance
- Audit trails for critical operations

## Core Tables

### users
Primary table for user account information.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    kyc_level INTEGER DEFAULT 1 CHECK (kyc_level IN (1, 2, 3)),
    kyc_verified_at TIMESTAMPTZ,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields:**
- `id`: Unique identifier (UUID)
- `email`: User's email address (unique)
- `kyc_level`: KYC verification level (1-3)
- `is_admin`: Admin privileges flag
- `is_active`: Account active status

**Relationships:**
- One-to-many with `transactions`
- One-to-many with `orders`
- One-to-many with `notifications`
- One-to-many with `kyc_documents`

### transactions
Records all P2P trading transactions.

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    cryptocurrency TEXT NOT NULL,
    crypto_amount DECIMAL(20, 8) NOT NULL,
    fiat_amount DECIMAL(20, 2) NOT NULL,
    price DECIMAL(20, 2) NOT NULL,
    fee_amount DECIMAL(20, 2),
    payment_method TEXT NOT NULL,
    payment_details JSONB,
    dispute_reason TEXT,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_buyer_seller CHECK (buyer_id != seller_id)
);
```

**Key Fields:**
- `status`: Transaction lifecycle status
- `cryptocurrency`: Trading pair (BTC, ETH, etc.)
- `payment_details`: JSON data for payment info
- `expires_at`: Transaction expiration time

**Status Values:**
- `pending`: Initial state
- `payment_pending`: Awaiting payment
- `payment_confirmed`: Payment received
- `crypto_released`: Cryptocurrency transferred
- `completed`: Transaction finished
- `cancelled`: Transaction cancelled
- `disputed`: Under dispute

### orders
P2P trading orders/advertisements.

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type order_type NOT NULL,
    status order_status DEFAULT 'active',
    cryptocurrency TEXT NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    min_amount DECIMAL(20, 2),
    max_amount DECIMAL(20, 2),
    price DECIMAL(20, 2) NOT NULL,
    payment_methods TEXT[],
    terms TEXT,
    auto_release BOOLEAN DEFAULT FALSE,
    completed_trades INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields:**
- `type`: 'buy' or 'sell'
- `status`: 'active', 'paused', 'completed', 'cancelled'
- `payment_methods`: Array of accepted payment methods
- `auto_release`: Automatic crypto release flag

### pix_payments
PIX payment integration records.

```sql
CREATE TABLE pix_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    pix_key TEXT NOT NULL,
    pix_key_type pix_key_type NOT NULL,
    qr_code TEXT,
    qr_code_image TEXT,
    payment_id TEXT UNIQUE,
    provider TEXT NOT NULL,
    status payment_status DEFAULT 'pending',
    amount DECIMAL(20, 2) NOT NULL,
    paid_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    webhook_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields:**
- `pix_key_type`: 'cpf', 'cnpj', 'email', 'phone', 'random'
- `provider`: Payment provider name
- `webhook_data`: Raw webhook payload

### notifications
User notification system.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    priority notification_priority DEFAULT 'normal',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Notification Types:**
- `transaction_update`: Transaction status changes
- `payment_received`: Payment confirmations
- `kyc_update`: KYC status changes
- `system_announcement`: Platform announcements
- `security_alert`: Security notifications

### kyc_documents
KYC document storage and verification.

```sql
CREATE TABLE kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    document_type kyc_document_type NOT NULL,
    document_url TEXT NOT NULL,
    status verification_status DEFAULT 'pending',
    level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Document Types:**
- `identity_front`: ID card front
- `identity_back`: ID card back
- `proof_of_address`: Address verification
- `selfie`: Selfie with document
- `bank_statement`: Bank account proof

### two_factor_auth
2FA configuration for users.

```sql
CREATE TABLE two_factor_auth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id),
    secret TEXT NOT NULL,
    backup_codes TEXT[],
    enabled BOOLEAN DEFAULT FALSE,
    enabled_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Supporting Tables

### crypto_prices
Real-time cryptocurrency price data.

```sql
CREATE TABLE crypto_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    price_usd DECIMAL(20, 8) NOT NULL,
    price_brl DECIMAL(20, 8) NOT NULL,
    change_24h DECIMAL(10, 2),
    volume_24h DECIMAL(20, 2),
    market_cap DECIMAL(20, 2),
    last_updated TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### blog_posts
Content management for blog articles.

```sql
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    author_name TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### courses
Educational course content.

```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    duration_hours INTEGER DEFAULT 0,
    level course_level DEFAULT 'beginner',
    category TEXT NOT NULL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    instructor_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### course_enrollments
Track user course enrollments.

```sql
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    status enrollment_status DEFAULT 'enrolled',
    progress_percentage INTEGER DEFAULT 0,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
```

### faqs
Frequently asked questions.

```sql
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### transaction_messages
Chat messages within transactions.

```sql
CREATE TABLE transaction_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    attachments TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### user_ratings
User rating system for traders.

```sql
CREATE TABLE user_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    rated_by UUID NOT NULL REFERENCES users(id),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(transaction_id, rated_by)
);
```

## Storage Buckets

Supabase Storage buckets for file management:

### kyc-documents (Private)
- **Purpose**: Store KYC verification documents
- **Access**: User can only access their own documents
- **File Types**: jpg, jpeg, png, pdf
- **Max Size**: 10MB per file

### payment-proofs (Private)
- **Purpose**: Store payment confirmation documents
- **Access**: Transaction participants only
- **File Types**: jpg, jpeg, png, pdf
- **Max Size**: 5MB per file

### profile-images (Public)
- **Purpose**: User profile pictures
- **Access**: Public read, authenticated write
- **File Types**: jpg, jpeg, png, webp
- **Max Size**: 2MB per file

### blog-images (Public)
- **Purpose**: Blog post images
- **Access**: Public read, admin write
- **File Types**: jpg, jpeg, png, webp
- **Max Size**: 5MB per file

## Indexes and Performance

### Primary Indexes

```sql
-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kyc_level ON users(kyc_level);

-- Transaction queries
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Order queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status_type ON orders(status, type);
CREATE INDEX idx_orders_cryptocurrency ON orders(cryptocurrency);

-- Notification queries
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Price queries
CREATE INDEX idx_crypto_prices_symbol ON crypto_prices(symbol);
CREATE INDEX idx_crypto_prices_updated ON crypto_prices(last_updated DESC);
```

### Composite Indexes

```sql
-- Transaction search
CREATE INDEX idx_transactions_search 
ON transactions(status, cryptocurrency, created_at DESC);

-- Order matching
CREATE INDEX idx_orders_matching 
ON orders(status, type, cryptocurrency, price);

-- User activity
CREATE INDEX idx_user_activity 
ON users(is_active, last_login_at DESC);
```

## Row Level Security (RLS)

### Users Table

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.is_admin = TRUE
        )
    );
```

### Transactions Table

```sql
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id
    );

-- Users can create transactions
CREATE POLICY "Users can create transactions" ON transactions
    FOR INSERT WITH CHECK (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id
    );

-- Users can update their own transactions
CREATE POLICY "Users can update own transactions" ON transactions
    FOR UPDATE USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id
    );
```

### Orders Table

```sql
-- Anyone can view active orders
CREATE POLICY "Anyone can view active orders" ON orders
    FOR SELECT USING (status = 'active');

-- Users can create their own orders
CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);
```

## Triggers and Functions

### Update Timestamp Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... repeat for other tables
```

### Transaction Status Update

```sql
CREATE OR REPLACE FUNCTION handle_transaction_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status changes
    INSERT INTO transaction_status_log (
        transaction_id,
        old_status,
        new_status,
        changed_by,
        changed_at
    ) VALUES (
        NEW.id,
        OLD.status,
        NEW.status,
        auth.uid(),
        NOW()
    );

    -- Update completion timestamp
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = NOW();
    END IF;

    -- Update cancellation timestamp
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        NEW.cancelled_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER transaction_status_change
    BEFORE UPDATE OF status ON transactions
    FOR EACH ROW EXECUTE FUNCTION handle_transaction_status_change();
```

### User Rating Calculation

```sql
CREATE OR REPLACE FUNCTION calculate_user_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    total_ratings INTEGER;
BEGIN
    -- Calculate average rating
    SELECT 
        AVG(rating)::DECIMAL(3,2),
        COUNT(*)
    INTO avg_rating, total_ratings
    FROM user_ratings
    WHERE user_id = NEW.user_id;

    -- Update user profile
    UPDATE users
    SET 
        average_rating = avg_rating,
        total_ratings = total_ratings
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_rating
    AFTER INSERT OR UPDATE ON user_ratings
    FOR EACH ROW EXECUTE FUNCTION calculate_user_rating();
```

## Migrations

### Migration Strategy

1. **Sequential Numbering**: Migrations use sequential numbering (001, 002, etc.)
2. **Idempotent**: All migrations should be idempotent (safe to run multiple times)
3. **Rollback Scripts**: Each migration should have a corresponding rollback
4. **Testing**: Test migrations on a staging database first

### Migration Files

```
supabase/migrations/
├── 001_initial_schema.sql
├── 002_blog_schema.sql
├── 003_courses_schema.sql
├── 004_kyc_schema.sql
├── 005_admin_schema.sql
├── 006_pix_payment_system.sql
├── 007_create_storage_buckets.sql
├── 008_two_factor_auth.sql
├── 20250103_create_crypto_prices_table.sql
└── create_notifications_table.sql
```

### Running Migrations

```bash
# Development
supabase db push

# Production (via Supabase Dashboard)
# SQL Editor → New Query → Paste migration → Run
```

## Best Practices

### 1. Data Integrity

- Always use foreign key constraints
- Implement check constraints for data validation
- Use NOT NULL where appropriate
- Create unique constraints for business rules

### 2. Performance

- Index foreign keys
- Index columns used in WHERE clauses
- Use partial indexes for filtered queries
- Monitor slow queries with pg_stat_statements

### 3. Security

- Enable RLS on all tables
- Use service role key only for admin operations
- Implement field-level encryption for sensitive data
- Regular security audits

### 4. Maintenance

- Regular VACUUM and ANALYZE
- Monitor table bloat
- Archive old data
- Implement data retention policies

### 5. Backup Strategy

- Enable point-in-time recovery
- Daily automated backups
- Test restore procedures
- Geographic redundancy

## Database Monitoring

### Key Metrics

```sql
-- Connection count
SELECT count(*) FROM pg_stat_activity;

-- Long running queries
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- Table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;
```

## Future Considerations

### Planned Enhancements

1. **Sharding**: Implement table partitioning for large tables
2. **Read Replicas**: Add read replicas for scaling
3. **Caching Layer**: Implement Redis for frequently accessed data
4. **Event Sourcing**: Add event log for audit trail
5. **Time Series Data**: Optimize price history storage