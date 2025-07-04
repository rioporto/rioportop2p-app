# 🛠 Setup Guide

This guide will walk you through setting up the Rio Porto P2P platform for development.

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package manager
- **Git** - Version control
- **Supabase account** - [Sign up here](https://supabase.com/)
- **Stack Auth account** - [Sign up here](https://stack-auth.com/)
- **Resend account** - [Sign up here](https://resend.com/) for email
- **Google Cloud account** - For Maps API and Analytics
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

# Stack Auth Configuration (Required)
STACK_AUTH_SECRET_SERVER_KEY=your_stack_auth_server_key
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_client_key
NEXT_PUBLIC_STACK_URL=https://api.stack-auth.com

# Email Configuration (Required)
RESEND_API_KEY=your_resend_api_key

# Google Services (Required)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_google_analytics_id
```

#### Optional Variables
```bash
# Vercel Configuration (for deployment checks)
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_TEAM_ID=your_vercel_team_id

# PIX Payment Providers (Pending Setup)
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

### Configure Stack Auth
1. Create a Stack Auth project at [stack-auth.com](https://stack-auth.com)
2. Get your project credentials:
   - Project ID
   - Publishable Client Key
   - Secret Server Key
3. Configure OAuth providers in Stack Auth dashboard:
   - Enable Google OAuth
   - Set redirect URLs

### Configure Google Services
1. **Google Maps API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Maps JavaScript API
   - Create API key and restrict it

2. **Google Analytics**:
   - Go to [Google Analytics](https://analytics.google.com)
   - Create a new property
   - Get your Measurement ID (G-XXXXXXXXXX)

### Configure Email (Resend)
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get your API key
4. Configure email templates

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
- `users_profile` - User profiles with Stack Auth integration
- `transactions` - Transaction records
- `crypto_prices` - Real-time price data
- `notifications` - Real-time notifications
- `two_factor_auth` - 2FA settings
- `backup_codes` - 2FA backup codes
- `pix_keys` - PIX payment keys
- `pix_payment_details` - PIX payment information
- `blog_posts` - Blog content
- `courses` - Course content
- `kyc_applications` - KYC applications
- `contact_messages` - Contact form submissions
- `faqs` - FAQ content
- `enrollments` - Course enrollments

**Note**: All database migrations have been successfully executed as of 2025-07-04.

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
2. Check system status at `/api/system-check`
3. Verify Supabase connection in logs

### Test Authentication (Stack Auth)
1. Sign up with email/password
2. Check email verification
3. Try Google OAuth login
4. Test logout functionality
5. Verify session management

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

### Email Configuration (Resend)
The platform uses Resend for all transactional emails:
1. Email verification
2. Password reset
3. Transaction notifications
4. KYC status updates

Templates are managed in the codebase at `src/lib/resend.ts`

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

### Stack Auth Problems
- Verify all three Stack Auth keys are set
- Check OAuth redirect URLs in Stack dashboard
- Ensure cookies are enabled for session management

### Database Migration Errors
- Migrations have been successfully applied
- If issues arise, check `supabase/migrations/` directory
- Use `supabase db reset` for fresh start

### Hydration Errors
- Check server/client component boundaries
- Ensure consistent data between server and client
- Review Next.js 15 App Router requirements

### CSS/Responsive Issues
- Hamburger menu on desktop: Check Tailwind breakpoints
- Use browser DevTools to debug media queries

## 10. Next Steps

After successful setup:
1. Review the [API Documentation](../API_DOCUMENTATION.md)
2. Check [Claude AI Instructions](../CLAUDE.md) for development guidance
3. Deploy to production with [Deployment Guide](./DEPLOYMENT.md)
4. Configure domain and SSL certificates

## 11. Current Status Notes (2025-07-04)

### Working Features
- Full authentication system with Stack Auth
- Database schema fully migrated
- Email system via Resend
- Google Maps and Analytics integration
- Admin dashboard (hydration issue fixed)
- New pages: Features, Pricing, Help

### Known Issues
- Hamburger menu appearing on desktop (CSS debugging needed)
- WhatsApp Business API not available (Meta restriction)

### Pending Configuration
- Domain setup (rioporto.com)
- PIX payment gateway integration
- CPF validation implementation

## Support

If you encounter issues:
- Check the [troubleshooting section](#common-issues)
- Open an issue on GitHub
- Contact support at contato@rioporto.com

---

**Happy coding! 🚀**