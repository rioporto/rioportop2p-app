# RioPorto P2P - Detailed Setup Instructions

This guide provides comprehensive instructions for setting up the RioPorto P2P platform in your local development environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Authentication Setup](#authentication-setup)
5. [Email Service Setup](#email-service-setup)
6. [File Storage Setup](#file-storage-setup)
7. [Payment Integration](#payment-integration)
8. [Cryptocurrency API Setup](#cryptocurrency-api-setup)
9. [Running the Application](#running-the-application)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Required Accounts
- **Supabase**: For database and authentication
- **Stack Auth**: For user authentication
- **Resend**: For email services
- **Cloudinary**: For file and image storage
- **Google Cloud**: For OAuth and Maps API (optional)
- **CoinMarketCap**: For cryptocurrency prices (optional)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rioporto/rioportop2p-app.git
cd rioportop2p-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env.local
```

### 4. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Stack Auth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_publishable_key
NEXT_PUBLIC_STACK_BASE_URL=https://app.stack-auth.com
STACK_SECRET_SERVER_KEY=your_stack_secret_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Service (Resend)
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# File Storage (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google APIs (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cryptocurrency APIs (Optional)
COINMARKETCAP_API_KEY=your_coinmarketcap_key

# PIX Payment Integration
PIX_PROVIDER_API_KEY=your_pix_provider_key
PIX_PROVIDER_API_SECRET=your_pix_provider_secret
PIX_WEBHOOK_SECRET=your_webhook_secret

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# WhatsApp Integration
WHATSAPP_API_URL=https://api.whatsapp.com/send
WHATSAPP_PHONE_NUMBER=5521201877776
```

## Database Configuration

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and API keys

### 2. Run Database Migrations

1. Navigate to your Supabase project dashboard
2. Go to SQL Editor
3. Run the migrations in order:

```sql
-- Run each file in supabase/migrations/ folder in order:
-- 001_initial_schema.sql
-- 002_blog_schema.sql
-- 003_courses_schema.sql
-- 004_kyc_schema.sql
-- 005_admin_schema.sql
-- 006_pix_payment_system.sql
-- 007_create_storage_buckets.sql
-- 008_two_factor_auth.sql
-- 20250103_create_crypto_prices_table.sql
-- create_notifications_table.sql
```

### 3. Seed Initial Data

```sql
-- Run the seed file
-- supabase/seeds/cryptocurrencies.sql
```

### 4. Configure Storage Buckets

In Supabase Dashboard:
1. Go to Storage
2. Create the following buckets:
   - `kyc-documents` (private)
   - `payment-proofs` (private)
   - `profile-images` (public)
   - `blog-images` (public)

### 5. Set Storage Policies

For each bucket, set appropriate RLS policies:

```sql
-- Example for kyc-documents bucket
CREATE POLICY "Users can upload own KYC documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own KYC documents" ON storage.objects
FOR SELECT USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Authentication Setup

### 1. Stack Auth Configuration

1. Create account at [https://stack-auth.com](https://stack-auth.com)
2. Create a new project
3. Configure OAuth providers:
   - Enable Email/Password authentication
   - Enable Google OAuth (optional)
4. Set redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 2. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

### 3. Configure 2FA

Two-factor authentication is automatically configured with the database migrations. No additional setup required.

## Email Service Setup

### 1. Resend Configuration

1. Create account at [https://resend.com](https://resend.com)
2. Verify your domain
3. Create an API key
4. Add the API key to `.env.local`

### 2. Email Templates

The application uses the following email templates:
- Welcome email
- KYC verification status
- Transaction notifications
- Password reset
- 2FA codes

Templates are defined in the API routes and use HTML formatting.

## File Storage Setup

### 1. Cloudinary Configuration

1. Create account at [https://cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Configure upload presets:
   - `kyc_documents` - For KYC document uploads
   - `payment_proofs` - For payment proof uploads
   - `profile_images` - For user profile pictures

### 2. Upload Settings

Configure the following in Cloudinary dashboard:
- Max file size: 10MB
- Allowed formats: jpg, jpeg, png, pdf
- Auto-backup: enabled
- Secure URLs: enabled

## Payment Integration

### 1. PIX Configuration

For PIX integration, you'll need:
1. A PIX payment provider account (e.g., Mercado Pago, PagSeguro)
2. API credentials from your provider
3. Webhook endpoint configuration

### 2. Webhook Setup

Configure your PIX provider to send webhooks to:
- Development: `http://localhost:3000/api/webhooks/pix`
- Production: `https://yourdomain.com/api/webhooks/pix`

## Cryptocurrency API Setup

### 1. CoinMarketCap (Recommended)

1. Create account at [https://coinmarketcap.com/api](https://coinmarketcap.com/api)
2. Get your API key
3. Add to `.env.local`

### 2. Alternative: CoinGecko

If using CoinGecko instead:
1. Get API key from [https://www.coingecko.com/en/api](https://www.coingecko.com/en/api)
2. Update `src/lib/crypto-price-service.ts` to use CoinGecko endpoints

## Running the Application

### 1. Development Mode

```bash
# Start the development server
npm run dev

# The application will be available at http://localhost:3000
```

### 2. Build for Production

```bash
# Create production build
npm run build

# Test production build locally
npm start
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Initial Setup Tasks

### 1. Create Admin User

1. Sign up through the normal registration flow
2. Use Supabase dashboard to update user:

```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'admin@yourdomain.com';
```

### 2. Configure System Settings

1. Access admin panel at `/admin`
2. Configure:
   - Trading fees
   - Supported cryptocurrencies
   - KYC requirements
   - Email templates

### 3. Test Critical Flows

Test the following flows before going live:
1. User registration and login
2. KYC document upload
3. Create and complete a transaction
4. PIX payment flow
5. Email notifications
6. 2FA setup and login

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
- Verify Supabase URL and keys
- Check if migrations ran successfully
- Ensure RLS policies are correctly set

#### 2. Authentication Issues
- Verify Stack Auth configuration
- Check redirect URLs
- Ensure cookies are enabled

#### 3. File Upload Problems
- Verify Cloudinary credentials
- Check upload preset names
- Ensure file size limits

#### 4. Email Delivery Issues
- Verify Resend API key
- Check domain verification
- Review email templates for errors

#### 5. Payment Integration Problems
- Verify PIX provider credentials
- Check webhook configuration
- Test with provider's sandbox

### Debug Mode

Enable debug logging:

```env
# Add to .env.local
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

### System Health Check

Access system health check at:
```
http://localhost:3000/api/system-check
```

This endpoint verifies:
- Database connectivity
- Authentication service
- Email service
- File storage
- External APIs

## Next Steps

After completing setup:
1. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
2. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
3. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines

## Support

If you encounter issues during setup:
1. Check the troubleshooting section
2. Review error logs in the console
3. Contact support at contato@rioportop2p.com