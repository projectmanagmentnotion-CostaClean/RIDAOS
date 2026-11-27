import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import {
  authorizeDtiWorker,
  createResendDtiProvider,
  processDtiNotificationBatch,
} from '../_shared/dtiNotificationWorker.mjs'

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return new Response('method_not_allowed', { status: 405 })
  const workerToken = Deno.env.get('DTI_NOTIFICATION_WORKER_TOKEN')
  if (!authorizeDtiWorker(request, workerToken)) return new Response('unauthorized', { status: 401 })

  // Safe by default: deploying or invoking the function cannot deliver mail
  // until a separate, explicit QA/Production secret is configured.
  if (Deno.env.get('DTI_EMAIL_TRANSPORT_ENABLED') !== 'true') {
    return Response.json({ status: 'transport_disabled' }, { status: 202, headers: { 'cache-control': 'no-store' } })
  }

  const url = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const providerKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('DTI_EMAIL_FROM')
  if (!url || !serviceKey || !providerKey || !from) {
    return Response.json({ error: 'worker_configuration_missing' }, { status: 503, headers: { 'cache-control': 'no-store' } })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const batchSize = Number.isInteger(body?.batchSize) ? Math.max(1, Math.min(body.batchSize, 25)) : 10
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
    const provider = createResendDtiProvider({ apiKey: providerKey, from })
    const summary = await processDtiNotificationBatch({
      admin,
      provider,
      batchSize,
      logger: (event) => console.info(JSON.stringify(event)),
    })
    const status = summary.error ? 503 : 200
    return Response.json(summary, { status, headers: { 'cache-control': 'no-store' } })
  } catch {
    console.error(JSON.stringify({ event: 'dti_notification_worker_failed', code: 'worker_failure' }))
    return Response.json({ error: 'worker_failure' }, { status: 500, headers: { 'cache-control': 'no-store' } })
  }
})
