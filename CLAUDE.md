# 🤖 Claude AI Assistant Instructions

This file contains instructions for AI assistants (like Claude) working on the Rio Porto P2P project.

## 📋 Project Overview

**Rio Porto P2P** is a comprehensive cryptocurrency P2P trading platform built with:
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Supabase
- **Database**: PostgreSQL with Supabase
- **Authentication**: Stack Auth + Google OAuth + 2FA
- **Email**: Resend for transactional emails
- **Maps**: Google Maps integration
- **Analytics**: Google Analytics
- **Payments**: PIX integration (pending configuration)
- **Deployment**: Vercel

## 🛠 Development Commands

### Essential Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript checks
npm run test            # Run tests

# Database
npx supabase db push    # Apply migrations
npx supabase gen types typescript --local > src/lib/database.types.ts
```

### Deployment
```bash
# Deploy with verification
./scripts/deploy-and-check.sh "commit message"

# Manual deployment check
./scripts/check-deploy.js
```

## 📁 Project Structure

```
rioportop2p-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   └── ...
│   ├── components/         # React components
│   │   ├── admin/          # Admin components
│   │   ├── auth/           # Auth components
│   │   ├── crypto/         # Crypto components
│   │   ├── notifications/  # Notification components
│   │   └── ui/             # UI components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities
│   └── types/              # TypeScript types
├── supabase/
│   ├── migrations/         # Database migrations
│   └── seed.sql           # Sample data
├── docs/                   # Documentation
└── scripts/                # Deployment scripts
```

## 🔐 Authentication Flow

### Current Implementation
1. **Email/Password**: Stack Auth with custom UI
2. **Google OAuth**: Stack Auth provider integration
3. **2FA**: TOTP with backup codes
4. **Session Management**: HTTP-only cookies via Stack Auth

### Key Files
- `src/lib/stack-auth.ts` - Stack Auth client configuration
- `src/app/api/auth/signin/route.ts` - Login API
- `src/app/api/auth/callback/route.ts` - OAuth callback
- `src/app/auth/2fa/` - 2FA verification
- `src/components/StackAuthProvider.tsx` - Auth provider wrapper

## 💾 Database Schema

### Key Tables
- `users_profile` - User profiles and KYC status
- `transactions` - P2P trading transactions
- `crypto_prices` - Real-time price data
- `notifications` - Real-time notifications
- `two_factor_auth` - 2FA settings
- `pix_keys` - PIX payment keys
- `blog_posts` - Blog content
- `courses` - Course content

### Migrations
All migrations are in `supabase/migrations/`. Always create new migrations for schema changes.

## 🔄 Real-time Features

### Notifications
- **Service**: `src/lib/notifications.ts`
- **Context**: `src/contexts/NotificationContext.tsx`
- **Components**: `src/components/notifications/`
- **Database**: Uses Supabase real-time subscriptions

### Crypto Prices
- **Service**: `src/lib/crypto-price-service.ts`
- **APIs**: Binance, CoinGecko, CryptoCompare
- **Caching**: In-memory + database
- **Updates**: Vercel Cron every 5 minutes

## 💳 PIX Payment System

### Components
- `src/components/pix/PixQRCodeDisplay.tsx`
- `src/components/pix/PixPaymentInstructions.tsx`
- `src/components/pix/PixKeyManager.tsx`

### APIs
- `/api/pix/create-payment` - Create PIX payment
- `/api/webhooks/pix` - Payment webhooks

### Providers
- MercadoPago, PagSeguro, Gerencianet supported
- Manual PIX key management

## 📊 Admin Dashboard

### Features
- User management
- KYC verification
- Blog/course management
- Transaction monitoring
- PIX key management

### Access
- Route: `/admin`
- Protected by authentication
- Role-based access control

## 🧪 Testing

### Test Structure
```bash
src/
├── __tests__/          # Test files
├── components/         # Component tests
└── lib/               # Utility tests
```

### Running Tests
```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## 🚀 Deployment

### Vercel Configuration
- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Framework**: Next.js
- **Node Version**: 18.x

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stack Auth
STACK_AUTH_SECRET_SERVER_KEY=
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
NEXT_PUBLIC_STACK_URL=https://api.stack-auth.com

# Email (Resend)
RESEND_API_KEY=

# Google Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Vercel
VERCEL_TOKEN=
VERCEL_PROJECT_ID=
VERCEL_TEAM_ID=

# PIX (pending configuration)
MERCADOPAGO_ACCESS_TOKEN=
PAGSEGURO_TOKEN=
```

### Deployment Scripts
- `./scripts/deploy-and-check.sh` - Deploy with verification
- `./scripts/check-deploy.js` - Check deployment status

## 🔧 Common Tasks

### Adding New Features
1. Create component in appropriate folder
2. Add API route if needed
3. Update types if required
4. Add to navigation/routing
5. Write tests
6. Update documentation

### Database Changes
1. Create migration file
2. Test locally
3. Apply to production
4. Update TypeScript types

### API Integration
1. Add service in `src/lib/`
2. Create API route
3. Add environment variables
4. Test thoroughly

## 🐛 Debugging

### Common Issues
- **Next.js 15**: Async cookies, dynamic params
- **Supabase RLS**: Check policies
- **TypeScript**: Use strict types
- **Authentication**: Verify Stack Auth tokens
- **Hydration Errors**: Check server/client component boundaries
- **Hamburger Menu**: CSS media query issues on desktop

### Debugging Tools
- Browser DevTools
- Vercel logs
- Supabase dashboard
- Console.log (temporary)

## 📝 Code Standards

### TypeScript
- Use strict mode
- Proper type definitions
- No `any` types
- Export types from dedicated files

### React
- Functional components
- Proper hooks usage
- Error boundaries
- Accessibility

### Styling
- Tailwind CSS
- Responsive design
- Dark mode support
- Component-based styling

## 📚 Documentation

### Files to Update
- `README.md` - Project overview
- `docs/SETUP.md` - Setup instructions
- `docs/DEPLOYMENT.md` - Deployment guide
- `API_DOCUMENTATION.md` - API reference
- `CLAUDE.md` - This file

### Documentation Update Protocol
When user provides password "ATUALIZAR DADOS AGORA!", update all documentation with latest project status.

### Documentation Standards
- Clear explanations
- Code examples
- Step-by-step guides
- Troubleshooting sections

## 🚨 Security Considerations

### Authentication
- Secure session management
- Proper token validation
- 2FA implementation
- OAuth security

### Data Protection
- Encrypt sensitive data
- Secure API endpoints
- Input validation
- SQL injection prevention

### PIX Security
- Secure key storage
- Payment verification
- Fraud prevention
- Audit logging

## 💡 Best Practices

### Code Organization
- Modular components
- Reusable utilities
- Clear naming conventions
- Proper file structure

### Performance
- Lazy loading
- Image optimization
- Database indexing
- Caching strategies

### User Experience
- Loading states
- Error handling
- Responsive design
- Accessibility

## 🔄 Maintenance

### Regular Tasks
- Update dependencies
- Monitor performance
- Review security
- Update documentation

### Monitoring
- Error tracking (Vercel logs)
- Performance metrics
- User analytics (Google Analytics)
- System health

## 🚧 Current Project Status (Updated: 2025-07-04)

### ✅ Completed Features
- Database migrations executed and working
- Stack Auth integration complete
- New pages created: Features, Pricing, Help
- Email system configured with Resend
- Google Maps integration working
- Google Analytics configured
- Fixed deployment errors:
  - createClient parameter issues
  - replyTo email configuration
- Fixed hydration error in admin dashboard

### 🔧 In Progress
- Debugging hamburger menu CSS (appearing on desktop)
- Domain configuration for rioporto.com
- PIX payment gateway integration
- CPF validation implementation

### ⚠️ Known Limitations
- WhatsApp Business API unavailable (Meta blocks crypto companies)
- Must use alternative communication methods

### 🔮 Pending Tasks
- Configure production domain
- Complete PIX gateway setup
- Implement CPF validation
- Fix responsive menu issues

## 📞 Support

### Resources
- Documentation in `/docs`
- GitHub Issues
- Supabase Support
- Vercel Support

### Contact
- Email: contato@rioporto.com
- WhatsApp: +55 21 2018-7776

---

**This file should be updated whenever significant changes are made to the project structure or development process.**