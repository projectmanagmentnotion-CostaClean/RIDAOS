-- Run after migrations against a disposable local Supabase/Postgres database:
-- psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/dti-commerce.integration.sql
begin;

do $$
declare
  v_customer uuid := '10000000-0000-4000-8000-000000000001';
  v_staff uuid := '10000000-0000-4000-8000-000000000002';
  v_order jsonb;
  v_order_id uuid;
  v_repeat jsonb;
  v_quote_id uuid;
  v_file_id uuid;
  v_version_id uuid;
  v_attempt_id uuid;
  v_isolation_order_id uuid;
  v_isolation_file_id uuid;
  v_isolation_version_id uuid;
  v_acceptance jsonb;
  v_acceptance_retry jsonb;
  v_blocked boolean := false;
  v_retry_order_id uuid;
  v_retry_file_id uuid;
  v_retry_version_id uuid;
begin
  if not (select c.relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'dti_orders') then
    raise exception 'RLS is not enabled on DTI orders';
  end if;
  if has_table_privilege('anon', 'public.dti_orders', 'select') or has_table_privilege('authenticated', 'public.dti_orders', 'select') then
    raise exception 'customer roles can access DTI orders directly';
  end if;
  if has_schema_privilege('anon', 'dti_private', 'usage') or has_schema_privilege('authenticated', 'dti_private', 'usage') then
    raise exception 'customer roles can access the private DTI implementation schema';
  end if;
  if (select count(*) from pg_policies
      where schemaname = 'public' and tablename like 'dti_%'
        and policyname = 'dti_deny_client_access' and permissive = 'RESTRICTIVE'
        and roles @> array['anon'::name, 'authenticated'::name] and cardinality(roles) = 2
        and coalesce(qual, '') = 'false' and coalesce(with_check, '') = 'false') <> 10 then
    raise exception 'explicit restrictive deny policies must cover all DTI tables for anon and authenticated';
  end if;
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname ~ '^dti_'
      and has_function_privilege('anon', p.oid, 'execute')
  ) then
    raise exception 'an unauthenticated API role can execute a DTI RPC wrapper';
  end if;
  if (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname ~ '^dti_'
        and has_function_privilege('service_role', p.oid, 'execute')) <> 8 then
    raise exception 'service_role cannot execute every DTI RPC wrapper';
  end if;
  if (select b.public from storage.buckets b where b.id = 'dti-artwork') is distinct from false then
    raise exception 'artwork bucket must remain private';
  end if;
  insert into auth.users (id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  values
    (v_customer, 'authenticated', 'authenticated', 'dti-customer@example.test', '{}'::jsonb, '{}'::jsonb, now(), now()),
    (v_staff, 'authenticated', 'authenticated', 'dti-staff@example.test', '{}'::jsonb, '{}'::jsonb, now(), now());
  insert into public.dti_staff_permissions(user_id, permission) values
    (v_staff, 'manage_quotes'), (v_staff, 'review_artwork'), (v_staff, 'manage_production');

  v_order := dti_private.create_dti_order(
    'integration-order-000001', 'hash-basic-order', v_customer, null,
    'Taller DTI', 'dti-customer@example.test', '+34900000000',
    '{"line1":"Carrer d’Aragó 423","line2":null,"postalCode":"08013","city":"Barcelona","province":"Barcelona","countryCode":"ES"}'::jsonb,
    1.0, 'standard', false, date '2026-11-26'
  );
  v_order_id := (v_order->>'orderId')::uuid;
  if (v_order->>'totalCents')::integer <> 2000 or v_order->>'status' <> 'awaiting_artwork' then
    raise exception 'basic order totals or state are incorrect: %', v_order;
  end if;
  if not exists (select 1 from public.dti_orders where id = v_order_id and useful_width_mm = 550 and product_vat_cents = 260 and shipping_vat_cents = 87
      and customer_name = 'Taller DTI' and shipping_address->>'postalCode' = '08013') then
    raise exception 'server order dimensions, VAT, or shipping address are incorrect';
  end if;
  v_repeat := dti_private.create_dti_order(
    'integration-order-000001', 'hash-basic-order', v_customer, null,
    'Taller DTI', 'dti-customer@example.test', '+34900000000',
    '{"line1":"Carrer d’Aragó 423","line2":null,"postalCode":"08013","city":"Barcelona","province":"Barcelona","countryCode":"ES"}'::jsonb,
    1.0, 'standard', false, date '2026-11-27'
  );
  if v_repeat->>'orderId' <> v_order_id::text or (select count(*) from public.dti_order_events where order_id = v_order_id and event_type = 'order_created') <> 1 then
    raise exception 'order retry created a duplicate';
  end if;

  v_order := dti_private.create_dti_order(
    'integration-order-000002', 'hash-adaptation-order', v_customer, null,
    'Taller DTI', 'dti-customer@example.test', '+34900000000', null, 1.0, 'pickup', true, date '2026-11-26'
  );
  v_order_id := (v_order->>'orderId')::uuid;
  v_quote_id := dti_private.create_adaptation_quote(v_order_id, 1.23, v_staff);
  if not exists (select 1 from public.dti_adaptation_quotes where id = v_quote_id and net_cents = 4305 and vat_cents = 904 and total_cents = 5209) then
    raise exception 'adaptation quote does not use 35 EUR/hour plus VAT';
  end if;
  if not dti_private.decide_adaptation_quote(v_quote_id, 'approved', v_customer, null) then
    raise exception 'customer quote approval was not recorded';
  end if;
  if not exists (select 1 from public.dti_orders where id = v_order_id and adaptation_quote_id = v_quote_id and total_cents = 6709) then
    raise exception 'approved quote was not included in the authoritative order total';
  end if;

  insert into public.dti_artwork_files(order_id) values (v_order_id) returning id into v_file_id;
  insert into public.dti_artwork_versions(
    artwork_file_id, upload_idempotency_key, version_number, storage_path, original_file_name, format, mime_type,
    file_size_bytes, validation_status, uploaded_at
  ) values (
    v_file_id, 'integration-upload-000001', 1, v_order_id::text || '/v1/art.png', 'art.png', 'PNG', 'image/png',
    100, 'passed', now()
  ) returning id into v_version_id;
  v_acceptance := dti_private.accept_dti_artwork(v_order_id, v_version_id, v_customer);
  v_acceptance_retry := dti_private.accept_dti_artwork(v_order_id, v_version_id, v_customer);
  if v_acceptance->>'acceptedAt' <> v_acceptance_retry->>'acceptedAt'
    or (select count(*) from public.dti_artwork_events where artwork_version_id = v_version_id and event_type = 'client_accepted') <> 1 then
    raise exception 'client acceptance retry changed its audit record';
  end if;
  update public.dti_orders set status = 'awaiting_payment', payment_status = 'unpaid', total_cents = 6709 where id = v_order_id;
  insert into public.dti_payment_attempts(order_id, idempotency_key, stripe_payment_intent_id, artwork_version_id, adaptation_quote_id, amount_cents, status)
  values (v_order_id, 'integration-attempt-000001', 'pi_test_integration_000001', v_version_id, v_quote_id, 6709, 'requires_payment_method')
  returning id into v_attempt_id;

  if not dti_private.process_stripe_payment_event('evt_dti_integration_000001', 'payment_intent.succeeded', 'pi_test_integration_000001', v_order_id, 6709, 'eur') then
    raise exception 'first verified Stripe event was not processed';
  end if;
  if not dti_private.process_stripe_payment_event('evt_dti_integration_000001', 'payment_intent.succeeded', 'pi_test_integration_000001', v_order_id, 6709, 'eur') then
    raise exception 'duplicate Stripe event was not acknowledged idempotently';
  end if;
  if not exists (select 1 from public.dti_orders where id = v_order_id and payment_status = 'paid' and status = 'paid_awaiting_technical_review') then
    raise exception 'paid order bypassed technical-review state';
  end if;

  v_order := dti_private.create_dti_order(
    'integration-order-000005', 'hash-isolation-order', v_customer, null,
    'Taller DTI', 'dti-customer@example.test', '+34900000000', null, 1.0, 'pickup', false, date '2026-11-26'
  );
  v_isolation_order_id := (v_order->>'orderId')::uuid;
  insert into public.dti_artwork_files(order_id) values (v_isolation_order_id) returning id into v_isolation_file_id;
  insert into public.dti_artwork_versions(
    artwork_file_id, upload_idempotency_key, version_number, storage_path, original_file_name, format, mime_type,
    file_size_bytes, validation_status, client_accepted_at, uploaded_at
  ) values (
    v_isolation_file_id, 'integration-upload-cross-order-000001', 1,
    v_isolation_order_id::text || '/v1/art.png', 'art.png', 'PNG', 'image/png',
    100, 'passed', now(), now()
  ) returning id into v_isolation_version_id;
  update public.dti_orders set status = 'awaiting_payment', payment_status = 'unpaid', total_cents = 1500 where id = v_isolation_order_id;
  insert into public.dti_payment_attempts(order_id, idempotency_key, stripe_payment_intent_id, artwork_version_id, amount_cents, status)
  values (v_isolation_order_id, 'integration-attempt-cross-order-000001', 'pi_test_cross_order_000001', v_isolation_version_id, 1500, 'requires_payment_method');
  if dti_private.process_stripe_payment_event(
    'evt_dti_cross_order_000001', 'payment_intent.succeeded', 'pi_test_integration_000001', v_isolation_order_id, 1500, 'eur'
  ) then
    raise exception 'a PaymentIntent belonging to another order was accepted';
  end if;
  if not exists (select 1 from public.dti_orders where id = v_isolation_order_id and payment_status = 'unpaid' and status = 'awaiting_payment')
    or not exists (select 1 from public.dti_orders where id = v_order_id and payment_status = 'paid' and status = 'paid_awaiting_technical_review')
    or not exists (select 1 from public.dti_stripe_events where stripe_event_id = 'evt_dti_cross_order_000001' and not processed) then
    raise exception 'cross-order webhook changed payment state or was not left retryable';
  end if;

  begin
    perform dti_private.release_order_to_production(v_order_id, v_staff, 'integration-release-before-review');
  exception when others then
    v_blocked := true;
  end;
  if not v_blocked then raise exception 'order entered production without technical approval'; end if;

  if not dti_private.record_artwork_review(v_version_id, v_staff, 'approved', 'Integration technical approval', '[]'::jsonb, 'integration-review-000001') then
    raise exception 'technical review was not recorded';
  end if;
  if not dti_private.release_order_to_production(v_order_id, v_staff, 'integration-release-000001') then
    raise exception 'technically approved paid order was not released';
  end if;
  if not exists (select 1 from public.dti_orders where id = v_order_id and status = 'queued_for_production') then
    raise exception 'production transition was not persisted';
  end if;

  v_blocked := false;
  begin
    perform dti_private.update_dti_production_status(v_order_id, v_customer, 'in_production', 'Unauthorized production update', null, 'integration-unauthorized-0001');
  exception when others then
    v_blocked := true;
  end;
  if not v_blocked then raise exception 'a customer without production permission changed the order'; end if;

  v_blocked := false;
  begin
    perform dti_private.update_dti_production_status(v_order_id, v_staff, 'quality_control', 'Invalid skipped stage', null, 'integration-invalid-stage-0001');
  exception when others then
    v_blocked := true;
  end;
  if not v_blocked then raise exception 'production status skipped a required stage'; end if;

  if not dti_private.update_dti_production_status(v_order_id, v_staff, 'in_production', 'Inicio de impresión de prueba', null, 'integration-stage-production-0001')
    or not dti_private.update_dti_production_status(v_order_id, v_staff, 'in_production', 'Inicio de impresión de prueba', null, 'integration-stage-production-0001')
    or (select count(*) from public.dti_order_events where order_id = v_order_id and idempotency_key = 'dti-production:integration-stage-production-0001') <> 1 then
    raise exception 'production update retry was not idempotent';
  end if;
  if not dti_private.update_dti_production_status(v_order_id, v_staff, 'quality_control', 'Revisión de color y acabado', null, 'integration-stage-qc-000001')
    or not dti_private.update_dti_production_status(v_order_id, v_staff, 'rework_required', 'Color fuera de tolerancia', null, 'integration-stage-rework-0001')
    or not dti_private.update_dti_production_status(v_order_id, v_staff, 'in_production', 'Reimpresión liberada tras ajuste', null, 'integration-stage-reprint-0001')
    or not dti_private.update_dti_production_status(v_order_id, v_staff, 'quality_control', 'Revisión final aprobada', null, 'integration-stage-qc-final-0001')
    or not dti_private.update_dti_production_status(v_order_id, v_staff, 'preparing_dispatch', 'Embalaje según ficha técnica', null, 'integration-stage-packing-00001')
    or not dti_private.update_dti_production_status(v_order_id, v_staff, 'ready_for_dispatch', 'Paquete precintado y listo', null, 'integration-stage-ready-000001')
    or not dti_private.update_dti_production_status(v_order_id, v_staff, 'dispatched', 'Entregado a transporte de prueba', 'TEST-RIDAOS-0001', 'integration-stage-dispatched-0001') then
    raise exception 'standard shipping production flow failed';
  end if;
  if not exists (
    select 1 from public.dti_orders where id = v_order_id and status = 'dispatched'
      and payment_status = 'paid' and production_started_at is not null
      and quality_control_completed_at is not null and dispatch_ready_at is not null
      and dispatched_at is not null and tracking_reference = 'TEST-RIDAOS-0001'
  ) then raise exception 'standard dispatch details were not persisted'; end if;

  if not dti_private.process_stripe_payment_event('evt_dti_late_failure_000001', 'payment_intent.payment_failed', 'pi_test_integration_000001', v_order_id, 6709, 'eur') then
    raise exception 'late duplicate payment failure event was not acknowledged';
  end if;
  if not exists (select 1 from public.dti_orders where id = v_order_id and payment_status = 'paid' and status = 'dispatched') then
    raise exception 'late failure event regressed a paid order';
  end if;

  v_order := dti_private.create_dti_order(
    'integration-order-000004', 'hash-retry-order', v_customer, null,
    'Taller DTI', 'dti-customer@example.test', '+34900000000', null, 1.0, 'pickup', false, date '2026-11-26'
  );
  v_retry_order_id := (v_order->>'orderId')::uuid;
  insert into public.dti_artwork_files(order_id) values (v_retry_order_id) returning id into v_retry_file_id;
  insert into public.dti_artwork_versions(
    artwork_file_id, upload_idempotency_key, version_number, storage_path, original_file_name, format, mime_type,
    file_size_bytes, validation_status, client_accepted_at, uploaded_at
  ) values (
    v_retry_file_id, 'integration-upload-000002', 1, v_retry_order_id::text || '/v1/art.pdf', 'art.pdf', 'PDF', 'application/pdf',
    100, 'passed', now(), now()
  ) returning id into v_retry_version_id;
  update public.dti_orders set status = 'awaiting_payment', payment_status = 'unpaid', total_cents = 1500 where id = v_retry_order_id;
  if dti_private.process_stripe_payment_event('evt_dti_retry_000001', 'payment_intent.succeeded', 'pi_test_retry_000001', v_retry_order_id, 1500, 'eur') then
    raise exception 'webhook event without a stored attempt must be retried';
  end if;
  if not exists (select 1 from public.dti_stripe_events where stripe_event_id = 'evt_dti_retry_000001' and not processed) then
    raise exception 'unmatched webhook event was not left retryable';
  end if;
  insert into public.dti_payment_attempts(order_id, idempotency_key, stripe_payment_intent_id, artwork_version_id, amount_cents, status)
  values (v_retry_order_id, 'integration-attempt-000002', 'pi_test_retry_000001', v_retry_version_id, 1500, 'requires_payment_method');
  if not dti_private.process_stripe_payment_event('evt_dti_retry_decline_000001', 'payment_intent.payment_failed', 'pi_test_retry_000001', v_retry_order_id, 1500, 'eur') then
    raise exception 'declined payment event was not acknowledged';
  end if;
  if not exists (
    select 1 from public.dti_orders where id = v_retry_order_id and payment_status = 'failed' and status = 'awaiting_payment'
  ) or not exists (
    select 1 from public.dti_payment_attempts where order_id = v_retry_order_id and status = 'requires_payment_method'
  ) or not exists (
    select 1 from public.dti_stripe_events where stripe_event_id = 'evt_dti_retry_decline_000001' and processed
  ) then
    raise exception 'declined payment did not remain retryable';
  end if;
  v_blocked := false;
  begin
    perform dti_private.process_stripe_payment_event('evt_dti_retry_000001', 'payment_intent.succeeded', 'pi_test_retry_000001', v_retry_order_id, 1499, 'eur');
  exception when others then
    v_blocked := true;
  end;
  if not v_blocked then raise exception 'mismatched payment amount was accepted'; end if;
  if exists (select 1 from public.dti_stripe_events where stripe_event_id = 'evt_dti_retry_000001' and processed) then
    raise exception 'failed event attempt was incorrectly marked processed';
  end if;
  if not dti_private.process_stripe_payment_event('evt_dti_retry_000001', 'payment_intent.succeeded', 'pi_test_retry_000001', v_retry_order_id, 1500, 'eur') then
    raise exception 'Stripe retry did not process after the payment attempt was persisted';
  end if;
  if not exists (select 1 from public.dti_orders where id = v_retry_order_id and payment_status = 'paid' and status = 'paid_awaiting_technical_review') then
    raise exception 'retried payment was not reconciled';
  end if;
  if not dti_private.record_artwork_review(v_retry_version_id, v_staff, 'approved', 'Pickup artwork approved', '[]'::jsonb, 'integration-review-pickup-0001')
    or not dti_private.release_order_to_production(v_retry_order_id, v_staff, 'integration-release-pickup-0001')
    or not dti_private.update_dti_production_status(v_retry_order_id, v_staff, 'in_production', 'Inicio de producción para recogida', null, 'integration-pickup-production-01')
    or not dti_private.update_dti_production_status(v_retry_order_id, v_staff, 'quality_control', 'Control final para recogida', null, 'integration-pickup-qc-000001')
    or not dti_private.update_dti_production_status(v_retry_order_id, v_staff, 'preparing_dispatch', 'Pedido preparado para recogida', null, 'integration-pickup-pack-00001')
    or not dti_private.update_dti_production_status(v_retry_order_id, v_staff, 'ready_for_pickup', 'Recogida disponible en Ridaos Print BCN', null, 'integration-pickup-ready-0001')
    or not dti_private.update_dti_production_status(v_retry_order_id, v_staff, 'picked_up', 'Entrega presencial confirmada en prueba', null, 'integration-pickup-complete-01') then
    raise exception 'pickup production flow failed';
  end if;
  if not exists (select 1 from public.dti_orders where id = v_retry_order_id and status = 'picked_up' and picked_up_at is not null and tracking_reference is null) then
    raise exception 'pickup completion details were not persisted';
  end if;

  v_order := dti_private.create_dti_order(
    'integration-order-000003', 'hash-long-order', v_customer, null,
    'Taller DTI', 'dti-customer@example.test', '+34900000000', null, 10.1, 'pickup', false, null
  );
  if v_order->>'status' <> 'awaiting_manual_timeline' then raise exception 'large order did not require a manual timeline'; end if;
  if not dti_private.confirm_dti_lead_time((v_order->>'orderId')::uuid, v_staff, 'Despacho estimado en 6 días laborables') then
    raise exception 'staff could not confirm the manual lead time';
  end if;
  if not exists (select 1 from public.dti_orders where id = (v_order->>'orderId')::uuid and status = 'awaiting_artwork' and confirmed_lead_time is not null) then
    raise exception 'confirmed lead time did not unlock the artwork step';
  end if;
end;
$$;

rollback;
