# 🚀 Deployment Guide

This guide covers deploying the Rio Porto P2P platform to production using Vercel.

## Prerequisites

- Completed [Setup Guide](./SETUP.md)
- Vercel account
- GitHub repository
- Production Supabase project

## 1. Production Supabase Setup

### Create Production Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project for production
3. Note the project URL and keys

### Configure Production Database
```bash
# Link to production project
supabase link --project-ref your-production-project-ref

# Deploy migrations
supabase db push
```

### Configure Auth Settings
1. Go to Authentication > Settings
2. Set Site URL to your production domain
3. Add production domain to redirect URLs
4. Configure Google OAuth with production credentials

### Configure Storage
1. Create storage buckets:
   - `kyc-documents`
   - `payment-proofs`
   - `course-materials`
2. Set up proper bucket policies

## 2. Vercel Deployment

### Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings

### Build Configuration
Vercel will automatically detect Next.js. Ensure these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Environment Variables
Configure these in Vercel Dashboard > Settings > Environment Variables:

#### Required Variables
```bash
# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_TEAM_ID=your_vercel_team_id
```

#### Optional Variables
```bash
# PIX Payment Providers
MERCADOPAGO_ACCESS_TOKEN=your_production_mercadopago_token
PAGSEGURO_TOKEN=your_production_pagseguro_token
GERENCIANET_CLIENT_ID=your_production_gerencianet_client_id
GERENCIANET_CLIENT_SECRET=your_production_gerencianet_client_secret

# Crypto API Keys
COINGECKO_API_KEY=your_production_coingecko_key
CRYPTOCOMPARE_API_KEY=your_production_cryptocompare_key
```

### Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Test the deployed application

## 3. Custom Domain Setup

### Add Domain to Vercel
1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS settings

### DNS Configuration
Add these DNS records:
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL Certificate
Vercel automatically provisions SSL certificates for custom domains.

## 4. Cron Jobs Setup

### Configure Vercel Cron
Create `vercel.json` in project root:
```json
{
  "crons": [
    {
      "path": "/api/cron/update-prices",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Verify Cron Jobs
1. Deploy the configuration
2. Check Vercel Dashboard > Functions
3. Monitor execution logs

## 5. Monitoring & Analytics

### Vercel Analytics
1. Go to Project Settings > Analytics
2. Enable Web Analytics
3. Monitor performance metrics

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- PostHog for product analytics

### Performance Monitoring
- Use Vercel Speed Insights
- Monitor Core Web Vitals
- Set up uptime monitoring

## 6. Security Configuration

### Content Security Policy
Add CSP headers in `next.config.js`:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}
```

### Rate Limiting
Implement rate limiting in API routes:
```javascript
// Example in API route
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})
```

## 7. Database Optimization

### Connection Pooling
Configure Supabase connection pooling:
1. Go to Settings > Database
2. Enable connection pooling
3. Use pooled connection string

### Indexing
Ensure proper indexes are created:
```sql
-- Example indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_crypto_prices_symbol_timestamp ON crypto_prices(symbol, created_at);
```

## 8. Backup Strategy

### Database Backups
1. Enable automated backups in Supabase
2. Set up daily backups
3. Test restore procedures

### File Storage Backups
1. Regular exports of storage buckets
2. Cloud storage replication
3. Disaster recovery plan

## 9. Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates active
- [ ] DNS records configured
- [ ] Cron jobs setup

### Post-deployment
- [ ] Test all authentication flows
- [ ] Verify PIX payment integration
- [ ] Check real-time notifications
- [ ] Test admin dashboard
- [ ] Monitor error logs

### Performance Checks
- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database query performance
- [ ] CDN cache hit rates

## 10. CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 11. Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update Node.js version
- Review and update environment variables

### Performance Monitoring
- Monthly performance reviews
- Database query optimization
- CDN cache optimization
- Error rate monitoring

### Backup Verification
- Monthly restore tests
- Backup integrity checks
- Disaster recovery drills

## 12. Troubleshooting

### Common Deployment Issues

#### Build Failures
- Check TypeScript errors
- Verify environment variables
- Review build logs

#### Runtime Errors
- Check server logs
- Verify API endpoints
- Test database connections

#### Performance Issues
- Analyze bundle size
- Check database queries
- Monitor API response times

### Support Resources
- Vercel Documentation
- Supabase Documentation
- GitHub Issues
- Community Discord

## 13. Scaling Considerations

### Traffic Growth
- Monitor usage metrics
- Plan for database scaling
- Consider CDN optimization

### Feature Expansion
- Modular architecture
- API versioning
- Database schema evolution

## Support

For deployment issues:
- Check Vercel deployment logs
- Review Supabase project logs
- Contact support at contato@rioporto.com

---

**Happy deploying! 🌟**