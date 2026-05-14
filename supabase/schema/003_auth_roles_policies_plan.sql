-- Ridaos future Supabase auth and authorization plan
-- Planning only. Do not execute automatically from the frontend runtime.

create table if not exists public.profiles (
  id uuid primary key,
  customer_id uuid references public.customers(id) on delete set null,
  email text not null unique,
  display_name text,
  role text not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_role_assignments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  granted_by uuid,
  granted_at timestamptz not null default now()
);

create table if not exists public.permission_grants (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  permission text not null,
  created_at timestamptz not null default now(),
  unique (role, permission)
);

comment on table public.profiles is 'Application-facing profile mapped to Supabase auth users.';
comment on table public.profile_role_assignments is 'Optional role history and explicit grants for internal operators.';
comment on table public.permission_grants is 'Role to permission matrix for application policies and admin screens.';

-- Planned roles:
-- guest, customer, admin, production, designer, super_admin

-- Planned permission seeds:
-- view_public_catalog
-- create_order
-- upload_artwork
-- view_own_orders
-- manage_orders
-- review_artwork
-- update_production_status
-- manage_catalog
-- manage_customers
-- manage_settings

-- Planned RLS strategy:
-- 1. customers can read/update only their own profile and own orders
-- 2. customers can read/write uploads only for their own orders
-- 3. admin and super_admin can manage all operational records
-- 4. production can update production-related records without full settings access
-- 5. designer can review artwork without full customer management access
