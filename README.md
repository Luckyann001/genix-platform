# Genix Platform - Production-Ready Setup

> **A marketplace for production-ready websites built by professional developers**

Built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Stripe.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Supabase (create at supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub OAuth (create at github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Stripe (create at stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
genix-platform/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── marketplace/
│   │   └── page.tsx            # Marketplace listing page
│   ├── template/
│   │   └── [id]/
│   │       └── page.tsx        # Template detail page
│   ├── for-developers/
│   │   └── page.tsx            # Developer landing page
│   ├── trust/
│   │   ├── code-ownership/
│   │   ├── how-previews-work/
│   │   ├── customization/
│   │   └── support/            # Trust pages
│   └── api/
│       ├── templates/          # Template CRUD
│       ├── checkout/           # Stripe integration
│       └── webhooks/           # Stripe webhooks
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Global header with nav
│   │   └── Footer.tsx          # Global footer
│   ├── home/
│   │   ├── Hero.tsx            # Homepage hero section
│   │   ├── HowItWorks.tsx      # 4-step process
│   │   ├── WhyNotAI.tsx        # Comparison table
│   │   ├── ForFounders.tsx     # Founder benefits
│   │   ├── ForDevelopers.tsx   # Developer benefits
│   │   ├── TrustStrip.tsx      # Trust indicators
│   │   └── CTA.tsx             # Final CTA section
│   ├── marketplace/
│   │   ├── MarketplaceHero.tsx
│   │   ├── MarketplaceFilters.tsx
│   │   └── TemplateGrid.tsx
│   └── ui/                      # Reusable UI components
│
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── stripe.ts               # Stripe client
│   └── utils.ts                # Utility functions
│
├── public/
│   ├── genix-logo.svg          # Your logo here
│   └── genix-character.svg     # Your character here
│
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## 🎨 Design System

### Colors

**Primary** (Blue):
- 50-900 scale defined in Tailwind config
- Use: CTA buttons, links, accents

**Accent** (Purple):
- 50-900 scale
- Use: Secondary accents, highlights

### Typography

**Font Families:**
- `font-sans` (Inter) - Body text
- `font-display` (Clash Display) - Headings

**Font Scales:**
- Headings: `text-4xl` to `text-7xl`
- Body: `text-base` to `text-xl`

### Components

**Buttons:**
```tsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-ghost">Ghost</button>
```

**Cards:**
```tsx
<div className="card">Basic card</div>
<div className="card card-hover">Hoverable card</div>
```

**Sections:**
```tsx
<section className="section">Full section</section>
<section className="section-sm">Small section</section>
```

---

## 🗄️ Database Schema (Supabase)

### Tables to Create

#### `templates`
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  github_url TEXT NOT NULL,
  demo_url TEXT,
  features TEXT[],
  preview_data JSONB,
  developer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `purchases`
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(id),
  buyer_id UUID REFERENCES auth.users(id),
  price INTEGER NOT NULL,
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 💳 Stripe Integration

### Setup

1. Create Stripe account at stripe.com
2. Get API keys from Dashboard > Developers > API keys
3. Add to `.env.local`
4. Set up webhook endpoint in Stripe Dashboard

### Webhook Events

Listen for these events:
- `checkout.session.completed` - Process successful purchase
- `payment_intent.payment_failed` - Handle failed payments

---

## 🔐 Authentication (GitHub OAuth)

### Setup

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Create new OAuth App:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback`
3. Copy Client ID and Client Secret to `.env.local`

---

## 📦 Key Dependencies

- **next**: 14.2.5 - React framework
- **react**: 18.3.1 - UI library
- **@supabase/supabase-js**: Database & auth
- **stripe**: Payment processing
- **framer-motion**: Animations
- **lucide-react**: Icons
- **tailwindcss**: Styling

---

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Update Environment URLs

In `.env.local`:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

In GitHub OAuth settings:
- Homepage URL: `https://your-domain.vercel.app`
- Callback URL: `https://your-domain.vercel.app/api/auth/callback`

In Stripe webhook settings:
- Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`

---

## 🎯 Key Pages

### Homepage (`/`)
- Hero with value proposition
- Trust strip
- How it works (4 steps)
- Why not AI/freelancers comparison
- For founders section
- For developers section
- Final CTA

### Marketplace (`/marketplace`)
- Search and filters
- Template grid with cards
- Category filters
- Price filters
- Feature filters

### Template Detail (`/template/[id]`)
- Interactive preview
- What you can customize
- What requires developer
- Developer profile
- Pricing and CTA
- What you get after purchase

### For Developers (`/for-developers`)
- Benefits of listing
- Revenue model (70/30 split)
- How to submit template
- Code ownership guarantees

### Trust Pages (`/trust/*`)
- `/trust/code-ownership` - How we protect developer IP
- `/trust/how-previews-work` - Technical explanation
- `/trust/customization` - What buyers can/can't change
- `/trust/support` - Support and refund policy

---

## 🔧 Customization

### Add Your Branding

1. Replace logo: `public/genix-logo.svg`
2. Replace character: `public/genix-character.svg`
3. Update colors in `tailwind.config.js`:

```js
colors: {
  primary: { /* your blue */ },
  accent: { /* your purple */ },
}
```

### Update Content

All text is in component files. Key files to update:
- `components/home/Hero.tsx` - Main headline
- `components/home/HowItWorks.tsx` - Process steps
- `components/home/WhyNotAI.tsx` - Comparison
- `components/layout/Footer.tsx` - Footer links

---

## 📊 Analytics Setup (Optional)

### Add Plausible

1. Sign up at plausible.io
2. Add to `app/layout.tsx`:

```tsx
<Script
  defer
  data-domain="yourdomain.com"
  src="https://plausible.io/js/script.js"
/>
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection issues
- Check URL and keys in `.env.local`
- Ensure tables are created
- Check RLS policies

### Stripe webhook not working
- Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📚 Next Steps

### Must-Have Features for V1

- [ ] Complete authentication flow
- [ ] Template submission form for developers
- [ ] Stripe checkout integration
- [ ] Template preview renderer
- [ ] Purchase confirmation emails
- [ ] User dashboard

### Nice-to-Have for V2

- [ ] Template customization tool
- [ ] Developer consulting booking
- [ ] Review system
- [ ] Search with Algolia
- [ ] Analytics dashboard

---

## 🤝 Contributing

This is a private codebase, but if you're a developer:

1. Fork the repo
2. Create feature branch
3. Submit PR

---

## 📄 License

Proprietary - All rights reserved

---

## 🆘 Support

- Email: support@genix.so
- Discord: [Join our community]
- Docs: docs.genix.so

---

Built with ❤️ by the Genix team
