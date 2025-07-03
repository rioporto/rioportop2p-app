# 🛠 Setup Guide

This guide will walk you through setting up the Rio Porto P2P platform for development.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Git** - Version control
- **Supabase account** - [Sign up here](https://supabase.com/)
- **Vercel account** - [Sign up here](https://vercel.com/) (optional for deployment)

## 1. Project Setup

### Clone the Repository
```bash
git clone https://github.com/your-username/rioportop2p-app.git
cd rioportop2p-app
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

## 2. Environment Configuration

### Create Environment Files
```bash
cp .env.example .env.local
```

### Configure Environment Variables

#### Required Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Optional Variables
```bash
# Vercel Configuration (for deployment checks)
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_TEAM_ID=your_vercel_team_id

# PIX Payment Providers
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_token
PAGSEGURO_TOKEN=your_pagseguro_token
GERENCIANET_CLIENT_ID=your_gerencianet_client_id
GERENCIANET_CLIENT_SECRET=your_gerencianet_client_secret

# Crypto API Keys (all optional - fallback to free tiers)
COINGECKO_API_KEY=your_coingecko_key
CRYPTOCOMPARE_API_KEY=your_cryptocompare_key
```

## 3. Supabase Setup

### Create a New Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details
4. Wait for project creation

### Get Your Supabase Credentials
1. In your project dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY`

### Configure Google OAuth (Optional)
1. Go to Authentication > Settings
2. Enable Google provider
3. Configure OAuth settings:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
   - **Redirect URL**: `https://your-domain.com/api/auth/callback`

## 4. Database Setup

### Install Supabase CLI
```bash
npm install -g @supabase/cli
```

### Initialize Supabase
```bash
supabase init
```

### Link to Your Project
```bash
supabase link --project-ref your-project-ref
```

### Run Database Migrations
```bash
supabase db push
```

This will create all necessary tables:
- `users_profile` - User profiles
- `transactions` - Transaction records
- `crypto_prices` - Price history
- `notifications` - Real-time notifications
- `two_factor_auth` - 2FA settings
- `backup_codes` - 2FA backup codes
- `pix_keys` - PIX payment keys
- `pix_payment_details` - PIX payment information
- `blog_posts` - Blog content
- `courses` - Course content
- `kyc_applications` - KYC applications

### Configure Storage Buckets
```bash
# Create storage buckets
supabase storage create-bucket kyc-documents
supabase storage create-bucket payment-proofs
supabase storage create-bucket course-materials
```

## 5. Development Server

### Start the Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run test         # Run tests

# Database
npm run db:reset     # Reset database
npm run db:types     # Generate TypeScript types
```

## 6. Verify Setup

### Check Database Connection
1. Visit `http://localhost:3000`
2. Try to sign up with a new account
3. Check if user appears in Supabase Auth dashboard

### Test Authentication
1. Sign up with email/password
2. Try Google OAuth login
3. Test logout functionality

### Test Core Features
1. **Dashboard**: Access user dashboard
2. **KYC**: Try KYC verification flow
3. **Prices**: Check if crypto prices load
4. **Notifications**: Test notification system

## 7. Additional Configuration

### PIX Payment Setup
1. Choose a PIX provider (MercadoPago, PagSeguro, etc.)
2. Create developer account
3. Get API credentials
4. Add to environment variables

### Crypto Price APIs
The platform uses multiple free APIs:
- **Binance**: No key required
- **CoinGecko**: Free tier available
- **CryptoCompare**: Free tier available

### Email Configuration
Supabase handles email by default, but you can configure custom SMTP:
1. Go to Authentication > Settings
2. Configure SMTP settings
3. Customize email templates

## 8. Development Tips

### Hot Reloading
The development server supports hot reloading. Changes to code will automatically refresh the browser.

### Database Changes
When making database changes:
1. Create migration files in `supabase/migrations/`
2. Run `supabase db push` to apply changes
3. Generate new types with `supabase gen types typescript --local`

### Environment Variables
- Never commit `.env.local` to version control
- Use `.env.example` as a template
- Add new variables to both files

### Debugging
- Use browser DevTools for client-side debugging
- Check Supabase dashboard for database issues
- Monitor Network tab for API calls

## 9. Common Issues

### Supabase Connection Issues
- Verify your environment variables
- Check if your IP is whitelisted
- Ensure service role key has correct permissions

### Authentication Problems
- Check Google OAuth configuration
- Verify redirect URLs
- Ensure email verification is configured

### Database Migration Errors
- Check migration syntax
- Verify table relationships
- Ensure RLS policies are correct

## 10. Next Steps

After successful setup:
1. Review the [API Documentation](./API_DOCUMENTATION.md)
2. Check [Database Schema](./DATABASE_SCHEMA.md)
3. Read [Contributing Guide](./CONTRIBUTING.md)
4. Deploy to production with [Deployment Guide](./DEPLOYMENT.md)

## Support

If you encounter issues:
- Check the [troubleshooting section](#common-issues)
- Open an issue on GitHub
- Contact support at contato@rioporto.com

---

**Happy coding! 🚀**