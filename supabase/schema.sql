create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id text primary key,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user','admin')),
  plan text not null default 'free' check (plan in ('free','pro')),
  bonus_credits int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), user_id text not null default (auth.jwt()->>'sub'), name text not null,
  status text not null default 'draft' check (status in ('draft','processing','ready','error')),
  original_filename text, source_pdf_path text, datum text not null default 'SIRGAS2000', utm_zone text not null default '23S',
  vertices jsonb not null default '[]', area_m2 numeric, perimeter_m numeric, is_closed boolean, error_message text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists projects_user_idx on public.projects (user_id, created_at desc);
create table if not exists public.usage (user_id text not null, month date not null, memorials_used int not null default 0, primary key (user_id, month));
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(), user_id text not null, provider text not null check (provider in ('stripe','asaas','paddle')),
  provider_customer_id text, provider_subscription_id text, status text not null default 'inactive', plan text not null default 'pro',
  amount_cents int, currency text default 'BRL', current_period_end timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists subscriptions_user_idx on public.subscriptions (user_id);
create table if not exists public.audit_logs (id bigint generated always as identity primary key, actor_id text, target_user_id text, action text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now());
create table if not exists public.app_settings (key text primary key, value jsonb not null, updated_at timestamptz not null default now());
insert into public.app_settings (key, value) values ('free_monthly_limit','3'), ('plans','{"free":{"name":"Grátis","price_cents":0},"pro":{"name":"Pro","price_cents":0}}') on conflict (key) do nothing;

create or replace function public.set_updated_at() returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists projects_updated on public.projects; create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists profiles_updated on public.profiles; create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists subscriptions_updated on public.subscriptions; create trigger subscriptions_updated before update on public.subscriptions for each row execute function public.set_updated_at();

alter table public.profiles enable row level security; alter table public.projects enable row level security; alter table public.usage enable row level security; alter table public.subscriptions enable row level security; alter table public.audit_logs enable row level security; alter table public.app_settings enable row level security;
drop policy if exists "own projects" on public.projects; create policy "own projects" on public.projects for all to authenticated using ((auth.jwt()->>'sub') = user_id) with check ((auth.jwt()->>'sub') = user_id);
drop policy if exists "own profile read" on public.profiles; create policy "own profile read" on public.profiles for select to authenticated using ((auth.jwt()->>'sub') = user_id);
drop policy if exists "own usage read" on public.usage; create policy "own usage read" on public.usage for select to authenticated using ((auth.jwt()->>'sub') = user_id);
drop policy if exists "own subscription read" on public.subscriptions; create policy "own subscription read" on public.subscriptions for select to authenticated using ((auth.jwt()->>'sub') = user_id);
drop policy if exists "settings read" on public.app_settings; create policy "settings read" on public.app_settings for select to authenticated using (true);

insert into storage.buckets (id, name, public) values ('memoriais','memoriais',false) on conflict (id) do nothing;
drop policy if exists "own pdf upload" on storage.objects; create policy "own pdf upload" on storage.objects for insert to authenticated with check (bucket_id = 'memoriais' and (storage.foldername(name))[1] = (auth.jwt()->>'sub'));
drop policy if exists "own pdf read" on storage.objects; create policy "own pdf read" on storage.objects for select to authenticated using (bucket_id = 'memoriais' and (storage.foldername(name))[1] = (auth.jwt()->>'sub'));
