-- Ridaos future Supabase schema plan
-- Core entities for customer accounts, orders and artwork uploads.
-- Planning only. Do not execute automatically from the frontend runtime.

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text,
  company text,
  display_name text not null,
  billing_name text,
  billing_tax_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique,
  customer_id uuid not null references public.customers(id),
  status text not null,
  payment_status text not null,
  source text not null default 'web',
  currency_code text not null default 'EUR',
  subtotal_amount numeric(12,2) not null default 0,
  extras_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_type text not null,
  product_name text not null,
  configuration jsonb not null default '{}'::jsonb,
  pricing jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.artwork_uploads (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  order_item_id uuid references public.order_items(id) on delete cascade,
  storage_bucket text not null default 'artwork',
  storage_path text not null,
  file_name text not null,
  file_type text not null,
  file_size bigint not null default 0,
  format_label text,
  review_status text not null default 'pending_review',
  customer_note text,
  uploaded_at timestamptz not null default now()
);

comment on table public.customers is 'Customer master data used by accounts, quotes and order ownership.';
comment on table public.orders is 'Order header with commercial totals and lifecycle state.';
comment on table public.order_items is 'Order line items storing chosen product configuration and pricing snapshot.';
comment on table public.artwork_uploads is 'Uploaded customer artwork linked to an order or an order item.';
