-- Buyer customization presets for live template preview MVP

create table if not exists public.buyer_template_customizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  purchase_id uuid not null references public.purchases(id) on delete cascade,
  template_id uuid not null references public.templates(id) on delete cascade,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint buyer_template_customizations_unique unique (user_id, purchase_id, template_id)
);

create index if not exists buyer_template_customizations_user_idx
  on public.buyer_template_customizations (user_id, updated_at desc);

create index if not exists buyer_template_customizations_template_idx
  on public.buyer_template_customizations (template_id, updated_at desc);

alter table if exists public.buyer_template_customizations enable row level security;

drop policy if exists "buyers can read their customizations" on public.buyer_template_customizations;
create policy "buyers can read their customizations"
  on public.buyer_template_customizations
  for select
  using (auth.uid() = user_id);

drop policy if exists "buyers can insert their customizations" on public.buyer_template_customizations;
create policy "buyers can insert their customizations"
  on public.buyer_template_customizations
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "buyers can update their customizations" on public.buyer_template_customizations;
create policy "buyers can update their customizations"
  on public.buyer_template_customizations
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists buyer_template_customizations_set_updated_at on public.buyer_template_customizations;
create trigger buyer_template_customizations_set_updated_at
before update on public.buyer_template_customizations
for each row execute function public.set_updated_at();
