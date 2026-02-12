-- Genix MVP Phase 2/3 schema additions
-- Run in Supabase SQL editor before using new moderation, consultation, payout, and future-feature APIs.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Moderation metadata support (stored in templates.preview_data JSONB)
-- Expected keys:
--   review_status: pending | approved | rejected
--   review_feedback: text
--   reviewed_at: ISO timestamp
--   reviewed_by: uuid
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- Consultations
-- ---------------------------------------------------------------------------
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id),
  developer_id uuid not null references auth.users(id),
  template_id uuid references public.templates(id),
  title text not null default 'Consultation Session',
  notes text,
  scheduled_for timestamptz not null,
  duration_minutes integer not null default 60,
  amount integer not null,
  platform_fee integer not null,
  developer_earnings integer not null,
  status text not null default 'pending_payment',
  payout_status text not null default 'pending',
  payment_reference text,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint consultations_status_check check (status in ('pending_payment', 'scheduled', 'completed', 'cancelled'))
);

create index if not exists consultations_buyer_idx on public.consultations (buyer_id, created_at desc);
create index if not exists consultations_developer_idx on public.consultations (developer_id, created_at desc);
create index if not exists consultations_status_idx on public.consultations (status, payout_status);

-- ---------------------------------------------------------------------------
-- Payout transfer ledger
-- ---------------------------------------------------------------------------
create table if not exists public.payout_transfers (
  id uuid primary key default gen_random_uuid(),
  developer_id uuid not null references auth.users(id),
  source_type text not null,
  source_id uuid not null,
  amount integer not null,
  status text not null default 'queued',
  payout_reference text not null,
  transfer_response jsonb,
  error_message text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  constraint payout_source_type_check check (source_type in ('purchase', 'consultation')),
  constraint payout_status_check check (status in ('queued', 'processing', 'paid', 'manual_required', 'failed'))
);

create unique index if not exists payout_transfers_unique_source_idx
  on public.payout_transfers (source_type, source_id)
  where status in ('queued', 'processing', 'paid');

create index if not exists payout_transfers_developer_idx on public.payout_transfers (developer_id, created_at desc);

-- ---------------------------------------------------------------------------
-- AI customization requests/results
-- ---------------------------------------------------------------------------
create table if not exists public.ai_customizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  template_id uuid not null references public.templates(id),
  prompt text not null,
  input_config jsonb not null default '{}'::jsonb,
  generated_patch jsonb,
  status text not null default 'queued',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_customizations_status_check check (status in ('queued', 'generated', 'applied', 'failed'))
);

create index if not exists ai_customizations_user_idx on public.ai_customizations (user_id, created_at desc);
create index if not exists ai_customizations_template_idx on public.ai_customizations (template_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Team collaboration
-- ---------------------------------------------------------------------------
create table if not exists public.team_workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.team_workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'viewer',
  invited_by uuid references auth.users(id),
  joined_at timestamptz not null default now(),
  constraint team_members_role_check check (role in ('owner', 'admin', 'editor', 'viewer')),
  constraint team_members_unique unique (team_id, user_id)
);

create index if not exists team_members_user_idx on public.team_members (user_id, joined_at desc);

-- ---------------------------------------------------------------------------
-- Developer API keys
-- ---------------------------------------------------------------------------
create table if not exists public.developer_api_keys (
  id uuid primary key default gen_random_uuid(),
  developer_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  key_hash text not null,
  key_prefix text not null,
  scopes text[] not null default array['read:templates']::text[],
  last_used_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint developer_api_keys_key_hash_unique unique (key_hash)
);

create index if not exists developer_api_keys_dev_idx on public.developer_api_keys (developer_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Optional helper trigger for updated_at timestamps
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists consultations_set_updated_at on public.consultations;
create trigger consultations_set_updated_at
before update on public.consultations
for each row execute function public.set_updated_at();

drop trigger if exists ai_customizations_set_updated_at on public.ai_customizations;
create trigger ai_customizations_set_updated_at
before update on public.ai_customizations
for each row execute function public.set_updated_at();

drop trigger if exists team_workspaces_set_updated_at on public.team_workspaces;
create trigger team_workspaces_set_updated_at
before update on public.team_workspaces
for each row execute function public.set_updated_at();
