# 🤖 Claude AI Assistant Instructions

This file contains instructions for AI assistants (like Claude) working on the Rio Porto P2P project.

## 📋 Project Overview

**Rio Porto P2P** is a comprehensive cryptocurrency P2P trading platform built with:
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Supabase
- **Database**: PostgreSQL with Supabase
- **Authentication**: Supabase Auth + Google OAuth + 2FA
- **Payments**: PIX integration
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
1. **Email/Password**: Standard Supabase auth
2. **Google OAuth**: `/api/auth/signin` with provider
3. **2FA**: TOTP with backup codes
4. **Session Management**: HTTP-only cookies

### Key Files
- `src/lib/supabase.ts` - Supabase client
- `src/app/api/auth/signin/route.ts` - Login API
- `src/app/api/auth/callback/route.ts` - OAuth callback
- `src/app/auth/2fa/` - 2FA verification

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

# Vercel
VERCEL_TOKEN=
VERCEL_PROJECT_ID=
VERCEL_TEAM_ID=

# PIX (optional)
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
- **Authentication**: Verify tokens

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
- `docs/API_DOCUMENTATION.md` - API reference
- `CLAUDE.md` - This file

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
- Error tracking
- Performance metrics
- User analytics
- System health

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