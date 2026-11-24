import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { sha256Hex } from '../_shared/dtiCommerce.mjs'

const cors = { 'access-control-allow-origin': Deno.env.get('DTI_ALLOWED_ORIGIN') ?? 'https://dti.ridaosprint.com', 'access-control-allow-headers': 'authorization, apikey, content-type, x-dti-order-token', 'access-control-allow-methods': 'POST, OPTIONS' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } })
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
  if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL'), key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !key) return reply({ error: 'service_unavailable' }, 503)
    const { orderId, versionId } = await request.json()
    const admin = createClient(url, key, { auth: { persistSession: false } })
    const auth = request.headers.get('authorization')
    const authClient = auth ? createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: auth } } }) : null
    const { data: userData } = authClient ? await authClient.auth.getUser() : { data: { user: null } }
    if (auth && !userData.user) return reply({ error: 'invalid_authentication' }, 401)
    const { data: order, error } = await admin.from('dti_orders').select('id,owner_id,guest_access_token_hash,status').eq('id', orderId).maybeSingle()
    if (error) throw error
    if (!order) return reply({ error: 'order_not_found' }, 404)
    let allowed = Boolean(userData.user && order.owner_id === userData.user.id)
    const guestToken = request.headers.get('x-dti-order-token')
    if (!order.owner_id && guestToken) allowed = await sha256Hex(guestToken) === order.guest_access_token_hash
    if (!allowed) return reply({ error: 'forbidden' }, 403)
    if (order.status !== 'awaiting_artwork' && order.status !== 'awaiting_artwork_review') return reply({ error: 'order_not_accepting_artwork' }, 409)
    const { data: versions, error: versionError } = await admin.from('dti_artwork_versions').select('id,validation_status,format').eq('id', versionId).order('version_number', { ascending: false }).limit(1)
    if (versionError) throw versionError
    const version = versions?.[0]
    if (!version || !['passed', 'manual_review'].includes(version.validation_status)) return reply({ error: 'server_validation_required' }, 422)
    const { data: latest, error: latestError } = await admin.from('dti_artwork_versions').select('id').eq('artwork_file_id', (await admin.from('dti_artwork_versions').select('artwork_file_id').eq('id', versionId).single()).data?.artwork_file_id).order('version_number', { ascending: false }).limit(1).single()
    if (latestError || latest?.id !== versionId) return reply({ error: 'only_latest_version_can_be_accepted' }, 409)
    const now = new Date().toISOString()
    const { error: updateError } = await admin.from('dti_artwork_versions').update({ client_accepted_at: now }).eq('id', versionId)
    if (updateError) throw updateError
    await admin.from('dti_artwork_events').insert({ artwork_version_id: versionId, event_type: 'client_accepted', actor_user_id: userData.user?.id ?? null, actor_kind: 'customer', details: { accepted_at: now } })
    return reply({ accepted: true, versionId, validation: version.validation_status, professionalReviewStillRequired: ['AI', 'PSD', 'SVG', 'CDR'].includes(version.format) || version.validation_status === 'manual_review' })
  } catch (error) {
    console.error('dti-accept-artwork failure', error instanceof Error ? error.message : 'unknown')
    return reply({ error: 'acceptance_failed' }, 400)
  }
})
