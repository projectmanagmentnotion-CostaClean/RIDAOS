-- Transactional DTI notification intents. This migration queues events only;
-- it never sends email or treats a queued item as delivered.
create table public.dti_notification_outbox (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.dti_orders(id) on delete cascade,
  source_event_id uuid not null unique references public.dti_order_events(id) on delete cascade,
  notification_key text not null check (notification_key in (
    'order_received',
    'payment_confirmed',
    'payment_failed',
    'payment_cancelled',
    'adaptation_quote_ready',
    'adaptation_quote_approved',
    'adaptation_quote_rejected',
    'artwork_revision_requested',
    'artwork_rejected',
    'artwork_technically_approved',
    'lead_time_confirmed',
    'production_started',
    'quality_control_started',
    'production_adjustment_required',
    'ready_for_dispatch',
    'order_dispatched',
    'ready_for_pickup',
    'order_picked_up'
  )),
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'processing', 'sent', 'retry')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  available_at timestamptz not null default now(),
  claimed_at timestamptz,
  sent_at timestamptz,
  last_error_code text check (last_error_code is null or length(last_error_code) <= 120),
  created_at timestamptz not null default now(),
  check ((delivery_status = 'sent') = (sent_at is not null))
);

create index dti_notification_outbox_pending_idx
  on public.dti_notification_outbox(available_at, created_at)
  where delivery_status in ('pending', 'retry');

alter table public.dti_notification_outbox enable row level security;
create policy dti_notification_outbox_service_only
  on public.dti_notification_outbox
  for all to service_role
  using (true) with check (true);
revoke all on public.dti_notification_outbox from public, anon, authenticated;
grant select, insert, update, delete on public.dti_notification_outbox to service_role;

create or replace function dti_private.enqueue_dti_customer_notification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_notification_key text;
begin
  v_notification_key := case new.event_type
    when 'order_created' then 'order_received'
    when 'payment_intent.succeeded' then 'payment_confirmed'
    when 'payment_intent.payment_failed' then 'payment_failed'
    when 'payment_intent.canceled' then 'payment_cancelled'
    when 'adaptation_quote_created' then 'adaptation_quote_ready'
    when 'adaptation_quote_approved' then 'adaptation_quote_approved'
    when 'adaptation_quote_rejected' then 'adaptation_quote_rejected'
    when 'artwork_revision_requested' then 'artwork_revision_requested'
    when 'artwork_rejected' then 'artwork_rejected'
    when 'artwork_approved' then 'artwork_technically_approved'
    when 'lead_time_confirmed' then 'lead_time_confirmed'
    when 'production_in_production' then 'production_started'
    when 'production_quality_control' then 'quality_control_started'
    when 'production_rework_required' then 'production_adjustment_required'
    when 'production_ready_for_dispatch' then 'ready_for_dispatch'
    when 'production_dispatched' then 'order_dispatched'
    when 'production_ready_for_pickup' then 'ready_for_pickup'
    when 'production_picked_up' then 'order_picked_up'
    else null
  end;

  if v_notification_key is not null then
    insert into public.dti_notification_outbox(order_id, source_event_id, notification_key)
    values (new.order_id, new.id, v_notification_key)
    on conflict (source_event_id) do nothing;
  end if;

  return new;
end;
$$;
revoke all on function dti_private.enqueue_dti_customer_notification() from public, anon, authenticated;

create trigger dti_order_event_enqueue_notification
  after insert on public.dti_order_events
  for each row execute function dti_private.enqueue_dti_customer_notification();

comment on table public.dti_notification_outbox is
  'Transactional notification intents. Pending means queued, never delivered; a separately authorized transport is required to send.';
comment on column public.dti_notification_outbox.source_event_id is
  'Unique source event provides idempotent enqueueing; customer PII is read from the order only by the delivery worker.';
