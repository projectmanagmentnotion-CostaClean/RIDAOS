-- Run after migrations against disposable local Supabase/Postgres or in a QA transaction.
-- This verifies event mapping/idempotency and rolls back all rows; no email is sent.
begin;

do $$
declare
  v_test_id text := gen_random_uuid()::text;
  v_order_id uuid;
  v_order_event_id uuid;
  v_outbox_id uuid;
  v_retry_id uuid;
  v_claimed_count integer;
  v_now timestamptz := clock_timestamp();
  v_customer_email text;
begin
  v_customer_email := 'dti-notification-test-' || v_test_id || '@example.test';

  insert into public.dti_orders (
    idempotency_key, request_hash, guest_access_token_hash, customer_name, customer_email, customer_phone,
    meters, product_total_cents, product_vat_cents, shipping_method, shipping_total_cents,
    shipping_vat_cents, total_cents
  ) values (
    'notification-test-' || v_test_id, 'notification-outbox-test', 'test-' || v_test_id,
    'Cliente de prueba', v_customer_email, '+34900000000',
    1.0, 1500, 260, 'pickup', 0, 0, 1500
  ) returning id into v_order_id;

  insert into public.dti_order_events(order_id, event_type, actor_kind, idempotency_key)
  values (v_order_id, 'order_created', 'system', 'notification-order-created-' || v_test_id)
  returning id into v_order_event_id;

  if not exists (
    select 1 from public.dti_notification_outbox
    where source_event_id = v_order_event_id and notification_key = 'order_received'
      and delivery_status = 'pending' and sent_at is null
  ) then
    raise exception 'order_created must enqueue an explicitly pending order_received intent';
  end if;

  insert into public.dti_order_events(order_id, event_type, actor_kind, idempotency_key)
  values (v_order_id, 'payment_intent.succeeded', 'stripe', 'notification-payment-succeeded-' || v_test_id)
  on conflict (idempotency_key) do nothing;
  insert into public.dti_order_events(order_id, event_type, actor_kind, idempotency_key)
  values (v_order_id, 'payment_intent.succeeded', 'stripe', 'notification-payment-succeeded-' || v_test_id)
  on conflict (idempotency_key) do nothing;

  select id into v_order_event_id from public.dti_order_events
  where idempotency_key = 'notification-payment-succeeded-' || v_test_id;

  if not exists (
    select 1 from public.dti_notification_outbox
    where source_event_id = v_order_event_id and notification_key = 'payment_confirmed'
  ) then
    raise exception 'successful payment event must enqueue payment_confirmed';
  end if;

  insert into public.dti_order_events(order_id, event_type, actor_kind, idempotency_key)
  values (v_order_id, 'production_quality_control', 'production', 'notification-quality-control-' || v_test_id);

  insert into public.dti_order_events(order_id, event_type, actor_kind, idempotency_key)
  values (v_order_id, 'payment_intent.payment_failed', 'stripe', 'notification-payment-failed-' || v_test_id);
  insert into public.dti_order_events(order_id, event_type, actor_kind, idempotency_key)
  values (v_order_id, 'payment_intent.canceled', 'stripe', 'notification-payment-canceled-' || v_test_id);
  insert into public.dti_order_events(order_id, event_type, actor_kind, idempotency_key)
  values (v_order_id, 'production_picked_up', 'production', 'notification-order-picked-up-' || v_test_id);
  insert into public.dti_order_events(order_id, event_type, actor_kind, idempotency_key)
  values (v_order_id, 'internal_unmapped_test_event', 'system', 'notification-unmapped-' || v_test_id);

  if not exists (
    select 1 from public.dti_notification_outbox
    where order_id = v_order_id and notification_key = 'quality_control_started'
  ) then
    raise exception 'quality-control event must enqueue quality_control_started';
  end if;
  if not exists (
    select 1 from public.dti_notification_outbox
    where order_id = v_order_id and notification_key = 'payment_failed'
  ) then
    raise exception 'payment failure must enqueue payment_failed';
  end if;
  if not exists (
    select 1 from public.dti_notification_outbox
    where order_id = v_order_id and notification_key = 'payment_cancelled'
  ) then
    raise exception 'payment cancellation must enqueue payment_cancelled';
  end if;
  if exists (
    select 1 from public.dti_notification_outbox
    where order_id = v_order_id and notification_key = 'internal_unmapped_test_event'
  ) then
    raise exception 'unmapped internal event must not enqueue a customer notification';
  end if;
  if (select count(*) from public.dti_notification_outbox where order_id = v_order_id) <> 6 then
    raise exception 'only the six allowlisted customer notification intents should be queued';
  end if;

  select count(*) into v_claimed_count
  from dti_private.claim_dti_customer_notifications(50, v_now);
  if v_claimed_count <> 6 then
    raise exception 'atomic claim must return all currently due intents exactly once';
  end if;

  select id into v_outbox_id from public.dti_notification_outbox
  where order_id = v_order_id and notification_key = 'order_received';
  if not dti_private.complete_dti_customer_notification(v_outbox_id, v_now) then
    raise exception 'a claimed notification must transition to sent';
  end if;
  if dti_private.complete_dti_customer_notification(v_outbox_id, v_now) then
    raise exception 'completing a sent notification again must be a no-op';
  end if;

  select id into v_retry_id from public.dti_notification_outbox
  where order_id = v_order_id and notification_key = 'payment_failed';
  if not dti_private.fail_dti_customer_notification(v_retry_id, 'provider_timeout', v_now) then
    raise exception 'a claimed notification must transition to a controlled retry';
  end if;
  if not exists (
    select 1 from public.dti_notification_outbox
    where id = v_retry_id and delivery_status = 'retry' and attempt_count = 1
      and available_at = v_now + interval '1 minute'
      and last_error_code = 'provider_timeout'
  ) then
    raise exception 'first retry must use bounded backoff and a safe error code';
  end if;
  if dti_private.fail_dti_customer_notification(v_retry_id, 'late_duplicate', v_now) then
    raise exception 'a second failure report for an unclaimed notification must be a no-op';
  end if;

  perform dti_private.claim_dti_customer_notifications(50, v_now + interval '1 minute');
  if not exists (
    select 1 from public.dti_notification_outbox
    where id = v_retry_id and delivery_status = 'processing' and attempt_count = 2
  ) then
    raise exception 'due retries must be claimable with incremented attempt count';
  end if;

  begin
    perform dti_private.fail_dti_customer_notification(v_retry_id, 'private@example.test', v_now);
    raise exception 'raw error details must not be accepted as a persisted error code';
  exception when others then
    if sqlerrm <> 'invalid safe notification error code' then
      raise;
    end if;
  end;

  select id into v_outbox_id from public.dti_notification_outbox
  where order_id = v_order_id and notification_key = 'quality_control_started';
  update public.dti_notification_outbox
  set claimed_at = v_now - interval '11 minutes'
  where id = v_outbox_id and delivery_status = 'processing';
  perform dti_private.claim_dti_customer_notifications(50, v_now);
  if not exists (
    select 1 from public.dti_notification_outbox
    where id = v_outbox_id and delivery_status = 'processing' and attempt_count = 2
  ) then
    raise exception 'expired leases below the limit must be safely reclaimed';
  end if;

  select id into v_outbox_id from public.dti_notification_outbox
  where order_id = v_order_id and notification_key = 'order_picked_up';
  update public.dti_notification_outbox
  set delivery_status = 'processing', attempt_count = 6,
      claimed_at = v_now - interval '11 minutes'
  where id = v_outbox_id;
  perform dti_private.claim_dti_customer_notifications(50, v_now);
  if not exists (
    select 1 from public.dti_notification_outbox
    where id = v_outbox_id and delivery_status = 'failed' and last_error_code = 'attempt_limit'
  ) then
    raise exception 'expired notifications at the attempt limit must stop retrying';
  end if;
end;
$$;

rollback;
