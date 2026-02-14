# Genix Platform

Genix is a marketplace for production-ready web templates where:
- founders buy, customize, and launch quickly
- developers submit and monetize templates
- admins moderate templates, process refunds, and run payouts

Built with Next.js 14 (App Router), TypeScript, Supabase, Paystack, and optional OpenAI-powered assistants.

## Table of Contents
1. Overview
2. Current Feature Set
3. Tech Stack
4. Project Structure
5. Prerequisites
6. Local Setup
7. Environment Variables
8. Supabase Setup
9. Paystack Setup
10. Admin Setup
11. AI Setup (Optional)
12. Running the App
13. User Flows
14. API Surface (High-Level)
15. Database Model
16. Deployment Checklist
17. Troubleshooting
18. Scripts
19. Notes and Known Gaps

## Overview
Genix provides:
- template marketplace browsing and details
- developer template submission and moderation flow
- purchase checkout via Paystack
- webhook-based payment confirmation
- consultation booking scaffolding with fee split
- payout operations dashboards
- refund request flow with admin approval/rejection
- AI assistants for moderation, discovery, support, launch guidance, and submission copy

## Current Feature Set
- Landing pages and trust pages:
  - `app/page.tsx`
  - `app/how-it-works/page.tsx`
  - `app/trust/*`
- Marketplace and template details:
  - `app/templates/page.tsx`
  - `app/templates/[slug]/page.tsx`
  - `components/templates/*`
- Auth entry and role-oriented login UI:
  - `app/login/page.tsx`
  - `app/login/LoginClient.tsx`
- Developer portal:
  - `app/developer/page.tsx`
  - `app/developer/earnings/page.tsx`
  - `app/developer/payout-settings/page.tsx`
  - `app/developer/payout-history/page.tsx`
- Template submission:
  - `app/submit/page.tsx`
  - `components/submit/SubmitTemplateForm.tsx`
  - `app/api/templates/route.ts`
- Admin dashboards:
  - `app/admin/page.tsx`
  - `app/admin/templates/page.tsx`
  - `app/admin/payouts/page.tsx`
  - `app/admin/refunds/page.tsx`
- Payments and webhooks:
  - `app/api/checkout/create-session/route.ts`
  - `app/api/webhooks/paystack/route.ts`
  - `app/api/paystack/callback/route.ts`
  - `lib/paystack.ts`
- AI routes:
  - `app/api/ai/*`
  - `app/api/developer/submissions/ai-assist/route.ts`
  - `app/api/admin/templates/[id]/ai-review/route.ts`
  - `app/api/admin/refunds/[id]/ai-review/route.ts`

## Tech Stack
- Framework: Next.js 14 App Router
- Language: TypeScript
- UI: React 18 + Tailwind CSS
- Auth + DB: Supabase
- Payments: Paystack
- AI: OpenAI-compatible Chat Completions API (optional)
- Icons/Animation: lucide-react, framer-motion

## Project Structure
```txt
app/
  api/
    admin/
    ai/
    auth/
    checkout/
    consultations/
    developer/
    notifications/
    profile/
    purchases/
    refunds/
    support/
    templates/
    webhooks/
  admin/
  developer/
  templates/
  customize/
  launch-assistant/
  login/
components/
  admin/
  developer/
  founder/
  home/
  layout/
  submit/
  template-detail/
  templates/
lib/
  admin-auth.ts
  api-response.ts
  currency.ts
  llm.ts
  paystack.ts
  require-admin.ts
  require-auth.ts
  supabase/server.ts
  templates.ts
supabase/
  migrations/
public/
  brand/
```

## Prerequisites
- Node.js 18+
- npm
- Supabase project
- Paystack account
- OpenAI API key (optional)

## Local Setup
1. Install dependencies.
```bash
npm install
```

2. Create local environment file.
```bash
cp .env.local.example .env.local
```
If `.env.local.example` does not exist in your clone, create `.env.local` manually using the keys listed below.

3. Run database migration SQL in Supabase SQL Editor:
- `supabase/migrations/20260212_mvp_phase2.sql`

4. Start dev server.
```bash
npm run dev
```

5. Open:
- `http://localhost:3000`

## Environment Variables
The application currently reads these variables in code:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_PRIVATE_KEY`)
- `NEXT_PUBLIC_APP_URL`
- `PAYSTACK_SECRET_KEY`
- `ADMIN_EMAILS`
- `OPENAI_API_KEY` (optional)
- `OPENAI_API_URL` (optional override)
- `OPENAI_MODEL` (optional override)

Recommended `.env.local` template:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

NEXT_PUBLIC_APP_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_or_live_xxx

# Comma-separated list of admin emails
ADMIN_EMAILS=admin1@example.com,admin2@example.com

# Optional AI
OPENAI_API_KEY=sk-...
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
OPENAI_MODEL=gpt-4o-mini
```

## Supabase Setup
1. Create a project and copy URL + keys.
2. Run migration SQL:
- `supabase/migrations/20260212_mvp_phase2.sql`
3. Ensure your core tables from previous phases exist:
- `profiles`
- `templates`
- `purchases`
- `notifications` (if used in your deployment)
4. Verify new phase tables were created:
- `consultations`
- `payout_transfers`
- `ai_customizations`
- `team_workspaces`
- `team_members`
- `developer_api_keys`
- `refund_requests`

## Paystack Setup
1. Set `PAYSTACK_SECRET_KEY`.
2. Configure webhook endpoint in Paystack dashboard:
- `https://YOUR_DOMAIN/api/webhooks/paystack`
3. Ensure checkout callback URL base (`NEXT_PUBLIC_APP_URL`) is correct.

Relevant code:
- Checkout initialization: `app/api/checkout/create-session/route.ts`
- Webhook verification/handling: `app/api/webhooks/paystack/route.ts`
- Callback verification flow: `app/api/paystack/callback/route.ts`

## Admin Setup
Admin access is email-based.

1. Set `ADMIN_EMAILS` with comma-separated addresses.
2. Sign in using one of those addresses from `/login` (or footer shortcut: `Admin Login`).
3. Admin routes become available and protected by:
- `lib/admin-auth.ts`
- `lib/require-admin.ts`

Admin pages:
- `/admin`
- `/admin/templates`
- `/admin/payouts`
- `/admin/refunds`

Admin login shortcut in UI:
- Footer link: `/login?next=%2Fadmin`

## AI Setup (Optional)
Set `OPENAI_API_KEY` to activate AI features.

If no key is set, most AI helpers return fallback outputs.

AI-related modules/routes:
- `lib/llm.ts`
- `app/api/ai/customizations/route.ts`
- `app/api/ai/discovery/route.ts`
- `app/api/ai/recommendations/route.ts`
- `app/api/ai/launch-assistant/route.ts`
- `app/api/developer/submissions/ai-assist/route.ts`
- `app/api/admin/templates/[id]/ai-review/route.ts`
- `app/api/admin/refunds/[id]/ai-review/route.ts`

## Running the App
Development:
```bash
npm run dev
```

Production build locally:
```bash
npm run build
npm run start
```

Lint:
```bash
npm run lint
```

## User Flows
Founder flow:
1. Browse templates at `/templates`.
2. Open details `/templates/[slug]`.
3. Click buy in `PurchaseCard`.
4. Complete Paystack checkout.
5. On `charge.success`, webhook updates purchase to `completed`.
6. Buyer proceeds to customization/download/refund flows.

Developer flow:
1. Sign in.
2. Submit template at `/submit`.
3. Template enters pending review (`preview_data.review_status = pending`).
4. Admin approves/rejects.
5. Approved templates become publicly visible.

Admin flow:
1. Moderate templates at `/admin/templates`.
2. Review and process payouts at `/admin/payouts`.
3. Review refund requests at `/admin/refunds`.

## API Surface (High-Level)
Auth:
- `GET /api/auth/google`
- `GET /api/auth/github`
- `GET /api/auth/callback`
- `POST /api/auth/signout`

Templates + marketplace:
- `GET /api/templates`
- `POST /api/templates`
- `GET /api/templates/search`
- `GET /api/templates/[id]`
- `PATCH /api/templates/[id]`

Checkout + payments:
- `POST /api/checkout/create-session`
- `POST /api/webhooks/paystack`
- `GET /api/paystack/callback`

Admin:
- `GET /api/admin/templates`
- `POST /api/admin/templates/[id]/approve`
- `POST /api/admin/templates/[id]/reject`
- `POST /api/admin/templates/[id]/ai-review`
- `POST /api/admin/payouts`
- `GET /api/admin/refunds`
- `POST /api/admin/refunds/[id]/approve`
- `POST /api/admin/refunds/[id]/reject`
- `POST /api/admin/refunds/[id]/ai-review`

AI/future-feature scaffolds:
- `POST /api/ai/customizations`
- `POST /api/ai/discovery`
- `POST /api/ai/recommendations`
- `POST /api/ai/launch-assistant`
- `POST /api/developer/submissions/ai-assist`

Other:
- consultations, purchases, refunds, teams, support tickets/messages, profile, notifications, bookmarks, reviews, developer API keys.

## Database Model
Current schema is split across base schema + phase migrations.

Most recent migration file:
- `supabase/migrations/20260212_mvp_phase2.sql`

Adds:
- consultation booking records + payout status
- payout transfer ledger
- AI customization job tracking
- team collaboration entities
- developer API keys
- refund request tracking + paystack refund metadata
- profile payout fields
- `updated_at` trigger helper

## Deployment Checklist
1. Add all environment variables in Vercel.
2. Run latest SQL migration in Supabase production.
3. Configure Paystack webhook to production URL.
4. Configure `ADMIN_EMAILS` in production.
5. Set correct `NEXT_PUBLIC_APP_URL`.
6. Verify OAuth providers and redirect URLs in Supabase.
7. Smoke test critical flows:
- login
- template submit
- admin approve
- checkout
- webhook completion
- refund request

## Troubleshooting
Template submission returns internal server error:
- Check DB schema matches API expectations.
- Confirm required columns exist in `templates` table.
- Check server logs for returned DB error message.

AI submission assistant says unauthorized:
- Usually invalid/missing `OPENAI_API_KEY`.
- Re-check key in deployment env and redeploy.

Webhook not updating purchases:
- Verify Paystack webhook URL.
- Verify `PAYSTACK_SECRET_KEY`.
- Confirm signature verification is passing.

Admin page not visible:
- Ensure signed-in user email is listed in `ADMIN_EMAILS`.

Developer dashboard link visibility:
- Header currently shows it only for profiles with `user_type = developer` (and admins).

Vercel runtime crash: "Cookies can only be modified in a Server Action or Route Handler":
- Cause: Supabase auth refresh attempted cookie writes from Server Component execution paths.
- Fix in this repo: guarded cookie mutation in `lib/supabase/server.ts` so non-mutable contexts do not throw.
- Recommendation: keep cookie mutations in Route Handlers/Server Actions and validate auth flows after deployment.

## Scripts
- `npm run dev` - run local dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run ESLint

## Notes and Known Gaps
- Currency display has been migrated to USD in UI; ensure your business/payment settings align.
- Some future-feature routes are scaffolds and may require additional product hardening before public launch.
- Review and harden RLS policies in Supabase for production.
- If you are using Supabase OAuth callback exchange flow, confirm your callback implementation matches your auth strategy.

## Branding Assets
Brand files are now under:
- `public/brand/genix-character.svg`
- `public/brand/genix-logo-mark.svg`
- `public/brand/genix-logo-full.svg`

Used by:
- `components/layout/HeaderClient.tsx`
- `components/home/Hero.tsx`
- `app/layout.tsx`
