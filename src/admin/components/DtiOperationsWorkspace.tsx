import { useEffect, useState, type FormEvent } from 'react'
import AdminSection from './AdminSection'
import {
  callDtiStaff,
  clearDtiStaffSession,
  ensureDtiStaffSession,
  getDtiArtworkDownload,
  getDtiStaffSession,
  newDtiOperationKey,
  requestDtiPasswordRecovery,
  signInDtiStaff,
  signOutDtiStaff,
  type DtiStaffOrder,
  type DtiStaffSession,
} from '../services/dtiOperationsApi'

type DtiStaffResponse = { permissions: string[]; orders: DtiStaffOrder[] }

const statusLabels: Record<string, string> = {
  awaiting_artwork: 'Esperando archivo',
  awaiting_artwork_review: 'Revisión técnica',
  awaiting_manual_timeline: 'Plazo bajo consulta',
  awaiting_payment: 'Pendiente de pago',
  paid_awaiting_technical_review: 'Pago confirmado · revisión técnica',
  queued_for_production: 'Aprobado · cola de producción',
  in_production: 'En producción',
  quality_control: 'Control de calidad',
  rework_required: 'Ajuste de producción',
  preparing_dispatch: 'Preparando salida',
  ready_for_dispatch: 'Listo para envío',
  dispatched: 'Despachado',
  ready_for_pickup: 'Listo para recoger',
  picked_up: 'Recogido',
  cancelled: 'Cancelado',
}

const stageAfter: Record<string, string> = {
  queued_for_production: 'in_production',
  in_production: 'quality_control',
  rework_required: 'in_production',
  preparing_dispatch: 'ready_for_dispatch',
  ready_for_dispatch: 'dispatched',
  ready_for_pickup: 'picked_up',
}

const euro = (cents: number, currency = 'EUR') => new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(cents / 100)
const dateTime = (value: string) => new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

function DtiOperationsWorkspace() {
  const [session, setSession] = useState<DtiStaffSession | null>(() => getDtiStaffSession())
  const [orders, setOrders] = useState<DtiStaffOrder[]>([])
  const [permissions, setPermissions] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)
  const [summaryByOrder, setSummaryByOrder] = useState<Record<string, string>>({})
  const [trackingByOrder, setTrackingByOrder] = useState<Record<string, string>>({})
  const [reviewedVersion, setReviewedVersion] = useState<Record<string, boolean>>({})
  const [downloadByVersion, setDownloadByVersion] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)

  const refresh = async (activeSession: DtiStaffSession) => {
    setLoading(true)
    setError('')
    setAccessDenied(false)
    try {
      const result = await callDtiStaff<DtiStaffResponse>(activeSession, { action: 'list_orders' })
      setOrders(result.orders)
      setPermissions(result.permissions)
    } catch (cause) {
      const reason = cause instanceof Error ? cause.message : 'No se pudo cargar la cola DTI.'
      if (reason === 'insufficient_staff_permission') {
        setAccessDenied(true)
        setOrders([])
        setPermissions([])
      } else {
        if (reason === 'dti_session_expired') {
          clearDtiStaffSession()
          setSession(null)
          setError('La sesión ha caducado. Inicia sesión de nuevo.')
        } else setError(reason)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!session) return
    let active = true
    void ensureDtiStaffSession(session)
      .then((nextSession) => {
        if (active) setSession(nextSession)
        return callDtiStaff<DtiStaffResponse>(nextSession, { action: 'list_orders' })
      })
      .then((result) => {
        if (!active) return
        setOrders(result.orders)
        setPermissions(result.permissions)
        setAccessDenied(false)
        setError('')
      })
      .catch((cause: unknown) => {
        if (!active) return
        const reason = cause instanceof Error ? cause.message : 'No se pudo cargar la cola DTI.'
        if (reason === 'dti_session_expired') {
          clearDtiStaffSession()
          setSession(null)
          setError('La sesión ha caducado. Inicia sesión de nuevo.')
        } else if (reason === 'insufficient_staff_permission') {
          setAccessDenied(true)
          setOrders([])
          setPermissions([])
        } else {
          setError(reason)
        }
      })
    return () => { active = false }
  }, [session])

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const next = await signInDtiStaff(email, password)
      setPassword('')
      setSession(next)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    void signOutDtiStaff()
    setSession(null)
    setOrders([])
    setPermissions([])
    setAccessDenied(false)
    setNotice('Sesión cerrada en este dispositivo.')
  }

  const handleRecovery = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setRecoverySent(false)
    try {
      await requestDtiPasswordRecovery(email)
      setRecoverySent(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo solicitar el enlace.')
    } finally {
      setLoading(false)
    }
  }

  const perform = async (order: DtiStaffOrder, payload: Record<string, unknown>, successMessage: string) => {
    if (!session) return
    setLoading(true)
    setError('')
    setNotice('')
    try {
      await callDtiStaff(session, payload, newDtiOperationKey())
      setNotice(successMessage)
      await refresh(session)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `No se pudo actualizar el pedido ${order.id}.`)
    } finally {
      setLoading(false)
    }
  }

  const openArtwork = async (versionId: string) => {
    if (!session) return
    setLoading(true)
    setError('')
    try {
      const result = await getDtiArtworkDownload(session, versionId)
      setDownloadByVersion((current) => ({ ...current, [versionId]: result.url }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo preparar la vista del archivo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminSection
      description="Cola real de Supabase QA. Las decisiones técnicas y los cambios de producción quedan auditados en el pedido."
      title="Operaciones DTI"
      actions={session ? <button className="action-button action-button-muted" onClick={handleSignOut} type="button">Cerrar sesión · {session.email}</button> : null}
    >
      {!session ? (
        <div>
          <p>Acceso de personal mediante Supabase Auth. El acceso operativo depende de permisos DTI ya asignados; esta pantalla no crea usuarios ni permisos.</p>
          {recoveryMode ? (
            <form className="dti-staff-login" onSubmit={(event) => void handleRecovery(event)}>
              <p>Si la cuenta puede recuperar el acceso, recibirás un enlace seguro en su dirección de correo.</p>
              <label>Email de personal<input autoComplete="username" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
              <button className="action-button action-button-primary" disabled={loading} type="submit">{loading ? 'Solicitando…' : 'Enviar enlace de recuperación'}</button>
              <button className="action-button action-button-muted" onClick={() => { setRecoveryMode(false); setRecoverySent(false); setError('') }} type="button">Volver al acceso</button>
              {recoverySent ? <p role="status">Solicitud recibida. Revisa el correo si la cuenta está registrada.</p> : null}
            </form>
          ) : (
            <form className="dti-staff-login" onSubmit={handleSignIn}>
              <label>Email de personal<input autoComplete="username" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
              <label>Contraseña<input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
              <button className="action-button action-button-primary" disabled={loading} type="submit">{loading ? 'Conectando…' : 'Acceder a la cola DTI'}</button>
              <button className="action-button action-button-muted" onClick={() => { setRecoveryMode(true); setError('') }} type="button">He olvidado mi contraseña</button>
            </form>
          )}
        </div>
      ) : (
        <>
          <div className="dti-staff-toolbar">
            <span>Sesión protegida · permisos: {permissions.join(', ') || 'comprobando'}</span>
            <button className="action-button action-button-muted" disabled={loading} onClick={() => void refresh(session)} type="button">Actualizar cola</button>
          </div>
          {accessDenied ? <div className="inline-notice" role="status">La sesión es válida, pero esta cuenta no tiene permisos operativos DTI asignados. Solicita al responsable autorizado que verifique identidad y rol antes de conceder acceso.</div> : null}
          {orders.length === 0 && !accessDenied && !loading ? <div className="empty-admin-state"><h3>Sin pedidos DTI visibles</h3><p>La cola está vacía o esta cuenta no tiene permisos para revisar pedidos.</p></div> : null}
          <div className="dti-staff-orders">
            {orders.map((order) => {
              const artwork = order.latestArtwork
              const nextStatus = order.status === 'quality_control'
                ? 'preparing_dispatch'
                : order.status === 'preparing_dispatch'
                  ? order.shipping_method === 'standard' ? 'ready_for_dispatch' : 'ready_for_pickup'
                  : stageAfter[order.status]
              const reviewKey = artwork?.id ?? order.id
              const summary = summaryByOrder[order.id] ?? ''
              const tracking = trackingByOrder[order.id] ?? ''
              const canReview = Boolean(artwork && permissions.includes('review_artwork') && ['paid_awaiting_technical_review', 'awaiting_artwork_review'].includes(order.status))
              const canRelease = order.payment_status === 'paid' && order.status === 'paid_awaiting_technical_review' && artwork?.latestReview?.decision === 'approved' && permissions.includes('manage_production')
              const canAdvance = Boolean(nextStatus && order.payment_status === 'paid' && permissions.includes('manage_production'))

              return (
                <article className="dti-staff-order" key={order.id}>
                  <header className="dti-staff-order__head">
                    <div><span className="section-label">Pedido DTI · {order.id}</span><h3>{order.customer_name}</h3></div>
                    <strong className="status-badge status-info">{statusLabels[order.status] ?? order.status}</strong>
                  </header>
                  <div className="dti-staff-order__facts">
                    <span>{order.meters} m · ancho útil {order.useful_width_mm} mm</span>
                    <span>{order.shipping_method === 'standard' ? 'Envío peninsular' : 'Recogida BCN'}</span>
                    <span>Pago {order.payment_status} · {euro(order.total_cents, order.currency_code)}</span>
                    {order.adaptation_requested ? <span>Adaptación profesional solicitada</span> : null}
                    {order.estimated_dispatch_date ? <span>Despacho estimado: {order.estimated_dispatch_date}</span> : null}
                  </div>
                  {artwork ? (
                    <div className="dti-staff-artwork">
                      <div><strong>{artwork.original_file_name}</strong><span>v{artwork.version_number} · {artwork.format} · {artwork.validation_status}</span>
                        {artwork.latestReview ? <span>Última revisión: {artwork.latestReview.decision} · {artwork.latestReview.summary}</span> : <span>Sin revisión técnica</span>}
                      </div>
                      <button className="action-button action-button-muted" disabled={loading || !permissions.includes('review_artwork')} onClick={() => void openArtwork(artwork.id)} type="button">Preparar original privado</button>
                      {downloadByVersion[artwork.id] ? <a className="action-button action-button-muted" href={downloadByVersion[artwork.id]} rel="noreferrer" target="_blank">Abrir original · caduca en 2 min</a> : null}
                    </div>
                  ) : <p className="dti-staff-muted">Todavía no hay archivo vinculado al pedido.</p>}
                  {(canReview || canRelease || canAdvance || order.status === 'awaiting_manual_timeline' && permissions.includes('manage_quotes')) ? (
                    <div className="dti-staff-actions">
                      {canReview ? <label className="dti-staff-confirm"><input checked={Boolean(reviewedVersion[reviewKey])} onChange={(event) => setReviewedVersion((current) => ({ ...current, [reviewKey]: event.target.checked }))} type="checkbox" />Confirmo que he abierto y revisado el archivo y sus medidas.</label> : null}
                      <label>Resumen de trazabilidad<textarea maxLength={500} minLength={5} onChange={(event) => setSummaryByOrder((current) => ({ ...current, [order.id]: event.target.value }))} placeholder="Qué se revisó o qué paso se completó" value={summary} /></label>
                      {order.status === 'ready_for_dispatch' ? <label>Referencia de transporte<input maxLength={120} minLength={4} onChange={(event) => setTrackingByOrder((current) => ({ ...current, [order.id]: event.target.value }))} value={tracking} /></label> : null}
                      <div className="dti-staff-buttons">
                        {canReview ? <>
                          <button className="action-button action-button-primary" disabled={loading || !reviewedVersion[reviewKey] || summary.trim().length < 5} onClick={() => void perform(order, { action: 'review_artwork', versionId: artwork!.id, decision: 'approved', summary, checklist: ['archivo abierto', 'medidas verificadas', 'validación del servidor revisada'] }, 'Aprobación técnica registrada.')} type="button">Aprobar archivo</button>
                          <button className="action-button action-button-muted" disabled={loading || !reviewedVersion[reviewKey] || summary.trim().length < 5} onClick={() => void perform(order, { action: 'review_artwork', versionId: artwork!.id, decision: 'revision_requested', summary, checklist: [] }, 'Solicitud de revisión registrada.')} type="button">Pedir corrección</button>
                          <button className="action-button action-button-muted" disabled={loading || !reviewedVersion[reviewKey] || summary.trim().length < 5} onClick={() => void perform(order, { action: 'review_artwork', versionId: artwork!.id, decision: 'rejected', summary, checklist: [] }, 'Rechazo técnico registrado.')} type="button">Rechazar archivo</button>
                        </> : null}
                        {canRelease ? <button className="action-button action-button-primary" disabled={loading || summary.trim().length < 5} onClick={() => void perform(order, { action: 'release_production', orderId: order.id }, 'Pedido liberado a producción.')} type="button">Liberar a producción</button> : null}
                        {canAdvance ? <button className="action-button action-button-primary" disabled={loading || summary.trim().length < 5 || order.status === 'ready_for_dispatch' && tracking.trim().length < 4} onClick={() => void perform(order, { action: 'update_production_status', orderId: order.id, status: nextStatus, summary, trackingReference: nextStatus === 'dispatched' ? tracking : null }, `Estado actualizado: ${statusLabels[nextStatus!]}.`)} type="button">{statusLabels[nextStatus!]}</button> : null}
                        {order.status === 'quality_control' && permissions.includes('manage_production') ? <button className="action-button action-button-muted" disabled={loading || summary.trim().length < 5} onClick={() => void perform(order, { action: 'update_production_status', orderId: order.id, status: 'rework_required', summary, trackingReference: null }, 'Ajuste de producción registrado.')} type="button">Solicitar reproceso</button> : null}
                        {order.status === 'awaiting_manual_timeline' && permissions.includes('manage_quotes') ? <button className="action-button action-button-primary" disabled={loading || summary.trim().length < 5} onClick={() => void perform(order, { action: 'confirm_lead_time', orderId: order.id, summary }, 'Plazo confirmado y registrado.')} type="button">Confirmar plazo</button> : null}
                      </div>
                    </div>
                  ) : null}
                  <details className="dti-staff-events"><summary>Trazabilidad · {order.events.length} eventos recientes</summary>
                    {order.events.length ? <ol>{order.events.map((event, index) => <li key={`${event.event_type}-${event.created_at}-${index}`}><strong>{statusLabels[event.event_type.replace('production_', '')] ?? event.event_type}</strong><span>{event.actor_kind} · {dateTime(event.created_at)}</span><small>{typeof event.details.summary === 'string' ? event.details.summary : ''}</small></li>)}</ol> : <p>No hay eventos registrados.</p>}
                  </details>
                </article>
              )
            })}
          </div>
          <p className="dti-staff-muted">Las acciones quedan trazadas en Supabase. Hay plantillas de notificación preparadas, pero el envío está desactivado hasta aprobar un proveedor transaccional y conectar la cola.</p>
        </>
      )}
      {loading ? <p role="status">Cargando operación DTI…</p> : null}
      {notice ? <div className="inline-notice" role="status">{notice}</div> : null}
      {error ? <div className="inline-notice inline-notice-error" role="alert">{error}</div> : null}
    </AdminSection>
  )
}

export default DtiOperationsWorkspace
