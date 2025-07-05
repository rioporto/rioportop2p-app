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
├── src/                    # Source code
│   ├── app/               # Next.js App Router
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # User dashboard
│   │   └── ...
│   ├── components/        # React components
│   │   ├── admin/        # Admin components
│   │   ├── auth/         # Auth components
│   │   ├── crypto/       # Crypto components
│   │   ├── notifications/# Notification components
│   │   └── ui/           # UI components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── supabase/              # Database files
│   ├── migrations/        # Database migrations
│   ├── seeds/            # Seed data
│   └── *.sql             # Admin scripts
├── docs/                  # All documentation
│   ├── api/              # API documentation
│   ├── setup/            # Setup guides
│   ├── deployment/       # Deployment docs
│   ├── architecture/     # System architecture
│   ├── features/         # Feature docs
│   ├── reports/          # Status reports
│   └── misc/             # Other docs
├── scripts/               # All scripts
│   ├── db/               # Database scripts
│   └── deploy/           # Deployment scripts
├── logs/                  # All logs
│   └── deploy/           # Deployment logs
├── public/                # Static files
├── backend/               # Python backend
└── coverage/              # Test coverage
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

### Work Resume Protocol
When user provides password "Retomar dados agora!", read essential files and provide complete status report:
1. Read CLAUDE.md, recent reports, package.json, and git status
2. Inform what was done in the last session
3. Show exactly where we stopped
4. List pending tasks and priorities
5. Report any urgent issues

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

## 🚧 Current Project Status (Updated: 2025-01-05)

### ✅ Completed Features

#### Core Infrastructure
- **Database**: All 32 tables created and configured
  - notifications, two_factor_auth, pix_keys, crypto_prices tables added
  - All migrations executed successfully
- **Authentication**: Stack Auth fully integrated
  - Email/password login working
  - Google OAuth configured
  - 2FA system ready
- **Admin System**: Admin user created and functional
- **Email**: Resend configured and working
- **APIs**: All core APIs operational
  - /api/cotacao - Crypto prices
  - /api/auth/* - Authentication
  - /api/dashboard/* - Dashboard metrics
  - /api/escrow/* - Escrow system
  - /api/transactions/* - Transaction management
- **Integrations**: Google Maps and Analytics working

#### Document Validation System
- **CPF/CNPJ Validation**: Complete implementation
  - Real-time format validation
  - Checksum verification algorithm
  - DocumentInput component with mask and validation
  - Integration with user profile and transactions

#### Escrow System
- **Complete P2P Trading Flow**: Fully implemented
  - Transaction creation with escrow
  - Buyer payment confirmation
  - Seller crypto release
  - Automatic status updates
  - Real-time notifications
  - Transaction history and tracking

#### Accessibility (WCAG 2.1 AA)
- **Full Accessibility Compliance**:
  - Semantic HTML structure
  - ARIA labels and attributes
  - Keyboard navigation support
  - Focus management
  - Screen reader compatibility
  - High contrast support
  - Reduced motion support
- **Automated Accessibility Testing**:
  - Jest + @testing-library/react tests
  - axe-core integration
  - Component-level a11y tests
  - Test files: LoadingButton.test.tsx, Alert.test.tsx, etc.

#### User Experience Enhancements
- **User Preferences System**:
  - Language preference (PT-BR/EN)
  - Theme preference (light/dark/system)
  - Notification preferences
  - Privacy settings
  - Accessibility preferences
  - Persistent storage in database
- **Educational Content**:
  - Beginner's guide to crypto
  - Interactive tutorials
  - Comprehensive glossary
  - FAQ section
  - Help center

#### UI Components
- **New Components Created**:
  - LoadingButton - Accessible loading states
  - Alert - Notification component with variants
  - DocumentInput - CPF/CNPJ input with validation
  - SkipLink - Accessibility navigation
  - PreferencesModal - User settings management
  - TransactionList - Transaction history display
  - TransactionDetails - Detailed transaction view

#### Legal and Compliance
- **Legal Pages**:
  - Terms of Service (/termos)
  - Privacy Policy (/privacidade)
  - Cookie Policy (included in privacy)
  - Data protection compliance

#### Project Organization
- **Clean folder structure implemented**:
  - All SQL files moved to /supabase
  - Documentation organized in /docs
  - Scripts organized in /scripts
  - Logs organized in /logs
  - Test files colocated with components

### 🔧 Completed Today (January 5, 2025)
1. ✅ CPF/CNPJ validation system with DocumentInput component
2. ✅ Complete Escrow system for P2P transactions
3. ✅ WCAG 2.1 AA accessibility compliance
4. ✅ Automated accessibility testing suite
5. ✅ User preferences system with database persistence
6. ✅ Educational content (guide, tutorials, glossary)
7. ✅ New accessible UI components
8. ✅ Legal pages (terms and privacy policy)
9. ✅ Transaction management system
10. ✅ Real-time notification integration

### ⚠️ Known Limitations
- WhatsApp Business API unavailable for crypto companies
- Using direct WhatsApp links (wa.me) as alternative

### 🔮 Next Priority Tasks
1. **Domain Configuration** - Setup rioporto.com (ONLY PENDING TASK)

### 📂 Important Files Created
- **Components**:
  - `/src/components/ui/LoadingButton.tsx` - Accessible loading button
  - `/src/components/ui/Alert.tsx` - Notification alerts
  - `/src/components/ui/DocumentInput.tsx` - CPF/CNPJ input
  - `/src/components/ui/SkipLink.tsx` - Accessibility navigation
  - `/src/components/PreferencesModal.tsx` - User preferences
  - `/src/components/transactions/TransactionList.tsx` - Transaction list
  - `/src/components/transactions/TransactionDetails.tsx` - Transaction details
- **Pages**:
  - `/src/app/termos/page.tsx` - Terms of service
  - `/src/app/privacidade/page.tsx` - Privacy policy
  - `/src/app/educacao/page.tsx` - Educational content hub
  - `/src/app/educacao/guia-iniciante/page.tsx` - Beginner's guide
  - `/src/app/educacao/tutoriais/page.tsx` - Tutorials
  - `/src/app/educacao/glossario/page.tsx` - Crypto glossary
  - `/src/app/ajuda/page.tsx` - Help center
- **APIs**:
  - `/src/app/api/escrow/route.ts` - Escrow management
  - `/src/app/api/transactions/[id]/route.ts` - Transaction operations
  - `/src/app/api/user/preferences/route.ts` - User preferences
- **Tests**:
  - `/src/components/ui/__tests__/LoadingButton.test.tsx`
  - `/src/components/ui/__tests__/Alert.test.tsx`
  - `/src/components/ui/__tests__/DocumentInput.test.tsx`
  - `/src/lib/__tests__/document-validation.test.ts`
- **Utilities**:
  - `/src/lib/document-validation.ts` - CPF/CNPJ validation
  - `/src/lib/escrow.ts` - Escrow service
  - `/src/lib/preferences.ts` - User preferences service
- **Database Migrations**:
  - `/supabase/migrations/20250105_user_preferences.sql`
  - `/supabase/migrations/20250105_escrow_system.sql`

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