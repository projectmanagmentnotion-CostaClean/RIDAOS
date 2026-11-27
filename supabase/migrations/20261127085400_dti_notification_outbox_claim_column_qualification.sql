-- Qualify columns that collide with PL/pgSQL output parameters in the
-- notification claim function. This replaces only the function body; it does
-- not create tables, change data, or enable email delivery.
create or replace function dti_private.claim_dti_customer_notifications(
  p_batch_size integer default 10,
  p_now timestamptz default now()
)
returns table (
  id uuid,
  order_id uuid,
  source_event_id uuid,
  notification_key text,
  attempt_count integer
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.dti_notification_outbox as outbox
  set delivery_status = 'retry', available_at = p_now, claimed_at = null,
      last_error_code = 'claim_expired'
  where outbox.delivery_status = 'processing'
    and outbox.claimed_at < p_now - interval '10 minutes'
    and outbox.attempt_count < 6;

  update public.dti_notification_outbox as outbox
  set delivery_status = 'failed', claimed_at = null,
      last_error_code = 'attempt_limit'
  where outbox.delivery_status = 'processing'
    and outbox.claimed_at < p_now - interval '10 minutes'
    and outbox.attempt_count >= 6;

  return query
  with candidates as (
    select outbox.id
    from public.dti_notification_outbox as outbox
    where outbox.delivery_status in ('pending', 'retry')
      and outbox.available_at <= p_now
      and outbox.attempt_count < 6
    order by outbox.available_at, outbox.created_at
    for update skip locked
    limit (greatest(1, least(coalesce(p_batch_size, 10), 50)))
  ), claimed as (
    update public.dti_notification_outbox as outbox
    set delivery_status = 'processing', claimed_at = p_now,
        attempt_count = outbox.attempt_count + 1
    from candidates
    where outbox.id = candidates.id
    returning outbox.id, outbox.order_id, outbox.source_event_id,
      outbox.notification_key, outbox.attempt_count
  )
  select claimed.id, claimed.order_id, claimed.source_event_id,
    claimed.notification_key, claimed.attempt_count
  from claimed;
end;
$$;

revoke all on function dti_private.claim_dti_customer_notifications(integer, timestamptz)
  from public, anon, authenticated;
grant execute on function dti_private.claim_dti_customer_notifications(integer, timestamptz)
  to service_role;
