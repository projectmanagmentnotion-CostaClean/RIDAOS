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
  useful_width_mm integer not null default 550 check (useful_width_mm = 550),
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
    'awaiting_artwork', 'awaiting_artwork_review', 'awaiting_manual_timeline',
    'awaiting_payment', 'paid_awaiting_technical_review', 'queued_for_production', 'cancelled'
  )),
  payment_status text not null default 'not_ready' check (payment_status in (
    'not_ready', 'unpaid', 'pending', 'paid', 'failed', 'cancelled'
  )),
  confirmed_lead_time text,
  lead_time_confirmed_at timestamptz,
  preparation_working_days integer check (preparation_working_days in (2, 3)),
  estimated_dispatch_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((owner_id is not null) or (guest_access_token_hash is not null)),
  check ((shipping_method = 'pickup' and shipping_total_cents = 0) or
         (shipping_method = 'standard' and shipping_total_cents = 500)),
  check (meters * 10 = round(meters * 10)),
  check (product_total_cents = round(meters * unit_price_cents)::integer),
  check (product_vat_cents = round(product_total_cents * 2100.0 / 12100)::integer),
  check (shipping_vat_cents = round(shipping_total_cents * 2100.0 / 12100)::integer),
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
  total_cents integer generated always as (round(hours * hourly_rate_cents)::integer + round(hours * hourly_rate_cents * 0.21)::integer) stored,
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
  idempotency_key text unique,
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);

create table public.dti_artwork_reviews (
  id uuid primary key default gen_random_uuid(),
  artwork_version_id uuid not null references public.dti_artwork_versions(id) on delete cascade,
  reviewer_user_id uuid not null references auth.users(id) on delete restrict,
  decision text not null check (decision in ('approved', 'rejected', 'revision_requested')),
  idempotency_key text not null unique,
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
  artwork_version_id uuid not null references public.dti_artwork_versions(id) on delete restrict,
  adaptation_quote_id uuid references public.dti_adaptation_quotes(id) on delete restrict,
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

create or replace function dti_private.create_dti_order(
  p_idempotency_key text,
  p_request_hash text,
  p_owner_id uuid,
  p_guest_access_token_hash text,
  p_customer_email text,
  p_customer_phone text,
  p_meters numeric,
  p_shipping_method text,
  p_adaptation_requested boolean,
  p_estimated_dispatch_date date
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.dti_orders%rowtype;
  v_product_total integer;
  v_shipping_total integer;
  v_product_vat integer;
  v_shipping_vat integer;
  v_status text;
  v_prep_days integer;
begin
  if p_meters < 1 or p_meters * 10 <> round(p_meters * 10) then raise exception 'invalid meter quantity'; end if;
  if p_shipping_method not in ('pickup', 'standard') then raise exception 'invalid shipping method'; end if;
  if (p_owner_id is null) = (p_guest_access_token_hash is null) then raise exception 'exactly one order access method is required'; end if;
  v_product_total := round(p_meters * 1500)::integer;
  v_shipping_total := case when p_shipping_method = 'standard' then 500 else 0 end;
  v_product_vat := round(v_product_total * 2100.0 / 12100)::integer;
  v_shipping_vat := round(v_shipping_total * 2100.0 / 12100)::integer;
  v_prep_days := case when p_meters <= 5 then 2 when p_meters <= 10 then 3 else null end;
  v_status := case when p_meters > 10 then 'awaiting_manual_timeline' else 'awaiting_artwork' end;
  if (p_meters > 10 and p_estimated_dispatch_date is not null) or (p_meters <= 10 and p_estimated_dispatch_date is null) then
    raise exception 'invalid estimated dispatch date';
  end if;
  select * into v_order from public.dti_orders where idempotency_key = p_idempotency_key for update;
  if found then
    if v_order.request_hash <> p_request_hash or v_order.owner_id is distinct from p_owner_id or v_order.guest_access_token_hash is distinct from p_guest_access_token_hash then
      raise exception 'idempotency conflict';
    end if;
    return jsonb_build_object('orderId', v_order.id, 'status', v_order.status, 'totalCents', v_order.total_cents,
      'estimatedDispatchDate', v_order.estimated_dispatch_date, 'confirmedLeadTime', v_order.confirmed_lead_time);
  end if;
  insert into public.dti_orders(
    idempotency_key, request_hash, owner_id, guest_access_token_hash, customer_email, customer_phone,
    meters, product_total_cents, product_vat_cents, shipping_method, shipping_total_cents,
    shipping_vat_cents, adaptation_requested, total_cents, status, preparation_working_days, estimated_dispatch_date
  ) values (
    p_idempotency_key, p_request_hash, p_owner_id, p_guest_access_token_hash, p_customer_email, p_customer_phone,
    p_meters, v_product_total, v_product_vat, p_shipping_method, v_shipping_total,
    v_shipping_vat, p_adaptation_requested, v_product_total + v_shipping_total, v_status, v_prep_days, p_estimated_dispatch_date
  ) returning * into v_order;
  insert into public.dti_order_events(order_id, event_type, actor_user_id, actor_kind, idempotency_key, details)
    values (v_order.id, 'order_created', p_owner_id, case when p_owner_id is null then 'system' else 'customer' end,
      'order:' || p_idempotency_key, jsonb_build_object('product_code', 'dti-innuro', 'meters', p_meters, 'useful_width_mm', 550));
  return jsonb_build_object('orderId', v_order.id, 'status', v_order.status, 'totalCents', v_order.total_cents,
    'estimatedDispatchDate', v_order.estimated_dispatch_date, 'confirmedLeadTime', v_order.confirmed_lead_time);
end;
$$;
revoke all on function dti_private.create_dti_order(text, text, uuid, text, text, text, numeric, text, boolean, date) from public, anon, authenticated;
grant execute on function dti_private.create_dti_order(text, text, uuid, text, text, text, numeric, text, boolean, date) to service_role;

create or replace function dti_private.create_adaptation_quote(
  p_order_id uuid,
  p_hours numeric,
  p_staff_user_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.dti_orders%rowtype;
  v_quote_id uuid;
  v_version integer;
begin
  if not exists (select 1 from public.dti_staff_permissions p where p.user_id = p_staff_user_id and p.permission = 'manage_quotes') then
    raise exception 'quote management permission required';
  end if;
  if p_hours <= 0 or p_hours > 500 or p_hours * 100 <> round(p_hours * 100) then
    raise exception 'hours must be positive with at most two decimals';
  end if;
  select * into v_order from public.dti_orders where id = p_order_id for update;
  if not found or not v_order.adaptation_requested then
    raise exception 'adaptation was not requested for this order';
  end if;
  if v_order.status in ('awaiting_payment', 'paid_awaiting_technical_review', 'queued_for_production', 'cancelled') or v_order.payment_status in ('pending', 'paid') then
    raise exception 'order cannot be repriced in its current state';
  end if;
  update public.dti_adaptation_quotes set status = 'superseded', approved_at = null
    where order_id = p_order_id and status in ('awaiting_customer_approval', 'approved');
  select coalesce(max(q.quote_version), 0) + 1 into v_version from public.dti_adaptation_quotes q where q.order_id = p_order_id;
  insert into public.dti_adaptation_quotes(order_id, quote_version, hours, created_by)
    values (p_order_id, v_version, p_hours, p_staff_user_id) returning id into v_quote_id;
  update public.dti_orders set adaptation_quote_id = null,
    total_cents = product_total_cents + shipping_total_cents,
    updated_at = now() where id = p_order_id;
  insert into public.dti_order_events(order_id, event_type, actor_user_id, actor_kind, idempotency_key, details)
    values (p_order_id, 'adaptation_quote_created', p_staff_user_id, 'designer', 'quote-created:' || v_quote_id::text,
      jsonb_build_object('quote_id', v_quote_id, 'quote_version', v_version));
  return v_quote_id;
end;
$$;

create or replace function dti_private.decide_adaptation_quote(
  p_quote_id uuid,
  p_decision text,
  p_customer_user_id uuid,
  p_guest_token_hash text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_quote public.dti_adaptation_quotes%rowtype;
  v_order public.dti_orders%rowtype;
begin
  if p_decision not in ('approved', 'rejected') then raise exception 'invalid quote decision'; end if;
  select * into v_quote from public.dti_adaptation_quotes where id = p_quote_id for update;
  if not found then raise exception 'quote not found'; end if;
  select * into v_order from public.dti_orders where id = v_quote.order_id for update;
  if (v_order.owner_id is not null and v_order.owner_id <> p_customer_user_id)
    or (v_order.owner_id is null and (p_guest_token_hash is null or v_order.guest_access_token_hash <> p_guest_token_hash)) then
    raise exception 'customer authorization required';
  end if;
  if v_order.status in ('awaiting_payment', 'paid_awaiting_technical_review', 'queued_for_production', 'cancelled') or v_order.payment_status in ('pending', 'paid') then
    raise exception 'order cannot accept a quote decision in its current state';
  end if;
  if v_quote.status <> 'awaiting_customer_approval' then
    return v_quote.status = p_decision;
  end if;
  update public.dti_adaptation_quotes set status = p_decision,
    approved_at = case when p_decision = 'approved' then now() else null end where id = p_quote_id;
  update public.dti_orders set adaptation_quote_id = case when p_decision = 'approved' then p_quote_id else null end,
    total_cents = product_total_cents + shipping_total_cents + case when p_decision = 'approved' then v_quote.total_cents else 0 end,
    updated_at = now() where id = v_order.id;
  insert into public.dti_order_events(order_id, event_type, actor_user_id, actor_kind, idempotency_key, details)
    values (v_order.id, 'adaptation_quote_' || p_decision, p_customer_user_id, 'customer', 'quote-decision:' || p_quote_id::text,
      jsonb_build_object('quote_id', p_quote_id, 'decision', p_decision));
  return true;
end;
$$;

revoke all on function dti_private.create_adaptation_quote(uuid, numeric, uuid) from public, anon, authenticated;
grant execute on function dti_private.create_adaptation_quote(uuid, numeric, uuid) to service_role;
revoke all on function dti_private.decide_adaptation_quote(uuid, text, uuid, text) from public, anon, authenticated;
grant execute on function dti_private.decide_adaptation_quote(uuid, text, uuid, text) to service_role;

create or replace function dti_private.record_artwork_review(
  p_version_id uuid,
  p_reviewer_user_id uuid,
  p_decision text,
  p_summary text,
  p_checklist jsonb,
  p_idempotency_key text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_version public.dti_artwork_versions%rowtype;
  v_order_id uuid;
  v_order_status text;
  v_existing public.dti_artwork_reviews%rowtype;
begin
  if not exists (select 1 from public.dti_staff_permissions p where p.user_id = p_reviewer_user_id and p.permission = 'review_artwork') then
    raise exception 'artwork review permission required';
  end if;
  if p_decision not in ('approved', 'rejected', 'revision_requested') or length(trim(p_summary)) = 0 or jsonb_typeof(p_checklist) <> 'array' then
    raise exception 'invalid artwork review';
  end if;
  select * into v_version from public.dti_artwork_versions where id = p_version_id for update;
  if not found then raise exception 'artwork version not found'; end if;
  if v_version.id <> (select v.id from public.dti_artwork_versions v where v.artwork_file_id = v_version.artwork_file_id order by v.version_number desc limit 1) then
    raise exception 'only the latest artwork version can be reviewed';
  end if;
  select f.order_id into v_order_id from public.dti_artwork_files f where f.id = v_version.artwork_file_id;
  select o.status into v_order_status from public.dti_orders o where o.id = v_order_id for update;
  if v_order_status not in ('awaiting_artwork', 'awaiting_artwork_review', 'paid_awaiting_technical_review') then
    raise exception 'order state cannot accept technical review';
  end if;
  insert into public.dti_artwork_reviews(artwork_version_id, reviewer_user_id, decision, idempotency_key, summary, checklist)
    values (p_version_id, p_reviewer_user_id, p_decision, p_idempotency_key, trim(p_summary), p_checklist)
    on conflict (idempotency_key) do nothing;
  if not found then
    select * into v_existing from public.dti_artwork_reviews where idempotency_key = p_idempotency_key;
    if v_existing.artwork_version_id <> p_version_id or v_existing.reviewer_user_id <> p_reviewer_user_id or v_existing.decision <> p_decision then
      raise exception 'review idempotency conflict';
    end if;
    return true;
  end if;
  insert into public.dti_artwork_events(artwork_version_id, event_type, actor_user_id, actor_kind, idempotency_key, details)
    values (p_version_id, case p_decision when 'approved' then 'technical_review_approved' when 'rejected' then 'technical_review_rejected' else 'revision_requested' end,
      p_reviewer_user_id, 'designer', 'technical-review:' || p_idempotency_key, jsonb_build_object('decision', p_decision, 'summary', trim(p_summary)));
  insert into public.dti_order_events(order_id, event_type, actor_user_id, actor_kind, idempotency_key, details)
    values (v_order_id, 'artwork_' || p_decision, p_reviewer_user_id, 'designer', 'order-review:' || p_idempotency_key,
      jsonb_build_object('artwork_version_id', p_version_id, 'decision', p_decision));
  if p_decision = 'approved' and v_order_status = 'awaiting_artwork_review' then
    update public.dti_orders set status = 'awaiting_artwork', updated_at = now() where id = v_order_id;
  end if;
  return true;
end;
$$;

create or replace function dti_private.release_order_to_production(p_order_id uuid, p_staff_user_id uuid, p_idempotency_key text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.dti_orders%rowtype;
  v_version public.dti_artwork_versions%rowtype;
  v_decision text;
begin
  if not exists (select 1 from public.dti_staff_permissions p where p.user_id = p_staff_user_id and p.permission = 'manage_production') then
    raise exception 'production permission required';
  end if;
  select * into v_order from public.dti_orders where id = p_order_id for update;
  if not found then raise exception 'order not found'; end if;
  if v_order.status = 'queued_for_production' then return true; end if;
  if v_order.status <> 'paid_awaiting_technical_review' or v_order.payment_status <> 'paid' then
    raise exception 'payment and technical review are required before production';
  end if;
  select v.* into v_version
    from public.dti_artwork_files f join public.dti_artwork_versions v on v.artwork_file_id = f.id
    where f.order_id = p_order_id order by v.version_number desc limit 1 for update of v;
  if not found or v_version.client_accepted_at is null or v_version.validation_status not in ('passed', 'manual_review') then
    raise exception 'accepted and server-checked artwork is required';
  end if;
  select r.decision into v_decision from public.dti_artwork_reviews r where r.artwork_version_id = v_version.id order by r.created_at desc, r.id desc limit 1;
  if v_decision is distinct from 'approved' then raise exception 'technical approval is required before production'; end if;
  update public.dti_orders set status = 'queued_for_production', updated_at = now() where id = p_order_id;
  insert into public.dti_order_events(order_id, event_type, actor_user_id, actor_kind, idempotency_key, details)
    values (p_order_id, 'queued_for_production', p_staff_user_id, 'production', 'production-release:' || p_idempotency_key,
      jsonb_build_object('artwork_version_id', v_version.id));
  return true;
end;
$$;

revoke all on function dti_private.record_artwork_review(uuid, uuid, text, text, jsonb, text) from public, anon, authenticated;
grant execute on function dti_private.record_artwork_review(uuid, uuid, text, text, jsonb, text) to service_role;
revoke all on function dti_private.release_order_to_production(uuid, uuid, text) from public, anon, authenticated;
grant execute on function dti_private.release_order_to_production(uuid, uuid, text) to service_role;

create or replace function dti_private.confirm_dti_lead_time(p_order_id uuid, p_staff_user_id uuid, p_summary text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.dti_orders%rowtype;
  v_has_manual_artwork boolean;
begin
  if not exists (select 1 from public.dti_staff_permissions p where p.user_id = p_staff_user_id and p.permission = 'manage_quotes') then
    raise exception 'quote management permission required';
  end if;
  if length(trim(p_summary)) < 5 or length(p_summary) > 500 then raise exception 'lead time summary is required'; end if;
  select * into v_order from public.dti_orders where id = p_order_id for update;
  if not found or v_order.status <> 'awaiting_manual_timeline' then raise exception 'order is not awaiting a manual lead time'; end if;
  select exists (
    select 1 from public.dti_artwork_files f
    join public.dti_artwork_versions v on v.artwork_file_id = f.id
    where f.order_id = p_order_id
      and v.id = (select latest.id from public.dti_artwork_versions latest where latest.artwork_file_id = f.id order by latest.version_number desc limit 1)
      and (v.validation_status = 'manual_review' or v.format in ('AI', 'PSD', 'SVG', 'CDR'))
  ) into v_has_manual_artwork;
  update public.dti_orders set status = case when v_has_manual_artwork then 'awaiting_artwork_review' else 'awaiting_artwork' end,
    confirmed_lead_time = trim(p_summary), lead_time_confirmed_at = now(), updated_at = now()
    where id = p_order_id;
  insert into public.dti_order_events(order_id, event_type, actor_user_id, actor_kind, idempotency_key, details)
    values (p_order_id, 'lead_time_confirmed', p_staff_user_id, 'designer', 'lead-time-confirmed:' || p_order_id::text,
      jsonb_build_object('summary', trim(p_summary)));
  return true;
end;
$$;
revoke all on function dti_private.confirm_dti_lead_time(uuid, uuid, text) from public, anon, authenticated;
grant execute on function dti_private.confirm_dti_lead_time(uuid, uuid, text) to service_role;

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
  array['image/png', 'application/pdf', 'application/postscript', 'image/vnd.adobe.photoshop', 'image/svg+xml', 'application/vnd.corel-draw', 'application/octet-stream']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function dti_private.process_stripe_payment_event(
  p_event_id text,
  p_event_type text,
  p_payment_intent_id text,
  p_order_id uuid,
  p_amount_cents integer,
  p_currency_code text
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
    if not found then
      return false;
    end if;
    if v_existing_event.processed then
      return true;
    end if;
  end if;

  select * into v_attempt
  from public.dti_payment_attempts
  where stripe_payment_intent_id = p_payment_intent_id and order_id = p_order_id
  for update;

  if not found then
    update public.dti_stripe_events
      set processed = false, processed_at = now()
      where stripe_event_id = p_event_id;
    return false;
  end if;

  if p_currency_code is null or upper(p_currency_code) <> 'EUR' or v_attempt.amount_cents <> p_amount_cents or v_attempt.currency_code <> upper(p_currency_code) then
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
      and o.status = 'awaiting_payment' and o.payment_status in ('unpaid', 'pending', 'failed')
      and o.total_cents = v_attempt.amount_cents
      and v_attempt.id = (select a.id from public.dti_payment_attempts a where a.order_id = o.id order by a.created_at desc, a.id desc limit 1)
      and latest.id = v_attempt.artwork_version_id
      and latest.client_accepted_at is not null
      and latest.validation_status in ('passed', 'manual_review')
      and ((latest.format not in ('AI', 'PSD', 'SVG', 'CDR') and latest.validation_status <> 'manual_review') or (
        select r.decision from public.dti_artwork_reviews r
        where r.artwork_version_id = latest.id order by r.created_at desc, r.id desc limit 1
      ) = 'approved')
      and (not o.adaptation_requested or exists (
        select 1 from public.dti_adaptation_quotes q where q.id = o.adaptation_quote_id
          and q.order_id = o.id and q.status = 'approved'
          and q.total_cents = v_attempt.amount_cents - o.product_total_cents - o.shipping_total_cents
      ))
  ) then
    raise exception 'Order is not eligible for payment completion';
  end if;

  v_target_status := case p_event_type
    when 'payment_intent.succeeded' then 'succeeded'
    when 'payment_intent.payment_failed' then 'requires_payment_method'
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

  if v_attempt.status = 'cancelled' or (v_attempt.status = 'succeeded' and v_target_status <> 'succeeded') then
    update public.dti_stripe_events set processed = true, processed_at = now()
      where stripe_event_id = p_event_id;
    return true;
  end if;

  update public.dti_payment_attempts
    set status = v_target_status, updated_at = now()
    where id = v_attempt.id;

  update public.dti_orders
    set payment_status = case when v_target_status = 'succeeded' then 'paid'
      when p_event_type in ('payment_intent.payment_failed', 'payment_intent.canceled') then 'failed'
      when v_target_status = 'processing' or v_target_status = 'requires_action' then 'pending'
      else payment_status end,
      status = case when v_target_status = 'succeeded' then 'paid_awaiting_technical_review' else status end,
      updated_at = now()
    where id = v_attempt.order_id
      and v_attempt.id = (select a.id from public.dti_payment_attempts a where a.order_id = v_attempt.order_id order by a.created_at desc, a.id desc limit 1);

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

revoke all on function dti_private.process_stripe_payment_event(text, text, text, uuid, integer, text) from public, anon, authenticated;
grant execute on function dti_private.process_stripe_payment_event(text, text, text, uuid, integer, text) to service_role;
