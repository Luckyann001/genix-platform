-- Launch flow + optional exclusive purchase support

create extension if not exists pgcrypto;

alter table if exists public.templates
  add column if not exists exclusive_purchase_available boolean not null default false;

alter table if exists public.templates
  add column if not exists exclusive_price integer;

alter table if exists public.templates
  add column if not exists support_package_available boolean not null default false;

alter table if exists public.templates
  add column if not exists support_package_price integer;

alter table if exists public.purchases
  add column if not exists purchase_mode text not null default 'standard';

alter table if exists public.purchases
  add column if not exists support_package boolean not null default false;

alter table if exists public.purchases
  add column if not exists base_price integer;

alter table if exists public.purchases
  add column if not exists launch_status text not null default 'not_started';

alter table if exists public.purchases
  add column if not exists launch_live_url text;

alter table if exists public.purchases
  add column if not exists launch_admin_url text;

alter table if exists public.purchases
  add column if not exists launch_completed_at timestamptz;

alter table if exists public.purchases
  add constraint purchases_purchase_mode_check
    check (purchase_mode in ('standard', 'exclusive'));

alter table if exists public.purchases
  add constraint purchases_launch_status_check
    check (launch_status in ('not_started', 'onboarding', 'deploying', 'live', 'failed'));

create table if not exists public.buyer_hosting_connections (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  access_token text,
  provider_account_id text,
  metadata jsonb not null default '{}'::jsonb,
  connected_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint buyer_hosting_connections_provider_check check (provider in ('vercel'))
);

create unique index if not exists buyer_hosting_connections_unique
  on public.buyer_hosting_connections (buyer_id, provider);

create table if not exists public.buyer_launch_projects (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references public.templates(id) on delete cascade,
  hosting_connection_id uuid references public.buyer_hosting_connections(id) on delete set null,
  hosting_provider text not null default 'vercel',
  status text not null default 'onboarding',
  onboarding_data jsonb not null default '{}'::jsonb,
  deployment_data jsonb not null default '{}'::jsonb,
  post_launch_settings jsonb not null default '{}'::jsonb,
  live_url text,
  admin_panel_url text,
  admin_credentials jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint buyer_launch_projects_status_check check (status in ('onboarding', 'ready', 'deploying', 'live', 'failed')),
  constraint buyer_launch_projects_provider_check check (hosting_provider in ('vercel')),
  constraint buyer_launch_projects_unique_purchase unique (purchase_id)
);

create index if not exists buyer_launch_projects_buyer_idx
  on public.buyer_launch_projects (buyer_id, updated_at desc);

create index if not exists buyer_launch_projects_status_idx
  on public.buyer_launch_projects (status, updated_at desc);

alter table if exists public.buyer_hosting_connections enable row level security;
alter table if exists public.buyer_launch_projects enable row level security;

drop policy if exists "buyers can read hosting connections" on public.buyer_hosting_connections;
create policy "buyers can read hosting connections"
  on public.buyer_hosting_connections
  for select
  using (auth.uid() = buyer_id);

drop policy if exists "buyers can insert hosting connections" on public.buyer_hosting_connections;
create policy "buyers can insert hosting connections"
  on public.buyer_hosting_connections
  for insert
  with check (auth.uid() = buyer_id);

drop policy if exists "buyers can update hosting connections" on public.buyer_hosting_connections;
create policy "buyers can update hosting connections"
  on public.buyer_hosting_connections
  for update
  using (auth.uid() = buyer_id)
  with check (auth.uid() = buyer_id);

drop policy if exists "buyers can read launch projects" on public.buyer_launch_projects;
create policy "buyers can read launch projects"
  on public.buyer_launch_projects
  for select
  using (auth.uid() = buyer_id);

drop policy if exists "buyers can insert launch projects" on public.buyer_launch_projects;
create policy "buyers can insert launch projects"
  on public.buyer_launch_projects
  for insert
  with check (auth.uid() = buyer_id);

drop policy if exists "buyers can update launch projects" on public.buyer_launch_projects;
create policy "buyers can update launch projects"
  on public.buyer_launch_projects
  for update
  using (auth.uid() = buyer_id)
  with check (auth.uid() = buyer_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists buyer_hosting_connections_set_updated_at on public.buyer_hosting_connections;
create trigger buyer_hosting_connections_set_updated_at
before update on public.buyer_hosting_connections
for each row execute function public.set_updated_at();

drop trigger if exists buyer_launch_projects_set_updated_at on public.buyer_launch_projects;
create trigger buyer_launch_projects_set_updated_at
before update on public.buyer_launch_projects
for each row execute function public.set_updated_at();
