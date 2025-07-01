# Deployment Checklist for Rio Porto P2P

## Pre-Deployment Checks

### 1. Environment Variables
Make sure all these environment variables are set in Vercel:

- [ ] `NEXT_PUBLIC_STACK_PROJECT_ID` - Stack Auth project ID
- [ ] `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` - Stack Auth publishable key
- [ ] `NEXT_PUBLIC_STACK_BASE_URL` - Stack Auth base URL (default: https://app.stack-auth.com)
- [ ] `STACK_SECRET_SERVER_KEY` - Stack Auth secret key
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `RESEND_API_KEY` - Resend API key for email functionality

### 2. Build Configuration
- [x] `vercel.json` configured with:
  - Build command: `npm run build`
  - Output directory: `.next`
  - Install command: `npm install`
  - Region: `gru1` (São Paulo)
  - API routes max duration: 60 seconds
  - Security headers configured

### 3. Dependencies
- [x] All dependencies listed in `package.json`
- [x] No TypeScript compilation errors
- [x] Next.js 15.3.4 with React 19

### 4. Database
- [ ] Supabase database is set up and accessible
- [ ] Database schema is applied (see `src/lib/database.schema.sql`)
- [ ] Row Level Security (RLS) policies are configured

### 5. Authentication
- [ ] Stack Auth project is configured
- [ ] Authentication routes are working
- [ ] Email domain is verified in Resend

### 6. Build Output
- [x] `.next` directory is in `.gitignore`
- [x] `distDir` is set to `.next` in `next.config.ts`
- [x] Build output is not committed to repository

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **In Vercel Dashboard**
   - Import the GitHub repository
   - Framework preset: Next.js (should auto-detect)
   - Root directory: Leave as is (repository root)
   - Build settings will use `vercel.json`
   - Add all environment variables from `.env.example`

3. **Post-Deployment Verification**
   - [ ] Homepage loads correctly
   - [ ] API routes respond (check `/api/cotacao`)
   - [ ] Authentication flow works
   - [ ] Database connections work
   - [ ] Email sending works (if configured)

## Common Issues and Solutions

### Build Fails
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all dependencies: `npm install`
- Check environment variables are set

### API Routes Not Working
- Verify environment variables in Vercel
- Check API route file extensions (`.ts`)
- Review function timeout settings

### Database Connection Issues
- Verify Supabase URL and keys
- Check if database is accessible from Vercel's region
- Review RLS policies

### Authentication Issues
- Verify Stack Auth credentials
- Check cookie settings for production domain
- Ensure CORS is properly configured

## Performance Optimizations

1. **Edge Functions** (if needed)
   - Consider converting simple API routes to Edge Functions
   - Add `export const runtime = 'edge'` to route files

2. **Static Generation**
   - Pages like `/blog`, `/faq`, `/cursos` can be statically generated
   - Use `generateStaticParams` for dynamic routes

3. **Image Optimization**
   - Use Next.js Image component for all images
   - Configure image domains in `next.config.ts` if using external images

## Monitoring

1. **Vercel Analytics**
   - Enable Web Analytics in Vercel dashboard
   - Monitor Core Web Vitals

2. **Error Tracking**
   - Consider adding Sentry or similar error tracking
   - Monitor API route errors in Vercel Functions tab

3. **Logs**
   - Check Vercel Functions logs for API issues
   - Use `console.log` strategically in production