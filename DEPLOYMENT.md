# Genix Platform - Deployment Guide

Complete guide to deploying your Genix platform to production.

---

## 🎯 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Supabase production credentials
- [ ] GitHub OAuth app (production URLs)
- [ ] Stripe live mode keys
- [ ] Production domain set in `NEXT_PUBLIC_APP_URL`

### 2. Database
- [ ] All tables created in Supabase
- [ ] Row Level Security (RLS) policies configured
- [ ] Test data removed

### 3. Code
- [ ] All TypeScript errors fixed (`npm run build` succeeds)
- [ ] All console.logs removed or replaced with proper logging
- [ ] Error handling in place
- [ ] Loading states implemented

### 4. Content
- [ ] Logo and branding assets added
- [ ] Trust pages written
- [ ] Legal pages (Terms, Privacy) completed
- [ ] Sample templates added

---

## 🚀 Deployment to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/genix-platform.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 3: Add Environment Variables

In Vercel project settings, add all variables from `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
GITHUB_CLIENT_ID=Iv1.xxx
GITHUB_CLIENT_SECRET=xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

### Step 5: Configure Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., `genix.so`)
3. Update DNS records as instructed
4. Wait for SSL certificate to provision

---

## 🔧 Post-Deployment Configuration

### Update GitHub OAuth

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Update your OAuth app:
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback: `https://yourdomain.com/api/auth/callback`

### Configure Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
4. Copy webhook signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in Vercel

### Update Supabase URLs

1. Go to Supabase project settings
2. Update "Site URL" to `https://yourdomain.com`
3. Add to "Redirect URLs":
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com/api/auth/callback`

---

## 🔒 Security Checklist

### Supabase Row Level Security

Enable RLS on all tables:

```sql
-- Templates table
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are viewable by everyone"
  ON templates FOR SELECT
  USING (true);

CREATE POLICY "Developers can insert their own templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can update their own templates"
  ON templates FOR UPDATE
  USING (auth.uid() = developer_id);

-- Purchases table
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = buyer_id);

-- Profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Environment Variables

Never commit:
- API keys
- Database passwords
- OAuth secrets
- Webhook signing secrets

Add to `.gitignore`:
```
.env.local
.env*.local
```

### Rate Limiting

Add rate limiting to API routes (optional for V1):

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Enabled by default. View in Vercel dashboard under "Analytics".

### Sentry for Error Tracking

1. Create account at sentry.io
2. Install SDK:
```bash
npm install @sentry/nextjs
```

3. Initialize:
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### Plausible for Page Analytics

Add to `app/layout.tsx`:
```tsx
<Script
  defer
  data-domain="yourdomain.com"
  src="https://plausible.io/js/script.js"
/>
```

---

## 🗄️ Database Backups

### Supabase Backups

1. Go to Supabase project settings
2. Database > Backups
3. Enable daily backups (included in paid plans)

### Manual Backup

```bash
# Dump database
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Restore database
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

---

## 🚨 Incident Response

### If Site Goes Down

1. Check Vercel deployment status
2. Check Supabase status page
3. Check Stripe status page
4. Review error logs in Vercel
5. Check environment variables

### If Payments Fail

1. Check Stripe webhook delivery logs
2. Verify webhook signing secret
3. Check Stripe API keys (test vs live)
4. Review error logs in Vercel

### If Auth Fails

1. Check GitHub OAuth app settings
2. Verify callback URLs
3. Check Supabase auth settings
4. Review network requests in browser dev tools

---

## 📈 Performance Optimization

### Image Optimization

Use Next.js Image component:
```tsx
import Image from 'next/image'

<Image
  src="/template-screenshot.jpg"
  alt="Template preview"
  width={800}
  height={600}
  priority
/>
```

### Caching

Enable caching headers in `next.config.js`:
```js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' },
      ],
    },
  ]
}
```

### Database Indexing

Add indexes to frequently queried columns:
```sql
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_price ON templates(price);
CREATE INDEX idx_purchases_buyer ON purchases(buyer_id);
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

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
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📝 Post-Launch Checklist

### Week 1
- [ ] Monitor error rates
- [ ] Check page load times
- [ ] Verify all payments processing
- [ ] Test auth flows
- [ ] Check email deliverability

### Month 1
- [ ] Review analytics data
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Plan feature roadmap

---

## 🆘 Support Resources

- **Vercel Docs**: vercel.com/docs
- **Next.js Docs**: nextjs.org/docs
- **Supabase Docs**: supabase.com/docs
- **Stripe Docs**: stripe.com/docs

---

## 🎉 You're Live!

Your Genix platform is now deployed and ready for users.

**Next steps:**
1. Share with first beta users
2. Monitor metrics
3. Collect feedback
4. Iterate and improve

Good luck! 🚀
