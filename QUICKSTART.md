# ⚡ Genix Platform - Quick Start

Get up and running in 5 minutes.

---

## 📦 What You'll Need

- Node.js 18+ installed
- A code editor (VS Code recommended)
- Terminal/command line
- GitHub account (for OAuth)
- Supabase account (free tier OK)
- Stripe account (test mode OK)

---

## 🚀 Installation Steps

### 1. Extract & Navigate
```bash
cd genix-platform
```

### 2. Run Setup Script
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install all dependencies
- Create `.env.local` from template
- Set up directory structure

### 3. Configure Environment Variables

Open `.env.local` and fill in:

#### Supabase (https://supabase.com)
1. Create new project
2. Go to Settings > API
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

#### GitHub OAuth (https://github.com/settings/developers)
1. New OAuth App
2. Application name: "Genix Local Dev"
3. Homepage URL: `http://localhost:3000`
4. Authorization callback URL: `http://localhost:3000/api/auth/callback`
5. Copy:
   - Client ID → `GITHUB_CLIENT_ID`
   - Client Secret → `GITHUB_CLIENT_SECRET`

#### Stripe (https://stripe.com)
1. Create account
2. Go to Developers > API keys
3. Reveal test keys
4. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
5. For webhook secret (later):
   - Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
   - Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### 4. Set Up Database

In Supabase SQL Editor, run:

```sql
-- Create templates table
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

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(id),
  buyer_id UUID REFERENCES auth.users(id),
  price INTEGER NOT NULL,
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Templates are viewable by everyone"
  ON templates FOR SELECT USING (true);

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT USING (auth.uid() = buyer_id);
```

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 🎉

---

## ✅ Verify Installation

Check these pages work:
- [x] http://localhost:3000 (Homepage)
- [x] http://localhost:3000/marketplace (Marketplace)
- [x] http://localhost:3000/for-developers (Developer landing)

---

## 🎨 Add Your Branding

1. Add your logo to `public/genix-logo.svg`
2. Add your character to `public/genix-character.svg`
3. Update colors in `tailwind.config.js`

---

## 🐛 Common Issues

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Cannot find module '@/components/...'"
TypeScript paths issue. Restart VS Code.

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill
npm run dev
```

### Supabase connection error
- Check URL doesn't have trailing slash
- Verify keys are correct
- Check project isn't paused (free tier limitation)

---

## 📚 Next Steps

1. Read `README.md` for full documentation
2. Read `DEPLOYMENT.md` for production setup
3. Customize homepage copy in `components/home/`
4. Add sample templates to database
5. Test checkout flow with Stripe test cards

---

## 🆘 Get Help

- GitHub Issues: [your-repo]/issues
- Email: support@genix.so
- Discord: [invite-link]

---

**Happy building! 🚀**
