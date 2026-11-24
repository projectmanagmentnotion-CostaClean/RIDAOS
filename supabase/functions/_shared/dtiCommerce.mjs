export const DTI_PRICE_CENTS_PER_METER = 1500
export const DTI_SHIPPING_CENTS = 500
export const DTI_ADAPTATION_CENTS_PER_HOUR = 3500
export const DTI_VAT_BASIS_POINTS = 2100
export const DTI_MAX_FILE_BYTES = 262_144_000
const CRC32_TABLE = Uint32Array.from({ length: 256 }, (_, value) => {
  let crc = value
  for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  return crc >>> 0
})

const roundRatio = (value, numerator, denominator) => Math.round((value * numerator) / denominator)

export function calculateDtiOrder({ meters, shippingMethod, adaptationRequested = false, orderedAt = new Date() }) {
  const numericMeters = Number(meters)
  if (!Number.isFinite(numericMeters) || numericMeters < 1 || Math.round(numericMeters * 10) !== numericMeters * 10) {
    throw new RangeError('El pedido mínimo es 1 m y el metraje debe avanzar en pasos de 0,1 m.')
  }
  if (!['pickup', 'standard'].includes(shippingMethod)) {
    throw new TypeError('El método de envío no es válido.')
  }

  const productTotalCents = Math.round(numericMeters * DTI_PRICE_CENTS_PER_METER)
  const shippingTotalCents = shippingMethod === 'standard' ? DTI_SHIPPING_CENTS : 0
  const preparationWorkingDays = numericMeters <= 5 ? 2 : numericMeters <= 10 ? 3 : null
  const estimatedDispatchDate = preparationWorkingDays === null ? null : estimateDtiDispatchDate(orderedAt, preparationWorkingDays)

  return {
    meters: numericMeters,
    usefulWidthMm: 550,
    unitPriceCents: DTI_PRICE_CENTS_PER_METER,
    productTotalCents,
    productVatCents: roundRatio(productTotalCents, DTI_VAT_BASIS_POINTS, 10_000 + DTI_VAT_BASIS_POINTS),
    shippingMethod,
    shippingTotalCents,
    shippingVatCents: shippingMethod === 'standard'
      ? roundRatio(DTI_SHIPPING_CENTS, DTI_VAT_BASIS_POINTS, 10_000 + DTI_VAT_BASIS_POINTS)
      : 0,
    adaptationRequested: Boolean(adaptationRequested),
    totalCents: productTotalCents + shippingTotalCents,
    preparationWorkingDays,
    estimatedDispatchDate,
    initialStatus: numericMeters > 10 ? 'awaiting_manual_timeline' : 'awaiting_artwork',
    paymentStatus: 'not_ready',
  }
}

function estimateDtiDispatchDate(value, preparationWorkingDays) {
  const date = value instanceof Date ? value : new Date(value)
  if (!Number.isFinite(date.getTime())) throw new TypeError('La fecha de pedido no es válida.')
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date).map(({ type, value: part }) => [type, part]))
  let day = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)))
  const isWeekend = (candidate) => candidate.getUTCDay() === 0 || candidate.getUTCDay() === 6
  const afterCutoff = Number(parts.hour) > 18 || (Number(parts.hour) === 18 && Number(parts.minute) >= 30)
  if (afterCutoff || isWeekend(day)) {
    do day.setUTCDate(day.getUTCDate() + 1)
    while (isWeekend(day))
  }
  let added = 0
  while (added < preparationWorkingDays) {
    day.setUTCDate(day.getUTCDate() + 1)
    if (!isWeekend(day)) added += 1
  }
  return day.toISOString().slice(0, 10)
}

export function calculateDtiAdaptationQuote(hours) {
  const numericHours = Number(hours)
  if (!Number.isFinite(numericHours) || numericHours <= 0 || numericHours > 500 || Math.round(numericHours * 100) !== numericHours * 100) {
    throw new RangeError('Las horas deben ser positivas, como máximo 500 y con precisión de 0,01 h.')
  }
  const netCents = Math.round(numericHours * DTI_ADAPTATION_CENTS_PER_HOUR)
  const vatCents = roundRatio(netCents, DTI_VAT_BASIS_POINTS, 10_000)
  return { hours: numericHours, hourlyRateCents: DTI_ADAPTATION_CENTS_PER_HOUR, netCents, vatCents, totalCents: netCents + vatCents }
}

export function normalizeDtiArtworkMetadata({ fileName, mimeType, fileSizeBytes }) {
  if (typeof fileName !== 'string' || !fileName.trim() || fileName.length > 240 || /[\u0000-\u001f]/.test(fileName)) {
    throw new TypeError('El nombre del archivo no es válido.')
  }
  if (!Number.isSafeInteger(fileSizeBytes) || fileSizeBytes < 1 || fileSizeBytes > DTI_MAX_FILE_BYTES) {
    throw new RangeError('El archivo supera el límite permitido de 250 MiB o está vacío.')
  }

  if (/(^|[\\/])\.\.([\\/]|$)/.test(fileName)) throw new TypeError('El nombre del archivo no es válido.')
  const safeFileName = fileName.replace(/^.*[\\/]/, '').normalize('NFC')
  const extension = safeFileName.split('.').pop()?.toUpperCase()
  const formats = new Set(['PNG', 'PDF', 'AI', 'PSD', 'SVG', 'CDR'])
  if (!extension || !formats.has(extension)) throw new TypeError('El formato debe ser PNG, PDF, AI, PSD, SVG o CDR.')

  const normalizedMimeType = (mimeType || 'application/octet-stream').toLowerCase().split(';')[0].trim()
  if (extension === 'PNG' && normalizedMimeType !== 'image/png') throw new TypeError('El MIME declarado no coincide con PNG.')
  if (extension === 'PDF' && normalizedMimeType !== 'application/pdf') throw new TypeError('El MIME declarado no coincide con PDF.')

  return {
    safeFileName,
    format: extension,
    mimeType: normalizedMimeType,
    fileSizeBytes,
    reviewRequired: ['AI', 'PSD', 'SVG', 'CDR'].includes(extension),
  }
}

export async function validateDtiArtworkBytes({ format, bytes }) {
  const file = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  if (!file.length) return { status: 'failed', reason: 'empty_file' }

  if (format === 'PNG') {
    const signature = [137, 80, 78, 71, 13, 10, 26, 10]
    if (file.length < 33 || !signature.every((value, index) => file[index] === value)) {
      return { status: 'failed', reason: 'invalid_png_signature' }
    }
    const view = new DataView(file.buffer, file.byteOffset, file.byteLength)
    let offset = 8
    let width = 0
    let height = 0
    let seenHeader = false
    let seenImageData = false
    let seenEnd = false
    let interlaced = false
    let channels = 0
    const imageDataChunks = []
    while (offset + 12 <= file.length) {
      const length = view.getUint32(offset)
      const typeStart = offset + 4
      const dataStart = offset + 8
      const crcStart = dataStart + length
      const chunkEnd = crcStart + 4
      if (length > file.length || chunkEnd > file.length) return { status: 'failed', reason: 'truncated_png_chunk' }
      const type = String.fromCharCode(file[typeStart], file[typeStart + 1], file[typeStart + 2], file[typeStart + 3])
      if (!seenHeader && (type !== 'IHDR' || length !== 13 || offset !== 8)) return { status: 'failed', reason: 'missing_png_ihdr' }
      if (crc32(file, typeStart, crcStart) !== view.getUint32(crcStart)) return { status: 'failed', reason: 'png_chunk_crc_mismatch' }
      if (type === 'IHDR') {
        if (seenHeader || length !== 13) return { status: 'failed', reason: 'invalid_png_ihdr' }
        width = view.getUint32(dataStart)
        height = view.getUint32(dataStart + 4)
        const bitDepth = file[dataStart + 8]
        const colorType = file[dataStart + 9]
        channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 })[colorType] ?? 0
        const validDepths = { 0: [1, 2, 4, 8, 16], 2: [8, 16], 3: [1, 2, 4, 8], 4: [8, 16], 6: [8, 16] }
        if (!width || !height || width > 100_000 || height > 100_000 || width * height > 120_000_000) return { status: 'failed', reason: 'png_dimensions_out_of_range' }
        if (!validDepths[colorType]?.includes(bitDepth) || file[dataStart + 10] !== 0 || file[dataStart + 11] !== 0 || file[dataStart + 12] > 1) return { status: 'failed', reason: 'invalid_png_ihdr_fields' }
        interlaced = file[dataStart + 12] === 1
        seenHeader = true
      } else if (type === 'IDAT') {
        if (!seenHeader || seenEnd) return { status: 'failed', reason: 'invalid_png_idat_order' }
        seenImageData = true
        imageDataChunks.push([dataStart, dataStart + length])
      } else if (type === 'IEND') {
        if (length !== 0 || !seenImageData || chunkEnd !== file.length) return { status: 'failed', reason: 'invalid_png_iend' }
        seenEnd = true
        offset = chunkEnd
        break
      } else if (!/^[a-zA-Z]{4}$/.test(type) || (type[0] === type[0].toUpperCase() && !['PLTE'].includes(type))) {
        return { status: 'failed', reason: 'unknown_critical_png_chunk' }
      }
      if (type === 'acTL' || type === 'fcTL' || type === 'fdAT') return { status: 'manual_review', reason: 'animated_png_manual_review', reviewRequired: true }
      offset = chunkEnd
    }
    if (!seenEnd || offset !== file.length) return { status: 'failed', reason: 'missing_png_iend' }
    if (interlaced) return { status: 'manual_review', reason: 'interlaced_png_manual_review', reviewRequired: true }
    const bitDepth = file[24]
    const rowBytes = Math.ceil((width * channels * bitDepth) / 8)
    const expectedDecodedBytes = height * (rowBytes + 1)
    if (!Number.isSafeInteger(expectedDecodedBytes) || expectedDecodedBytes > 64 * 1024 * 1024) {
      return { status: 'manual_review', reason: 'large_decoded_png_manual_review', reviewRequired: true }
    }
    let decodedBytes = 0
    let invalidFilter = false
    const compressedStream = new ReadableStream({
      start(controller) {
        for (const [start, end] of imageDataChunks) if (end > start) controller.enqueue(file.subarray(start, end))
        controller.close()
      },
    })
    try {
      const reader = compressedStream.pipeThrough(new DecompressionStream('deflate')).getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (let index = 0; index < value.length; index += 1) {
          if ((decodedBytes + index) % (rowBytes + 1) === 0 && value[index] > 4) invalidFilter = true
        }
        decodedBytes += value.length
        if (decodedBytes > expectedDecodedBytes) {
          await reader.cancel()
          return { status: 'failed', reason: 'png_decoded_data_exceeds_dimensions' }
        }
      }
    } catch {
      return { status: 'failed', reason: 'invalid_png_compressed_image_data' }
    }
    if (decodedBytes !== expectedDecodedBytes || invalidFilter) return { status: 'failed', reason: 'invalid_png_scanlines' }
    return { status: 'passed', dimensions: { width, height }, reviewRequired: false }
  }

  if (format === 'PDF') {
    if (file.length < 16) return { status: 'failed', reason: 'pdf_too_small' }
    const head = new TextDecoder().decode(file.slice(0, Math.min(file.length, 1024)))
    const tail = new TextDecoder().decode(file.slice(Math.max(0, file.length - 4096)))
    if (!head.includes('%PDF-') || !tail.includes('%%EOF')) return { status: 'failed', reason: 'invalid_pdf_structure' }
    if (file.length > 25 * 1024 * 1024) return { status: 'manual_review', reason: 'large_pdf_manual_review', reviewRequired: true }
    const content = new TextDecoder('latin1').decode(file)
    const xrefMatch = content.match(/\bstartxref\s+(\d+)\s+%%EOF/i)
    const xrefOffset = xrefMatch ? Number(xrefMatch[1]) : Number.NaN
    const xrefTarget = Number.isSafeInteger(xrefOffset) ? content.slice(xrefOffset, xrefOffset + 256) : ''
    if (!/\/Root\s+\d+\s+\d+\s+R/.test(content) || (!/^xref(?:\r?\n)/.test(xrefTarget) && !/\/Type\s*\/XRef\b/.test(xrefTarget))) {
      return { status: 'failed', reason: 'missing_pdf_catalog_or_xref' }
    }
    if (/\/(?:JavaScript|JS|OpenAction|AA|Launch|EmbeddedFile|RichMedia)\b/i.test(content)) {
      return { status: 'manual_review', reason: 'pdf_active_content_marker', reviewRequired: true }
    }
    return { status: 'passed', reviewRequired: false }
  }

  if (['AI', 'PSD', 'SVG', 'CDR'].includes(format)) {
    return { status: 'manual_review', reason: 'professional_review_required', reviewRequired: true }
  }

  return { status: 'failed', reason: 'unsupported_format' }
}

function crc32(bytes, start, end) {
  let crc = 0xffffffff
  for (let index = start; index < end; index += 1) {
    crc = CRC32_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

export function checkDtiPaymentEligibility({ order, latestVersion, latestProfessionalReview, approvedQuote }) {
  if (!order || !['awaiting_payment', 'awaiting_artwork', 'awaiting_artwork_review'].includes(order.status) || !['unpaid', 'not_ready', 'failed'].includes(order.payment_status)) {
    return { allowed: false, reason: 'order_not_payable' }
  }
  if (!latestVersion || !latestVersion.client_accepted_at) {
    return { allowed: false, reason: 'customer_acceptance_required' }
  }
  if (latestVersion.validation_status === 'failed' || latestVersion.validation_status === 'pending_upload' || latestVersion.validation_status === 'pending_server_validation') {
    return { allowed: false, reason: 'server_validation_required' }
  }
  if ((['AI', 'PSD', 'SVG', 'CDR'].includes(latestVersion.format) || latestVersion.validation_status === 'manual_review') && latestProfessionalReview?.decision !== 'approved') {
    return { allowed: false, reason: 'professional_review_required' }
  }
  if (order.adaptation_requested && (!approvedQuote || approvedQuote.status !== 'approved' || approvedQuote.id !== order.adaptation_quote_id)) {
    return { allowed: false, reason: 'approved_adaptation_quote_required' }
  }
  return { allowed: true, amountCents: order.total_cents }
}

export async function sha256Hex(value) {
  const bytes = value instanceof Uint8Array ? value : new TextEncoder().encode(String(value))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function deriveGuestOrderToken(secret, idempotencyKey, recoveryKey) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(`dti-order:${idempotencyKey}:recovery:${recoveryKey}`)))
  return Array.from(signature, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function verifyStripeWebhookSignature(rawBody, signatureHeader, webhookSecret, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (typeof signatureHeader !== 'string' || !webhookSecret?.startsWith('whsec_')) return false
  const values = signatureHeader.split(',').map((entry) => entry.trim().split('=', 2))
  const timestamp = values.find(([key]) => key === 't')?.[1]
  const signatures = values.filter(([key]) => key === 'v1').map(([, value]) => value)
  if (!timestamp || signatures.length === 0 || !/^\d+$/.test(timestamp)) return false
  const time = Number(timestamp)
  if (!Number.isSafeInteger(time) || Math.abs(nowSeconds - time) > 300) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(webhookSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const expectedBytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${rawBody}`)))
  const expected = Array.from(expectedBytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return signatures.some((signature) => constantTimeEqual(signature.toLowerCase(), expected))
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return difference === 0
}
