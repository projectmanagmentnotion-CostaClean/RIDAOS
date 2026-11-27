import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const originalMigration = await readFile(
  new URL('../supabase/migrations/20261126150000_dti_transactional_notification_outbox.sql', import.meta.url),
  'utf8',
)
const correctionMigration = await readFile(
  new URL('../supabase/migrations/20261127085400_dti_notification_outbox_claim_column_qualification.sql', import.meta.url),
  'utf8',
)
const workerMigration = await readFile(
  new URL('../supabase/migrations/20261127092808_dti_notification_worker_rpc.sql', import.meta.url),
  'utf8',
)

test('outbox schema is additive, private, and deduplicates source events', () => {
  assert.match(originalMigration, /create table public\.dti_notification_outbox/i)
  assert.match(originalMigration, /source_event_id uuid not null unique/i)
  assert.match(originalMigration, /enable row level security/i)
  assert.match(originalMigration, /create policy dti_notification_outbox_service_only[\s\S]*?for all to service_role/i)
  assert.match(originalMigration, /revoke all on public\.dti_notification_outbox from public, anon, authenticated/i)
  assert.match(originalMigration, /on conflict \(source_event_id\) do nothing/i)
  assert.doesNotMatch(originalMigration, /\b(drop table|truncate|delete from)\b/i)
})

test('claim and corrective SQL keep client access revoked and qualify output-column collisions', () => {
  const claim = correctionMigration.match(/create or replace function dti_private\.claim_dti_customer_notifications\([\s\S]*?\n\$\$;/i)?.[0]
  assert.ok(claim, 'corrective migration must replace the claim function')
  assert.match(claim, /for update skip locked/i)
  assert.match(claim, /outbox\.attempt_count < 6/i)
  assert.match(claim, /outbox\.attempt_count >= 6/i)
  assert.doesNotMatch(claim, /and\s+attempt_count\s*[<>]/i)
  assert.match(correctionMigration, /revoke all on function dti_private\.claim_dti_customer_notifications[\s\S]*?from public, anon, authenticated/i)
  assert.match(correctionMigration, /grant execute on function dti_private\.claim_dti_customer_notifications[\s\S]*?to service_role/i)
  assert.doesNotMatch(correctionMigration, /\b(drop table|truncate|delete from|alter table)\b/i)
})

test('worker REST RPC wrappers remain invoker functions restricted to service_role', () => {
  assert.equal((workerMigration.match(/security invoker/gi) ?? []).length, 3)
  assert.equal((workerMigration.match(/revoke all on function public\.dti_/gi) ?? []).length, 3)
  assert.equal((workerMigration.match(/grant execute on function public\.dti_[\s\S]*?to service_role/gi) ?? []).length, 3)
  assert.doesNotMatch(workerMigration, /\b(drop table|truncate|delete from|alter table)\b/i)
  assert.doesNotMatch(workerMigration, /grant execute[\s\S]*?to (?:public|anon|authenticated)/i)
})
