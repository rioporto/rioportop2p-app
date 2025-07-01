# Deployment Guide for RioPortoP2P App

This guide provides comprehensive instructions for deploying the RioPortoP2P application to Vercel, including environment variable configuration, troubleshooting common issues, and post-deployment verification steps.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Vercel Deployment Instructions](#vercel-deployment-instructions)
3. [Environment Variables](#environment-variables)
4. [Troubleshooting Common Issues](#troubleshooting-common-issues)
5. [Post-Deployment Checklist](#post-deployment-checklist)

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

---

Last updated: 2025-07-01