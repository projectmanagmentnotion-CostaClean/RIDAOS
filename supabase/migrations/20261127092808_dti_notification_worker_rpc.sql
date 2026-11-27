-- REST entry points for the Edge Function worker. The underlying queue and
-- lifecycle functions remain in dti_private; only service_role can call these.
-- This migration adds only service_role-only worker RPC wrappers.
create or replace function public.dti_claim_customer_notifications(p_batch_size integer default 10)
returns table (
  id uuid,
  order_id uuid,
  source_event_id uuid,
  notification_key text,
  attempt_count integer
)
language sql
security invoker
set search_path = ''
as $$
  select claimed.id, claimed.order_id, claimed.source_event_id,
    claimed.notification_key, claimed.attempt_count
  from dti_private.claim_dti_customer_notifications(p_batch_size, pg_catalog.now()) as claimed;
$$;

create or replace function public.dti_complete_customer_notification(p_outbox_id uuid)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select dti_private.complete_dti_customer_notification(p_outbox_id, pg_catalog.now());
$$;

create or replace function public.dti_fail_customer_notification(p_outbox_id uuid, p_safe_error_code text)
returns boolean
language sql
security invoker
set search_path = ''
as $$
  select dti_private.fail_dti_customer_notification(p_outbox_id, p_safe_error_code, pg_catalog.now());
$$;

revoke all on function public.dti_claim_customer_notifications(integer) from public, anon, authenticated;
revoke all on function public.dti_complete_customer_notification(uuid) from public, anon, authenticated;
revoke all on function public.dti_fail_customer_notification(uuid, text) from public, anon, authenticated;
grant execute on function public.dti_claim_customer_notifications(integer) to service_role;
grant execute on function public.dti_complete_customer_notification(uuid) to service_role;
grant execute on function public.dti_fail_customer_notification(uuid, text) to service_role;
