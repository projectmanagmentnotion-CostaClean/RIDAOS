# Ridaos DTI transactional email — V2.9 preparation

## Current state

- Customer notices are enqueued transactionally by the existing DTI outbox migration.
- `dti-notification-worker` is prepared as a Supabase Edge Function. It uses a server-only `SUPABASE_SERVICE_ROLE_KEY`; the browser does not call it or receive provider credentials.
- The endpoint requires a dedicated bearer secret (`DTI_NOTIFICATION_WORKER_TOKEN`) and is locked with `verify_jwt = false` because it performs its own constant-time token check.
- Delivery is disabled unless `DTI_EMAIL_TRANSPORT_ENABLED=true`. Missing provider credentials also returns an error before any claim is made.
- Migration `20261127092808_dti_notification_worker_rpc.sql` adds REST-callable wrappers for claim/complete/fail. They are invoker functions restricted to `service_role`. The `dti_private` schema remains unexposed. This migration is applied in QA only.
- No provider account, key, sender identity, schedule, domain record, or actual message has been created or sent.

## Provider recommendation

Use Resend as the first transport, subject to the business approving its DPA and international data transfer. Its [Email API supports idempotency keys for 24 hours](https://resend.com/changelog/idempotency-keys), API logs/webhooks, and transactional email. Retry volume from this outbox is bounded to six attempts within roughly 32 minutes, within that idempotency window. Resend states that its [stored customer data (including message content and logs) is in the United States](https://resend.com/security/gdpr); selecting an EU send region does not move stored data to the EU. Do not send customer data until the DPA/transfer review is accepted.

Postmark is a credible alternative with [separate transactional streams and a test token that does not deliver mail](https://postmarkapp.com/developer/user-guide/send-email-with-api), plus configurable [7/28-day message retention](https://postmarkapp.com/eu-privacy). Its documented API does not offer the same request idempotency guarantee, so a timeout after provider acceptance would require additional local reconciliation to avoid duplicate sends.

AWS SES in an EU region is an alternative where regional routing is a priority, but AWS documents that a send request returning an error can in rare cases still have been accepted; retries can then create a second message ID ([send behavior](https://docs.aws.amazon.com/ses/latest/dg/send-email-concepts-process.html)). It needs additional event/reconciliation configuration and does not simplify outbox idempotency.

## Enablement sequence — requires separate approval

1. Approve provider/DPA and establish a verified sender identity, SPF, DKIM, and DMARC. Do not add DNS records without explicit DNS authorization.
2. Migration `20261127092808_dti_notification_worker_rpc.sql` is already applied in **QA**; verify `anon`/`authenticated` cannot execute wrappers and `service_role` can.
3. Add QA Edge Function secrets only: `RESEND_API_KEY`, `DTI_EMAIL_FROM`, and a generated `DTI_NOTIFICATION_WORKER_TOKEN`. Keep transport disabled initially.
4. Deploy the worker to QA and invoke it with transport disabled; verify it claims nothing. Then use the provider's non-delivering test mode if available; the current Resend adapter is intended for live API semantics and has no special test mode.
5. After explicit approval to deliver real messages to customers, set `DTI_EMAIL_TRANSPORT_ENABLED=true` in QA, manually invoke one controlled test order, verify outbox/provider logs, then configure a bounded schedule. Do not reuse QA secrets in Production.

## Operational behavior

- The worker processes at most 25 rows per request and serializes a batch.
- Each event's source UUID and notification type form a stable provider idempotency key. The payload is retried unchanged for that event.
- Transient provider/network errors use exponential retry from the database function; after six attempts, the outbox marks the item failed.
- Provider response bodies, recipient addresses, and message contents are never logged. Structured events include only outbox ID, allowlisted notification key, attempt, and safe error code.
- A provider acceptance followed by a database completion failure is safe to retry while Resend's 24-hour idempotency window is active.
- This worker migration is a prerequisite: until applied, the endpoint's RPC calls fail closed and delivery cannot proceed.
