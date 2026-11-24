import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0'
import { calculateDtiOrder, deriveGuestOrderToken, normalizeDtiShippingAddress, sha256Hex } from '../_shared/dtiCommerce.mjs'

const cors = { 'access-control-allow-origin': Deno.env.get('DTI_ALLOWED_ORIGIN') ?? 'https://dti.ridaosprint.com', 'access-control-allow-headers': 'authorization, apikey, content-type, idempotency-key, x-dti-order-token, x-dti-recovery-key', 'access-control-allow-methods': 'GET, POST, OPTIONS' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'content-type': 'application/json', 'cache-control': 'no-store' } })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })
  if (!['GET', 'POST'].includes(request.method)) return reply({ error: 'method_not_allowed' }, 405)
  try {
    const url = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const tokenSecret = Deno.env.get('DTI_GUEST_TOKEN_SECRET')
    if (!url || !serviceKey || (request.method === 'POST' && (!tokenSecret || tokenSecret.length < 32))) return reply({ error: 'service_unavailable' }, 503)
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
    const authorization = request.headers.get('authorization')
    const authClient = authorization ? createClient(url, Deno.env.get('SUPABASE_ANON_KEY') ?? '', { global: { headers: { Authorization: authorization } } }) : null
    const { data: authData } = authClient ? await authClient.auth.getUser() : { data: { user: null } }
    if (authorization && !authData.user) return reply({ error: 'invalid_authentication' }, 401)

    if (request.method === 'GET') {
      const orderId = new URL(request.url).searchParams.get('orderId')
      if (!orderId || !/^[0-9a-f-]{36}$/i.test(orderId)) return reply({ error: 'invalid_order' }, 400)
      const { data: order, error } = await admin.from('dti_orders').select('id,owner_id,guest_access_token_hash,meters,useful_width_mm,product_total_cents,product_vat_cents,shipping_method,shipping_total_cents,shipping_vat_cents,total_cents,currency_code,status,payment_status,adaptation_requested,estimated_dispatch_date,preparation_working_days,confirmed_lead_time,lead_time_confirmed_at,created_at').eq('id', orderId).maybeSingle()
      if (error) throw error
      if (!order) return reply({ error: 'order_not_found' }, 404)
      let allowed = Boolean(authData.user && order.owner_id === authData.user.id)
      const guestToken = request.headers.get('x-dti-order-token')
      if (order.owner_id === null && guestToken) allowed = await sha256Hex(guestToken) === order.guest_access_token_hash
      if (!allowed) return reply({ error: 'forbidden' }, 403)
      const [{ data: artworkFile, error: artworkFileError }, { data: quotes, error: quotesError }] = await Promise.all([
        admin.from('dti_artwork_files').select('id').eq('order_id', order.id).maybeSingle(),
        admin.from('dti_adaptation_quotes').select('id,quote_version,hours,hourly_rate_cents,net_cents,vat_cents,total_cents,status,created_at').eq('order_id', order.id).order('quote_version', { ascending: false }).limit(1),
      ])
      if (artworkFileError) throw artworkFileError
      if (quotesError) throw quotesError
      let latestArtwork = null
      if (artworkFile) {
        const { data: versions, error: versionsError } = await admin.from('dti_artwork_versions').select('id,version_number,original_file_name,format,file_size_bytes,validation_status,validation_summary,client_accepted_at').eq('artwork_file_id', artworkFile.id).order('version_number', { ascending: false }).limit(1)
        if (versionsError) throw versionsError
        latestArtwork = versions?.[0] ?? null
      }
      return reply({
        order: {
          id: order.id, meters: order.meters, usefulWidthMm: order.useful_width_mm,
          productTotalCents: order.product_total_cents, productVatCents: order.product_vat_cents,
          shippingMethod: order.shipping_method, shippingTotalCents: order.shipping_total_cents,
          shippingVatCents: order.shipping_vat_cents, totalCents: order.total_cents,
          currency: order.currency_code, status: order.status, paymentStatus: order.payment_status,
          adaptationRequested: order.adaptation_requested, estimatedDispatchDate: order.estimated_dispatch_date,
          preparationWorkingDays: order.preparation_working_days, confirmedLeadTime: order.confirmed_lead_time,
          leadTimeConfirmedAt: order.lead_time_confirmed_at, createdAt: order.created_at,
        },
        latestArtwork: latestArtwork ? {
          versionId: latestArtwork.id, version: latestArtwork.version_number, fileName: latestArtwork.original_file_name,
          format: latestArtwork.format, sizeBytes: latestArtwork.file_size_bytes,
          validation: latestArtwork.validation_status, validationSummary: latestArtwork.validation_summary,
          clientAcceptedAt: latestArtwork.client_accepted_at,
        } : null,
        adaptationQuote: quotes?.[0] ?? null,
      })
    }

    const body = await request.json()
    const idempotencyKey = request.headers.get('idempotency-key')
    if (!idempotencyKey || !/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) return reply({ error: 'idempotency_key_required' }, 400)
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 7 || phone.length > 40 || customerName.length < 2 || customerName.length > 120) return reply({ error: 'valid_contact_required' }, 400)
    let totals: ReturnType<typeof calculateDtiOrder>
    try {
      totals = calculateDtiOrder({ meters: body.meters, shippingMethod: body.shippingMethod, adaptationRequested: body.adaptationRequested })
    } catch {
      return reply({ error: 'invalid_order_configuration' }, 400)
    }
    let shippingAddress
    try {
      shippingAddress = normalizeDtiShippingAddress(totals.shippingMethod, body.shippingAddress)
    } catch {
      return reply({ error: 'valid_peninsular_address_required' }, 400)
    }
    const ownerId = authData.user?.id ?? null
    const recoveryKey = request.headers.get('x-dti-recovery-key')
    if (!ownerId && (!recoveryKey || !/^[A-Za-z0-9_-]{43,128}$/.test(recoveryKey))) return reply({ error: 'guest_recovery_key_required' }, 400)
    const guestToken = ownerId ? null : await deriveGuestOrderToken(tokenSecret!, idempotencyKey, recoveryKey!)
    const guestTokenHash = guestToken ? await sha256Hex(guestToken) : null
    const requestHash = await sha256Hex(JSON.stringify({ customerName, email, phone, shippingAddress, meters: totals.meters, shippingMethod: totals.shippingMethod, adaptationRequested: totals.adaptationRequested }))
    const { data: existing, error: lookupError } = await admin.from('dti_orders').select('id,owner_id,request_hash,guest_access_token_hash,status,total_cents,estimated_dispatch_date,confirmed_lead_time').eq('idempotency_key', idempotencyKey).maybeSingle()
    if (lookupError) throw lookupError
    if (existing) {
      const sameOwner = ownerId ? existing.owner_id === ownerId : existing.owner_id === null && existing.guest_access_token_hash === guestTokenHash
      if (!sameOwner || existing.request_hash !== requestHash) return reply({ error: 'idempotency_conflict' }, 409)
      return reply({ orderId: existing.id, status: existing.status, totalCents: existing.total_cents, estimatedDispatchDate: existing.estimated_dispatch_date, confirmedLeadTime: existing.confirmed_lead_time, ...(guestToken ? { guestAccessToken: guestToken } : {}) })
    }
    const { data: order, error } = await admin.rpc('dti_create_order', {
      p_idempotency_key: idempotencyKey, p_request_hash: requestHash, p_owner_id: ownerId,
      p_guest_access_token_hash: guestTokenHash, p_customer_name: customerName, p_customer_email: email,
      p_customer_phone: phone, p_shipping_address: shippingAddress,
      p_meters: totals.meters, p_shipping_method: totals.shippingMethod,
      p_adaptation_requested: totals.adaptationRequested, p_estimated_dispatch_date: totals.estimatedDispatchDate,
    })
    if (error) {
      if (error.code === '23505' || error.message.includes('idempotency')) return reply({ error: 'retry_with_same_idempotency_key' }, 409)
      throw error
    }
    return reply({ ...order, ...(guestToken ? { guestAccessToken: guestToken } : {}) }, 201)
  } catch (error) {
    console.error('dti-orders failure', error instanceof Error ? error.message : 'unknown')
    return reply({ error: 'order_operation_failed' }, 500)
  }
})
