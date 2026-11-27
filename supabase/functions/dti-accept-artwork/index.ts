import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { sha256Hex, dtiCorsHeaders, dtiCorsOriginsForProject } from '../_shared/dtiCommerce.mjs'

const cors = (request: Request) => dtiCorsHeaders(request, dtiCorsOriginsForProject(Deno.env.get('DTI_ALLOWED_ORIGIN') ?? '', Deno.env.get('SUPABASE_URL') ?? ''), 'authorization, apikey, content-type, x-dti-order-token', 'POST, OPTIONS')
const reply = (request: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...Object.fromEntries(cors(request)), 'content-type': 'application/json', 'cache-control': 'no-store' } })
Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: request.headers.get('origin') && !cors(request).has('access-control-allow-origin') ? 403 : 200, headers: cors(request) })
  if (request.method !== 'POST') return reply(request, { error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL'), key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !key) return reply(request, { error: 'service_unavailable' }, 503)
    const { orderId, versionId } = await request.json()
    const admin = createClient(url, key, { auth: { persistSession: false } })
    const auth = request.headers.get('authorization')
    const authClient = auth ? createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: auth } } }) : null
    const { data: userData } = authClient ? await authClient.auth.getUser() : { data: { user: null } }
    if (auth && !userData.user) return reply(request, { error: 'invalid_authentication' }, 401)
    const { data: order, error } = await admin.from('dti_orders').select('id,owner_id,guest_access_token_hash,status').eq('id', orderId).maybeSingle()
    if (error) throw error
    if (!order) return reply(request, { error: 'order_not_found' }, 404)
    let allowed = Boolean(userData.user && order.owner_id === userData.user.id)
    const guestToken = request.headers.get('x-dti-order-token')
    if (!order.owner_id && guestToken) allowed = await sha256Hex(guestToken) === order.guest_access_token_hash
    if (!allowed) return reply(request, { error: 'forbidden' }, 403)
    if (order.status !== 'awaiting_artwork' && order.status !== 'awaiting_artwork_review') return reply(request, { error: 'order_not_accepting_artwork' }, 409)
    const { data: result, error: acceptanceError } = await admin.rpc('dti_accept_artwork', {
      p_order_id: orderId,
      p_version_id: versionId,
      p_actor_user_id: userData.user?.id ?? null,
    })
    if (acceptanceError) {
      if (/server_validation_required/.test(acceptanceError.message)) return reply(request, { error: 'server_validation_required' }, 422)
      if (/only_latest_version_can_be_accepted/.test(acceptanceError.message)) return reply(request, { error: 'only_latest_version_can_be_accepted' }, 409)
      if (/order_not_accepting_artwork/.test(acceptanceError.message)) return reply(request, { error: 'order_not_accepting_artwork' }, 409)
      if (/artwork_version_not_found/.test(acceptanceError.message)) return reply(request, { error: 'artwork_not_found' }, 404)
      throw acceptanceError
    }
    return reply(request, result)
  } catch (error) {
    console.error('dti-accept-artwork failure', error instanceof Error ? error.message : 'unknown')
    return reply(request, { error: 'acceptance_failed' }, 400)
  }
})
