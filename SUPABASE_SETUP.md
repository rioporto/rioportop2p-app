# Supabase Setup Guide for Rio Porto P2P

This guide will walk you through setting up Supabase for the Rio Porto P2P application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Database Setup](#database-setup)
4. [Authentication Configuration](#authentication-configuration)
5. [Environment Variables](#environment-variables)
6. [API Usage Examples](#api-usage-examples)
7. [Security Best Practices](#security-best-practices)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Basic knowledge of PostgreSQL

## Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - Organization: Select or create one
   - Project name: `rioportop2p`
   - Database Password: Generate a strong password (save it!)
   - Region: Choose the closest to your users
   - Pricing Plan: Free tier is sufficient for development

## Database Setup

### 1. Run the Schema Migration

1. In your Supabase dashboard, go to SQL Editor
2. Create a new query
3. Copy the entire contents of `src/lib/database.schema.sql`
4. Run the query to create all tables and policies

### 2. Enable Row Level Security (RLS)

RLS is already enabled in the schema file, but verify:

1. Go to Authentication > Policies
2. Ensure all tables have RLS enabled
3. Review the policies for each table

### 3. Create Initial Admin User

Run this SQL in the SQL Editor after creating your first user:

```sql
UPDATE users 
SET is_admin = true, kyc_level = 3 
WHERE email = 'your-admin-email@example.com';
```

## Authentication Configuration

### 1. Email Templates

1. Go to Authentication > Email Templates
2. Customize the following templates:
   - Confirm signup
   - Reset password
   - Magic link

### 2. URL Configuration

1. Go to Authentication > URL Configuration
2. Add your site URL to allowed redirects:
   - `http://localhost:3000/*` (development)
   - `https://yourdomain.com/*` (production)

### 3. Auth Providers (Optional)

To enable social logins:

1. Go to Authentication > Providers
2. Enable desired providers (Google, GitHub, etc.)
3. Configure OAuth credentials

## Environment Variables

### 1. Get Your Keys

1. Go to Settings > API
2. Copy the following values:
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY`
   - URL → `NEXT_PUBLIC_SUPABASE_URL`
   - JWT Secret → `SUPABASE_JWT_SECRET`

3. Go to Settings > Database
4. Copy the connection string → `DATABASE_URL`

### 2. Create .env.local

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-side only (never expose these)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret-here
DATABASE_URL=postgres://postgres:password@db.xxxxxxxxxxxxxxxxxxxx.supabase.co:5432/postgres

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Rio Porto P2P"
NEXT_PUBLIC_SUPPORT_EMAIL=support@rioportop2p.com

# File Upload Settings
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

## API Usage Examples

### Authentication

```typescript
// Sign up
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!',
    fullName: 'John Doe',
    phone: '+1234567890'
  })
});

// Sign in
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!'
  })
});
```

### User Profile

```typescript
// Get profile
const response = await fetch('/api/users/profile');
const { user } = await response.json();

// Update profile
const response = await fetch('/api/users/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: 'Jane Doe',
    phone: '+0987654321'
  })
});
```

### Transactions

```typescript
// Create transaction
const response = await fetch('/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'buy',
    from_currency: 'BRL',
    to_currency: 'EUR',
    from_amount: 1000,
    to_amount: 185,
    exchange_rate: 0.185,
    payment_method: 'bank_transfer'
  })
});

// Get transactions
const response = await fetch('/api/transactions?status=completed&type=buy');
const { transactions } = await response.json();
```

### Courses

```typescript
// Get courses
const response = await fetch('/api/courses?category=blockchain&level=beginner');
const { courses } = await response.json();

// Enroll in course
const response = await fetch('/api/enrollments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    course_id: 'course-uuid-here'
  })
});
```

## Security Best Practices

### 1. Environment Variables

- **Never** commit `.env.local` to version control
- **Never** expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- Use different keys for development and production

### 2. Row Level Security (RLS)

- Always enable RLS on all tables
- Test policies thoroughly
- Use the principle of least privilege

### 3. API Routes

- Validate all input data
- Check user authentication and authorization
- Use proper error handling
- Rate limit sensitive endpoints

### 4. KYC Levels

The application uses three KYC levels:

- **Level 1**: Basic registration (limited features)
- **Level 2**: Verified user (can make transactions)
- **Level 3**: Fully verified (higher limits)
- **Admin**: Full access to all features

### 5. Database Backups

1. Go to Settings > Backups
2. Enable Point-in-Time Recovery
3. Download backups regularly
4. Test restore procedures

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check redirect URLs in Supabase dashboard
   - Verify environment variables are set correctly
   - Clear browser cookies and local storage

2. **Database queries failing**
   - Check RLS policies
   - Verify user is authenticated
   - Check table permissions

3. **File uploads not working**
   - Create storage buckets in Supabase
   - Set proper CORS configuration
   - Check file size limits

### Debug Mode

Enable debug mode in development:

```typescript
// src/lib/supabase.ts
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: process.env.NODE_ENV === 'development' // Add this
  }
})
```

## Next Steps

1. Set up storage buckets for file uploads
2. Configure email templates for better branding
3. Set up database backups
4. Implement rate limiting
5. Add monitoring and analytics

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Community](https://github.com/supabase/supabase/discussions)