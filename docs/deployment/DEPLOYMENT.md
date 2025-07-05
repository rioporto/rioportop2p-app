# RioPorto P2P - Comprehensive Deployment Guide

This guide provides detailed instructions for deploying the RioPorto P2P cryptocurrency trading platform to Vercel, including environment configuration, database setup, monitoring, and maintenance procedures.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Vercel Deployment Instructions](#vercel-deployment-instructions)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Domain Configuration](#domain-configuration)
7. [Security Configuration](#security-configuration)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)
11. [Rollback Procedures](#rollback-procedures)
12. [Performance Optimization](#performance-optimization)

## Prerequisites

Before deploying to Vercel, ensure you have:

- A [Vercel account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/docs/cli) installed (optional but recommended)
- Git repository with your code
- All required environment variables configured
- Supabase project set up
- Stack Auth project configured
- Resend account for email services

## Vercel Deployment Instructions

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Your Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your Git repository (GitHub, GitLab, or Bitbucket)
   - Select the repository containing your RioPortoP2P app

2. **Configure Build Settings**
   - Framework Preset: Next.js (should be auto-detected)
   - Build Command: `npm run build` or `yarn build`
   - Output Directory: `.next` (default for Next.js)
   - Install Command: `npm install` or `yarn install`

3. **Set Environment Variables**
   - Click on "Environment Variables"
   - Add all required variables (see [Environment Variables](#environment-variables) section)
   - Select appropriate environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be available at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**
   ```bash
   cd /path/to/rioportop2p-app
   vercel
   ```

4. **Follow the Prompts**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No (for first deployment)
   - Project name: rioportop2p-app (or your preferred name)
   - Directory: ./ (current directory)
   - Override settings: No (unless you need custom settings)

5. **Configure Environment Variables**
   ```bash
   # For each environment variable:
   vercel env add VARIABLE_NAME
   ```

### Option 3: Deploy with Git Integration

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Automatic Deployment**
   - If you've connected your repository to Vercel, it will automatically deploy on push
   - Check deployment status in Vercel Dashboard

## Environment Variables

### Required Environment Variables

All environment variables must be added in the Vercel Dashboard under Project Settings → Environment Variables.

#### Frontend Environment Variables

| Variable Name | Description | Required | Example Value |
|--------------|-------------|----------|---------------|
| `NEXT_PUBLIC_STACK_PROJECT_ID` | Stack Auth project identifier | Yes | `prj_1234567890` |
| `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` | Stack Auth public key for client-side | Yes | `pk_live_abcd1234` |
| `NEXT_PUBLIC_STACK_BASE_URL` | Stack Auth base URL | Yes | `https://app.stack-auth.com` |
| `STACK_SECRET_SERVER_KEY` | Stack Auth secret key for server-side | Yes | `sk_live_xyz789` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | `https://abc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | `eyJhbGc...` |
| `RESEND_API_KEY` | Resend API key for email services | Yes | `re_123456789` |
| `NODE_ENV` | Node environment | Optional | `production` |

#### Backend Environment Variables (if deploying Python backend)

| Variable Name | Description | Required | Example Value |
|--------------|-------------|----------|---------------|
| `SUPABASE_URL` | Supabase project URL | Yes | `https://abc.supabase.co` |
| `SUPABASE_KEY` | Supabase service key | Yes | `eyJhbGc...` |
| `JWT_SECRET_KEY` | JWT secret for token generation | Yes | `your-256-bit-secret` |
| `JWT_ALGORITHM` | JWT algorithm | Yes | `HS256` |
| `JWT_EXPIRATION_HOURS` | JWT token expiration time | Yes | `24` |
| `ENVIRONMENT` | Backend environment | Yes | `production` |

### Setting Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with its value
4. Select which environments should use each variable:
   - Production: For your main deployment
   - Preview: For pull request previews
   - Development: For local development with `vercel dev`

## Troubleshooting Common Issues

### 1. Build Failures

**Issue**: Build fails with module not found errors
```
Module not found: Can't resolve '@stackframe/stack'
```
**Solution**: 
- Clear cache and reinstall dependencies
- In Vercel: Settings → Functions → Clear Cache
- Locally: `rm -rf node_modules package-lock.json && npm install`

**Issue**: TypeScript errors during build
```
Type error: Cannot find module or its corresponding type declarations
```
**Solution**:
- Ensure all TypeScript dependencies are in `dependencies` not `devDependencies`
- Check `tsconfig.json` for correct module resolution settings

### 2. Environment Variable Issues

**Issue**: Environment variables not loading
```
Error: Missing required environment variable: NEXT_PUBLIC_STACK_PROJECT_ID
```
**Solution**:
- Verify all variables are set in Vercel Dashboard
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after adding/changing environment variables

**Issue**: Authentication not working
**Solution**:
- Double-check Stack Auth credentials
- Verify CORS settings in Stack Auth dashboard
- Ensure production domain is whitelisted

### 3. Runtime Errors

**Issue**: 500 errors on API routes
**Solution**:
- Check Vercel Function logs: Dashboard → Functions → View Logs
- Verify server-side environment variables
- Check for missing await statements in async functions

**Issue**: Supabase connection errors
**Solution**:
- Verify Supabase URL and keys are correct
- Check Supabase project status
- Review Row Level Security (RLS) policies

### 4. Performance Issues

**Issue**: Slow initial page loads
**Solution**:
- Enable ISR (Incremental Static Regeneration) where appropriate
- Optimize images using Next.js Image component
- Review bundle size with `next build` analysis

### 5. Domain Configuration Issues

**Issue**: Custom domain not working
**Solution**:
- Verify DNS records are correctly configured
- Allow 24-48 hours for DNS propagation
- Check SSL certificate status in Vercel Dashboard

## Post-Deployment Checklist

After deploying your application, verify the following:

### 1. Basic Functionality
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] No console errors in browser developer tools
- [ ] Mobile responsive design works properly

### 2. Authentication
- [ ] User registration works
- [ ] User login/logout functions correctly
- [ ] Protected routes redirect unauthenticated users
- [ ] Password reset flow works

### 3. Database Operations
- [ ] Data fetching from Supabase works
- [ ] Create operations succeed
- [ ] Update operations work correctly
- [ ] Delete operations function properly

### 4. Email Functionality
- [ ] Email notifications are sent
- [ ] Email templates render correctly
- [ ] Resend API is properly configured

### 5. Performance
- [ ] Page load times are acceptable
- [ ] Images load properly and are optimized
- [ ] No memory leaks or performance degradation

### 6. Security
- [ ] Environment variables are not exposed in client code
- [ ] API routes are properly protected
- [ ] CORS is configured correctly
- [ ] Rate limiting is in place (if implemented)

### 7. Monitoring Setup
- [ ] Set up Vercel Analytics
- [ ] Configure error tracking (e.g., Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure alerts for critical errors

### 8. SEO and Meta Tags
- [ ] Meta tags are properly set
- [ ] Open Graph tags work correctly
- [ ] Sitemap is generated (if applicable)
- [ ] Robots.txt is configured

### 9. Legal and Compliance
- [ ] Privacy policy is accessible
- [ ] Terms of service are available
- [ ] Cookie consent (if required)
- [ ] GDPR compliance (if applicable)

### 10. Backup and Recovery
- [ ] Database backup strategy in place
- [ ] Document recovery procedures
- [ ] Test rollback process

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Stack Auth Documentation](https://docs.stack-auth.com)

## Support

If you encounter issues not covered in this guide:

1. Check Vercel Status: https://vercel-status.com
2. Review Vercel Support: https://vercel.com/support
3. Consult Next.js GitHub Issues
4. Check service-specific documentation (Supabase, Stack Auth, Resend)

## Pre-Deployment Checklist

Complete these tasks before deploying to production:

### Code Quality
- [ ] All tests passing: `npm test`
- [ ] No TypeScript errors: `npm run build`
- [ ] No ESLint warnings: `npm run lint`
- [ ] Code review completed
- [ ] Security audit passed

### Environment Preparation
- [ ] Production environment variables ready
- [ ] SSL certificates configured (automatic with Vercel)
- [ ] Domain DNS prepared
- [ ] Backup of current production data (if updating)
- [ ] Maintenance window scheduled (if needed)

### External Services
- [ ] Supabase production project created
- [ ] Stack Auth production configuration
- [ ] Resend domain verified
- [ ] Cloudinary production setup
- [ ] PIX provider production credentials
- [ ] Google APIs production keys

## Database Setup

### Production Database Migration

1. **Access Production Supabase**:
   ```bash
   # Connect to production database
   psql "postgresql://postgres.[project-id]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
   ```

2. **Run Migrations in Order**:
   ```sql
   -- Execute each migration file
   \i supabase/migrations/001_initial_schema.sql
   \i supabase/migrations/002_blog_schema.sql
   \i supabase/migrations/003_courses_schema.sql
   \i supabase/migrations/004_kyc_schema.sql
   \i supabase/migrations/005_admin_schema.sql
   \i supabase/migrations/006_pix_payment_system.sql
   \i supabase/migrations/007_create_storage_buckets.sql
   \i supabase/migrations/008_two_factor_auth.sql
   \i supabase/migrations/20250103_create_crypto_prices_table.sql
   \i supabase/migrations/create_notifications_table.sql
   ```

3. **Seed Production Data**:
   ```sql
   \i supabase/seeds/cryptocurrencies.sql
   ```

4. **Configure Backups**:
   - Enable point-in-time recovery
   - Set daily backup schedule
   - Configure 30-day retention

## Domain Configuration

### Custom Domain Setup

1. **Add Domain in Vercel**:
   ```bash
   vercel domains add rioportop2p.com
   ```

2. **Configure DNS Records**:
   ```
   Type    Name    Value                   TTL
   A       @       76.76.21.21            Auto
   CNAME   www     cname.vercel-dns.com   Auto
   ```

3. **Email DNS Records** (for Resend):
   ```
   Type    Name              Value
   TXT     @                 v=spf1 include:resend.io ~all
   TXT     resend._domainkey dkim=...
   MX      @                 feedback-smtp.us-east-1.amazonses.com
   ```

## Security Configuration

### 1. Security Headers

Add to `next.config.ts`:

```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com *.google-analytics.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: *.cloudinary.com;
      font-src 'self';
      connect-src 'self' *.supabase.co *.stack-auth.com wss://*.supabase.co;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

### 2. API Rate Limiting

Implement rate limiting for API routes:

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

### 3. Environment Variable Security

- Never commit `.env` files
- Use different keys for production/development
- Rotate keys regularly
- Monitor for exposed secrets

## Post-Deployment Verification

### Critical Path Testing

1. **Authentication Flow**:
   - [ ] User registration with email
   - [ ] Email verification
   - [ ] Login/logout
   - [ ] Google OAuth
   - [ ] 2FA setup and verification
   - [ ] Password reset

2. **KYC Process**:
   - [ ] Document upload
   - [ ] Status updates
   - [ ] Admin approval workflow
   - [ ] Email notifications

3. **Trading Operations**:
   - [ ] Create P2P order
   - [ ] Accept order
   - [ ] PIX payment flow
   - [ ] Payment confirmation
   - [ ] Crypto release
   - [ ] Transaction completion

4. **Payment System**:
   - [ ] PIX key registration
   - [ ] QR code generation
   - [ ] Payment proof upload
   - [ ] Webhook processing

5. **Admin Functions**:
   - [ ] User management
   - [ ] Transaction monitoring
   - [ ] Content management
   - [ ] System statistics

### Performance Verification

1. **Core Web Vitals**:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

2. **API Response Times**:
   - Authentication: < 500ms
   - Data fetching: < 1s
   - File uploads: < 5s

## Monitoring and Maintenance

### 1. Setup Monitoring

**Vercel Analytics**:
```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Error Tracking (Sentry)**:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 2. Health Monitoring

Create health check endpoint:
```typescript
// src/app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    auth: await checkAuth(),
    storage: await checkStorage(),
    email: await checkEmail(),
  };
  
  const healthy = Object.values(checks).every(v => v);
  
  return Response.json({
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks,
  }, {
    status: healthy ? 200 : 503,
  });
}
```

### 3. Log Management

**Access Logs**:
```bash
# Real-time logs
vercel logs --follow

# Filter by function
vercel logs --filter="api/auth"

# Export logs
vercel logs --output=raw > logs.txt
```

### 4. Database Maintenance

**Regular Tasks**:
- Weekly vacuum operations
- Index optimization
- Query performance analysis
- Connection pool monitoring

**Monitoring Queries**:
```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Monitor connections
SELECT count(*) FROM pg_stat_activity;
```

## Rollback Procedures

### 1. Instant Rollback

**Via Dashboard**:
1. Go to Vercel Dashboard → Deployments
2. Find last stable deployment
3. Click menu → "Promote to Production"

**Via CLI**:
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### 2. Database Rollback

**Point-in-time Recovery**:
```sql
-- Restore to specific timestamp
SELECT pg_restore_point('before_deployment_2024_01_15');
```

**From Backup**:
1. Access Supabase Dashboard → Backups
2. Select backup point
3. Restore to new database
4. Update connection string

### 3. Emergency Procedures

**Enable Maintenance Mode**:
```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
}
```

## Performance Optimization

### 1. Build Optimization

```json
// vercel.json
{
  "functions": {
    "src/app/api/*/route.ts": {
      "maxDuration": 30
    },
    "src/app/api/cron/*/route.ts": {
      "maxDuration": 60
    }
  },
  "images": {
    "domains": ["res.cloudinary.com"]
  }
}
```

### 2. Caching Strategy

**Static Assets**:
```typescript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

**API Caching**:
```typescript
// Add caching headers to API responses
return Response.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  },
});
```

### 3. Database Optimization

**Indexes**:
```sql
-- Ensure critical indexes exist
CREATE INDEX idx_transactions_user_status ON transactions(user_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
```

### 4. Image Optimization

Configure Cloudinary transformations:
```typescript
const optimizedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
```

## Continuous Deployment

### GitHub Actions Setup

Create `.github/workflows/deploy.yml`:

```yaml
name: Production Deployment

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Cost Management

### Monitor Usage

Track these metrics in Vercel Dashboard:
- Function invocations
- Bandwidth usage
- Build minutes
- Edge middleware executions

### Optimization Tips

1. **Reduce Function Calls**:
   - Implement caching
   - Use ISR for dynamic pages
   - Batch API requests

2. **Optimize Images**:
   - Use WebP format
   - Implement lazy loading
   - Serve responsive images

3. **Minimize Build Time**:
   - Cache dependencies
   - Parallelize builds
   - Use turborepo

---

Last updated: 2025-07-03