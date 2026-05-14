-- Ridaos future Supabase schema plan
-- Operational tables for order lifecycle, QA, production notes and internal tracking.
-- Planning only. Do not execute automatically from the frontend runtime.

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  event_type text not null,
  from_status text,
  to_status text,
  actor_profile_id uuid,
  actor_label text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  author_profile_id uuid,
  body text not null,
  visibility text not null default 'internal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artwork_reviews (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.artwork_uploads(id) on delete cascade,
  reviewer_profile_id uuid,
  status text not null,
  summary text,
  checklist jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.order_events is 'Immutable lifecycle log for status changes, payment milestones and shipping events.';
comment on table public.admin_notes is 'Internal comments and production notes that must not be exposed publicly.';
comment on table public.artwork_reviews is 'Structured review outcomes for uploaded artwork and reupload loops.';

-- Suggested lifecycle seed values:
-- draft, pending_review, artwork_received, artwork_checking, artwork_approved,
-- needs_changes, awaiting_payment, paid, queued_for_production, in_production,
-- quality_check, ready_for_pickup, shipped, delivered, cancelled.
