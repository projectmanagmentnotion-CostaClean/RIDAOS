-- Isolated DTI commerce data model. Never applied to a hosted project by this migration.
create schema if not exists dti_private;
revoke all on schema dti_private from public, anon, authenticated;
grant usage on schema dti_private to service_role;

create table public.dti_orders (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  request_hash text not null,
  owner_id uuid references auth.users(id) on delete set null,
  guest_access_token_hash text,
  customer_email text not null,
  customer_phone text not null,
  meters numeric(7,1) not null check (meters >= 1),
  product_code text not null default 'dti-innuro' check (product_code = 'dti-innuro'),
  unit_price_cents integer not null default 1500 check (unit_price_cents = 1500),
  product_total_cents integer not null check (product_total_cents >= 1500),
  product_vat_cents integer not null check (product_vat_cents >= 0),
  shipping_method text not null check (shipping_method in ('pickup', 'standard')),
  shipping_total_cents integer not null check (shipping_total_cents in (0, 500)),
  shipping_vat_cents integer not null check (shipping_vat_cents >= 0),
  adaptation_requested boolean not null default false,
  adaptation_quote_id uuid,
  total_cents integer not null check (total_cents >= product_total_cents),
  currency_code text not null default 'EUR' check (currency_code = 'EUR'),
  status text not null default 'awaiting_artwork' check (status in (
    'awaiting_artwork', 'awaiting_artwork_review', 'awaiting_manual_quote',
    'awaiting_payment', 'paid_awaiting_technical_review', 'queued_for_production', 'cancelled'
  )),
  payment_status text not null default 'not_ready' check (payment_status in (
    'not_ready', 'unpaid', 'pending', 'paid', 'failed', 'cancelled'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((owner_id is not null) or (guest_access_token_hash is not null)),
  check ((shipping_method = 'pickup' and shipping_total_cents = 0) or
         (shipping_method = 'standard' and shipping_total_cents = 500)),
  check (not adaptation_requested or status not in ('awaiting_payment', 'paid_awaiting_technical_review', 'queued_for_production') or adaptation_quote_id is not null),
  check (adaptation_requested or adaptation_quote_id is null)
);

create table public.dti_adaptation_quotes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.dti_orders(id) on delete cascade,
  quote_version integer not null check (quote_version > 0),
  hours numeric(7,2) not null check (hours > 0),
  hourly_rate_cents integer not null default 3500 check (hourly_rate_cents = 3500),
  net_cents integer generated always as (round(hours * hourly_rate_cents)::integer) stored,
  vat_rate_basis_points integer not null default 2100 check (vat_rate_basis_points = 2100),
  vat_cents integer generated always as (round(hours * hourly_rate_cents * 0.21)::integer) stored,
  total_cents integer generated always as (round(hours * hourly_rate_cents * 1.21)::integer) stored,
  status text not null default 'awaiting_customer_approval' check (status in (
    'awaiting_customer_approval', 'approved', 'rejected', 'superseded', 'expired'
  )),
  approved_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (order_id, quote_version),
  check ((status = 'approved') = (approved_at is not null))
);

alter table public.dti_orders
  add constraint dti_orders_adaptation_quote_fk
  foreign key (adaptation_quote_id) references public.dti_adaptation_quotes(id) on delete restrict;

create table public.dti_artwork_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.dti_orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (order_id)
);

create table public.dti_artwork_versions (
  id uuid primary key default gen_random_uuid(),
  artwork_file_id uuid not null references public.dti_artwork_files(id) on delete cascade,
  version_number integer not null check (version_number > 0),
  bucket_id text not null default 'dti-artwork' check (bucket_id = 'dti-artwork'),
  storage_path text not null unique,
  original_file_name text not null,
  format text not null check (format in ('PNG', 'PDF', 'AI', 'PSD', 'SVG', 'CDR')),
  mime_type text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0 and file_size_bytes <= 262144000),
  sha256_hex text check (sha256_hex is null or sha256_hex ~ '^[0-9a-f]{64}$'),
  validation_status text not null default 'pending_upload' check (validation_status in (
    'pending_upload', 'pending_server_validation', 'passed', 'failed', 'manual_review'
  )),
  validation_summary jsonb not null default '{}'::jsonb check (jsonb_typeof(validation_summary) = 'object'),
  client_accepted_at timestamptz,
  uploaded_at timestamptz,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (artwork_file_id, version_number)
);

create table public.dti_artwork_events (
  id uuid primary key default gen_random_uuid(),
  artwork_version_id uuid not null references public.dti_artwork_versions(id) on delete cascade,
  event_type text not null check (event_type in (
    'upload_started', 'upload_validated', 'upload_rejected', 'client_accepted',
    'client_replaced', 'technical_review_approved', 'technical_review_rejected', 'revision_requested'
  )),
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_kind text not null check (actor_kind in ('customer', 'designer', 'production', 'admin', 'system')),
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create table public.dti_artwork_reviews (
  id uuid primary key default gen_random_uuid(),
  artwork_version_id uuid not null references public.dti_artwork_versions(id) on delete cascade,
  reviewer_user_id uuid not null references auth.users(id) on delete restrict,
  decision text not null check (decision in ('approved', 'rejected', 'revision_requested')),
  summary text not null,
  checklist jsonb not null default '[]'::jsonb check (jsonb_typeof(checklist) = 'array'),
  created_at timestamptz not null default now()
);

create table public.dti_staff_permissions (
  user_id uuid not null references auth.users(id) on delete cascade,
  permission text not null check (permission in (
    'review_artwork', 'manage_quotes', 'manage_production', 'manage_payments'
  )),
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (user_id, permission)
);

create table public.dti_payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.dti_orders(id) on delete cascade,
  provider text not null default 'stripe' check (provider = 'stripe'),
  idempotency_key text not null unique,
  stripe_payment_intent_id text unique,
  amount_cents integer not null check (amount_cents > 0),
  currency_code text not null default 'EUR' check (currency_code = 'EUR'),
  status text not null default 'creating' check (status in (
    'creating', 'requires_payment_method', 'requires_action', 'processing',
    'succeeded', 'failed', 'cancelled'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dti_stripe_events (
  stripe_event_id text primary key,
  event_type text not null,
  payment_intent_id text,
  processed boolean not null default false,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create table public.dti_order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.dti_orders(id) on delete cascade,
  event_type text not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_kind text not null check (actor_kind in ('customer', 'designer', 'production', 'admin', 'system', 'stripe')),
  idempotency_key text unique,
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create index dti_orders_owner_created_idx on public.dti_orders(owner_id, created_at desc);
create index dti_orders_status_created_idx on public.dti_orders(status, created_at);
create index dti_artwork_versions_file_idx on public.dti_artwork_versions(artwork_file_id, version_number desc);
create index dti_payment_attempts_order_idx on public.dti_payment_attempts(order_id, created_at desc);
create unique index dti_payment_attempts_one_live_per_order_idx
  on public.dti_payment_attempts(order_id)
  where status in ('creating', 'requires_payment_method', 'requires_action', 'processing');
create index dti_order_events_order_idx on public.dti_order_events(order_id, created_at desc);

alter table public.dti_orders enable row level security;
alter table public.dti_adaptation_quotes enable row level security;
alter table public.dti_artwork_files enable row level security;
alter table public.dti_artwork_versions enable row level security;
alter table public.dti_artwork_events enable row level security;
alter table public.dti_artwork_reviews enable row level security;
alter table public.dti_staff_permissions enable row level security;
alter table public.dti_payment_attempts enable row level security;
alter table public.dti_stripe_events enable row level security;
alter table public.dti_order_events enable row level security;

revoke all on public.dti_orders, public.dti_adaptation_quotes, public.dti_artwork_files,
  public.dti_artwork_versions, public.dti_artwork_events, public.dti_artwork_reviews,
  public.dti_staff_permissions, public.dti_payment_attempts, public.dti_stripe_events,
  public.dti_order_events from anon, authenticated;
grant select, insert, update, delete on public.dti_orders, public.dti_adaptation_quotes,
  public.dti_artwork_files, public.dti_artwork_versions, public.dti_artwork_events,
  public.dti_artwork_reviews, public.dti_staff_permissions, public.dti_payment_attempts,
  public.dti_stripe_events, public.dti_order_events to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dti-artwork', 'dti-artwork', false, 262144000,
  array['image/png', 'application/pdf', 'application/postscript', 'image/vnd.adobe.photoshop', 'image/svg+xml', 'application/vnd.corel-draw']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function dti_private.process_stripe_payment_event(
  p_event_id text,
  p_event_type text,
  p_payment_intent_id text,
  p_amount_cents integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt public.dti_payment_attempts%rowtype;
  v_existing_event public.dti_stripe_events%rowtype;
  v_target_status text;
begin
  insert into public.dti_stripe_events (stripe_event_id, event_type, payment_intent_id)
  values (p_event_id, p_event_type, p_payment_intent_id)
  on conflict (stripe_event_id) do nothing;

  if not found then
    select * into v_existing_event from public.dti_stripe_events
      where stripe_event_id = p_event_id for update;
    if not found or v_existing_event.processed then
      return false;
    end if;
  end if;

  select * into v_attempt
  from public.dti_payment_attempts
  where stripe_payment_intent_id = p_payment_intent_id
  for update;

  if not found then
    update public.dti_stripe_events
      set processed = false, processed_at = now()
      where stripe_event_id = p_event_id;
    return false;
  end if;

  if v_attempt.amount_cents <> p_amount_cents then
    raise exception 'Stripe amount does not match the stored payment attempt';
  end if;

  if p_event_type = 'payment_intent.succeeded' and not exists (
    select 1
    from public.dti_orders o
    join public.dti_artwork_files f on f.order_id = o.id
    join lateral (
      select v.* from public.dti_artwork_versions v
      where v.artwork_file_id = f.id order by v.version_number desc limit 1
    ) latest on true
    where o.id = v_attempt.order_id
      and o.status = 'awaiting_payment' and o.payment_status in ('unpaid', 'pending')
      and latest.client_accepted_at is not null
      and latest.validation_status in ('passed', 'manual_review')
      and (latest.format not in ('AI', 'PSD', 'SVG', 'CDR') or exists (
        select 1 from public.dti_artwork_reviews r
        where r.artwork_version_id = latest.id and r.decision = 'approved'
        order by r.created_at desc limit 1
      ))
      and (not o.adaptation_requested or exists (
        select 1 from public.dti_adaptation_quotes q where q.id = o.adaptation_quote_id
          and q.order_id = o.id and q.status = 'approved'
      ))
  ) then
    raise exception 'Order is not eligible for payment completion';
  end if;

  v_target_status := case p_event_type
    when 'payment_intent.succeeded' then 'succeeded'
    when 'payment_intent.payment_failed' then 'failed'
    when 'payment_intent.canceled' then 'cancelled'
    when 'payment_intent.processing' then 'processing'
    when 'payment_intent.requires_action' then 'requires_action'
    else null
  end;

  if v_target_status is null then
    update public.dti_stripe_events set processed = true, processed_at = now()
      where stripe_event_id = p_event_id;
    return true;
  end if;

  update public.dti_payment_attempts
    set status = v_target_status, updated_at = now()
    where id = v_attempt.id;

  update public.dti_orders
    set payment_status = case when v_target_status = 'succeeded' then 'paid'
      when v_target_status = 'failed' then 'failed'
      when v_target_status = 'cancelled' then 'cancelled'
      when v_target_status = 'processing' or v_target_status = 'requires_action' then 'pending'
      else payment_status end,
      status = case when v_target_status = 'succeeded' then 'paid_awaiting_technical_review' else status end,
      updated_at = now()
    where id = v_attempt.order_id;

  insert into public.dti_order_events (
    order_id, event_type, actor_kind, idempotency_key, details
  ) values (
    v_attempt.order_id, p_event_type, 'stripe', p_event_id,
    jsonb_build_object('payment_intent_id', p_payment_intent_id, 'amount_cents', p_amount_cents)
  ) on conflict (idempotency_key) do nothing;

  update public.dti_stripe_events set processed = true, processed_at = now()
    where stripe_event_id = p_event_id;
  return true;
end;
$$;

revoke all on function dti_private.process_stripe_payment_event(text, text, text, integer) from public, anon, authenticated;
grant execute on function dti_private.process_stripe_payment_event(text, text, text, integer) to service_role;
