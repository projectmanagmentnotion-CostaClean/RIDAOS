-- Run after migrations against disposable local Supabase/Postgres or in a QA transaction.
-- This verifies event mapping/idempotency and rolls back all rows; no email is sent.
begin;

do $$
declare
  v_test_id text := gen_random_uuid()::text;
  v_order_id uuid;
  v_order_event_id uuid;
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
  if (select count(*) from public.dti_notification_outbox where order_id = v_order_id) <> 5 then
    raise exception 'only the five allowlisted customer notification intents should be queued';
  end if;
end;
$$;

rollback;
