alter table public.dti_orders
  drop constraint if exists dti_orders_status_check;

alter table public.dti_orders
  add constraint dti_orders_status_check check (status in (
    'awaiting_artwork', 'awaiting_artwork_review', 'awaiting_manual_timeline',
    'awaiting_payment', 'paid_awaiting_technical_review', 'queued_for_production',
    'in_production', 'quality_control', 'rework_required', 'preparing_dispatch',
    'ready_for_dispatch', 'dispatched', 'ready_for_pickup', 'picked_up', 'cancelled'
  )),
  add column production_started_at timestamptz,
  add column quality_control_completed_at timestamptz,
  add column dispatch_ready_at timestamptz,
  add column dispatched_at timestamptz,
  add column picked_up_at timestamptz,
  add column tracking_reference text check (
    tracking_reference is null or length(trim(tracking_reference)) between 4 and 120
  );

create or replace function dti_private.update_dti_production_status(
  p_order_id uuid,
  p_staff_user_id uuid,
  p_next_status text,
  p_summary text,
  p_tracking_reference text,
  p_idempotency_key text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.dti_orders%rowtype;
  v_existing_event public.dti_order_events%rowtype;
  v_event_key text;
  v_transition_allowed boolean := false;
begin
  if not exists (
    select 1 from public.dti_staff_permissions p
    where p.user_id = p_staff_user_id and p.permission = 'manage_production'
  ) then
    raise exception 'production permission required';
  end if;
  if p_next_status not in (
    'in_production', 'quality_control', 'rework_required', 'preparing_dispatch',
    'ready_for_dispatch', 'dispatched', 'ready_for_pickup', 'picked_up'
  ) then
    raise exception 'invalid production status';
  end if;
  if p_summary is null or length(trim(p_summary)) < 5 or length(p_summary) > 500 then
    raise exception 'production summary is required';
  end if;
  if p_idempotency_key is null or p_idempotency_key !~ '^[A-Za-z0-9_-]{16,100}$' then
    raise exception 'production idempotency key is required';
  end if;

  v_event_key := 'dti-production:' || p_idempotency_key;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_event_key, 0));
  select * into v_existing_event from public.dti_order_events
  where idempotency_key = v_event_key;
  if found then
    if v_existing_event.order_id = p_order_id
      and v_existing_event.actor_user_id = p_staff_user_id
      and v_existing_event.event_type = 'production_' || p_next_status
      and v_existing_event.details->>'summary' = trim(p_summary)
      and v_existing_event.details->>'tracking_reference' is not distinct from p_tracking_reference
    then
      return true;
    end if;
    raise exception 'production idempotency conflict';
  end if;

  select * into v_order from public.dti_orders where id = p_order_id for update;
  if not found then raise exception 'order not found'; end if;
  if v_order.payment_status <> 'paid' then raise exception 'paid order is required'; end if;
  if v_order.status not in (
    'queued_for_production', 'in_production', 'quality_control', 'rework_required',
    'preparing_dispatch', 'ready_for_dispatch', 'ready_for_pickup'
  ) then
    raise exception 'order is not in a production state';
  end if;
  if not exists (
    select 1
    from public.dti_artwork_files f
    join lateral (
      select v.id from public.dti_artwork_versions v
      where v.artwork_file_id = f.id order by v.version_number desc limit 1
    ) latest on true
    join lateral (
      select r.decision from public.dti_artwork_reviews r
      where r.artwork_version_id = latest.id order by r.created_at desc, r.id desc limit 1
    ) latest_review on true
    where f.order_id = p_order_id and latest_review.decision = 'approved'
  ) then
    raise exception 'technical approval is required before production';
  end if;

  v_transition_allowed :=
    (v_order.status = 'queued_for_production' and p_next_status = 'in_production')
    or (v_order.status = 'in_production' and p_next_status = 'quality_control')
    or (v_order.status = 'quality_control' and p_next_status in ('rework_required', 'preparing_dispatch'))
    or (v_order.status = 'rework_required' and p_next_status = 'in_production')
    or (v_order.status = 'preparing_dispatch' and p_next_status = case v_order.shipping_method
      when 'standard' then 'ready_for_dispatch' else 'ready_for_pickup' end)
    or (v_order.status = 'ready_for_dispatch' and p_next_status = 'dispatched' and v_order.shipping_method = 'standard')
    or (v_order.status = 'ready_for_pickup' and p_next_status = 'picked_up' and v_order.shipping_method = 'pickup');
  if not v_transition_allowed then raise exception 'invalid production status transition'; end if;

  if p_next_status = 'dispatched' then
    if v_order.shipping_method <> 'standard'
      or p_tracking_reference is null
      or length(trim(p_tracking_reference)) not between 4 and 120
      or p_tracking_reference ~ '[[:cntrl:]]'
    then
      raise exception 'dispatch tracking reference is required';
    end if;
  elsif p_tracking_reference is not null then
    raise exception 'tracking reference is only accepted when dispatching';
  end if;

  update public.dti_orders set
    status = p_next_status,
    production_started_at = case
      when p_next_status = 'in_production' then coalesce(production_started_at, now())
      else production_started_at end,
    quality_control_completed_at = case
      when p_next_status = 'quality_control' then now()
      when p_next_status = 'rework_required' then null
      else quality_control_completed_at end,
    dispatch_ready_at = case
      when p_next_status in ('ready_for_dispatch', 'ready_for_pickup') then now()
      when p_next_status = 'in_production' then null
      else dispatch_ready_at end,
    dispatched_at = case when p_next_status = 'dispatched' then now() else dispatched_at end,
    picked_up_at = case when p_next_status = 'picked_up' then now() else picked_up_at end,
    tracking_reference = case when p_next_status = 'dispatched' then trim(p_tracking_reference) else tracking_reference end,
    updated_at = now()
  where id = p_order_id;

  insert into public.dti_order_events(order_id, event_type, actor_user_id, actor_kind, idempotency_key, details)
  values (
    p_order_id, 'production_' || p_next_status, p_staff_user_id, 'production', v_event_key,
    jsonb_build_object(
      'from_status', v_order.status,
      'to_status', p_next_status,
      'summary', trim(p_summary),
      'tracking_reference', case when p_next_status = 'dispatched' then trim(p_tracking_reference) else null end
    )
  );
  return true;
end;
$$;

revoke all on function dti_private.update_dti_production_status(uuid, uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function dti_private.update_dti_production_status(uuid, uuid, text, text, text, text) to service_role;

create or replace function public.dti_update_production_status(
  p_order_id uuid,
  p_staff_user_id uuid,
  p_next_status text,
  p_summary text,
  p_tracking_reference text,
  p_idempotency_key text
)
returns boolean
language sql
security definer
set search_path = ''
as $$
  select dti_private.update_dti_production_status(
    p_order_id, p_staff_user_id, p_next_status, p_summary, p_tracking_reference, p_idempotency_key
  )
$$;
revoke all on function public.dti_update_production_status(uuid, uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function public.dti_update_production_status(uuid, uuid, text, text, text, text) to service_role;
