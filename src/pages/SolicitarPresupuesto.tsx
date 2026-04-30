import { useEffect, useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import CtaPanel from '../components/CtaPanel'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import { quoteServiceOptions } from '../lib/products'

type QuoteForm = {
  service: string
  details: string
  width: string
  height: string
  fileName: string
  nombre: string
  email: string
  telefono: string
}

const initialForm: QuoteForm = {
  service: quoteServiceOptions[0],
  details: '',
  width: '',
  height: '',
  fileName: '',
  nombre: '',
  email: '',
  telefono: '',
}

function normalizeServiceFromHash(rawValue: string | null) {
  if (!rawValue) {
    return quoteServiceOptions[0]
  }

  const normalized = rawValue.toLowerCase().replace(/[_-]+/g, ' ')

  const match = quoteServiceOptions.find((service) =>
    normalized.includes(service.toLowerCase().replace(/[_-]+/g, ' ')) ||
    service.toLowerCase().replace(/\s+/g, '-').includes(normalized.replace(/\s+/g, '-')),
  )

  return match ?? quoteServiceOptions[0]
}

function getServiceFromLocationHash() {
  const hash = window.location.hash
  const query = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : ''
  const params = new URLSearchParams(query)

  return normalizeServiceFromHash(params.get('service'))
}

function SolicitarPresupuesto() {
  const [form, setForm] = useState<QuoteForm>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteForm, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const applyHashService = () => {
      setForm((current) => ({
        ...current,
        service: getServiceFromLocationHash(),
      }))
    }

    applyHashService()
    window.addEventListener('hashchange', applyHashService)

    return () => {
      window.removeEventListener('hashchange', applyHashService)
    }
  }, [])

  const serviceSummary = useMemo(
    () => form.service || quoteServiceOptions[0],
    [form.service],
  )

  const setField = (field: keyof QuoteForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = () => {
    const nextErrors: Partial<Record<keyof QuoteForm, string>> = {}

    if (!form.details.trim()) {
      nextErrors.details = 'Describe el proyecto para poder simular la propuesta.'
    }

    if (!form.nombre.trim()) {
      nextErrors.nombre = 'Introduce un nombre de contacto.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Introduce un email de contacto.'
    }

    if (!form.telefono.trim()) {
      nextErrors.telefono = 'Introduce un telefono de contacto.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false)
      return
    }

    setSubmitted(true)
  }

  return (
    <PageShell className="quote-page premium-page">
      <SectionHeader
        className="premium-hero quote-hero"
        description="Presupuesto preparado para rotulacion, neones, papeleria, materiales y trabajos a medida, con condiciones comerciales claras desde el inicio."
        eyebrow="Solicitud de presupuesto"
        hero
        title="Proyectos personalizados con lectura comercial directa."
      />

      <div className="split-grid quote-layout" data-animate="reveal" data-scroll-section>
        <article className="content-card quote-form-panel hover-lift" data-animate="panel" tabIndex={0}>
          <SectionHeader eyebrow="Servicio" title="Define el alcance del proyecto." />

          <div className="service-selector-grid">
            {quoteServiceOptions.map((service) => (
              <button
                className={`service-selector-card${form.service === service ? ' is-selected' : ''}`}
                key={service}
                onClick={() => setField('service', service)}
                type="button"
              >
                {service}
              </button>
            ))}
          </div>

          <div className="configurator-form">
            <label className="field-group" htmlFor="quote-details">
              <span className="field-label">Detalles del proyecto</span>
              <textarea
                className="form-input form-textarea"
                id="quote-details"
                onChange={(event) => setField('details', event.target.value)}
                placeholder="Describe acabados, soporte, instalacion, cantidad o cualquier contexto util."
                rows={5}
                value={form.details}
              />
              {errors.details ? <span className="field-error">{errors.details}</span> : null}
            </label>

            <div className="quote-measure-grid">
              <label className="field-group" htmlFor="quote-width">
                <span className="field-label">Ancho (opcional)</span>
                <input
                  className="form-input"
                  id="quote-width"
                  onChange={(event) => setField('width', event.target.value)}
                  placeholder="Ej. 320 cm"
                  type="text"
                  value={form.width}
                />
              </label>

              <label className="field-group" htmlFor="quote-height">
                <span className="field-label">Alto (opcional)</span>
                <input
                  className="form-input"
                  id="quote-height"
                  onChange={(event) => setField('height', event.target.value)}
                  placeholder="Ej. 180 cm"
                  type="text"
                  value={form.height}
                />
              </label>
            </div>

            <label className="field-group" htmlFor="quote-file">
              <span className="field-label">Archivo de referencia (opcional)</span>
              <input
                className="form-input form-input-file"
                id="quote-file"
                onChange={(event) => setField('fileName', event.target.files?.[0]?.name ?? '')}
                type="file"
              />
              <span className="file-meta">{form.fileName || 'Sin archivo adjunto'}</span>
            </label>

            <label className="field-group" htmlFor="quote-name">
              <span className="field-label">Nombre</span>
              <input
                className="form-input"
                id="quote-name"
                onChange={(event) => setField('nombre', event.target.value)}
                type="text"
                value={form.nombre}
              />
              {errors.nombre ? <span className="field-error">{errors.nombre}</span> : null}
            </label>

            <label className="field-group" htmlFor="quote-email">
              <span className="field-label">Email</span>
              <input
                className="form-input"
                id="quote-email"
                onChange={(event) => setField('email', event.target.value)}
                type="email"
                value={form.email}
              />
              {errors.email ? <span className="field-error">{errors.email}</span> : null}
            </label>

            <label className="field-group" htmlFor="quote-phone">
              <span className="field-label">Telefono</span>
              <input
                className="form-input"
                id="quote-phone"
                onChange={(event) => setField('telefono', event.target.value)}
                type="tel"
                value={form.telefono}
              />
              {errors.telefono ? <span className="field-error">{errors.telefono}</span> : null}
            </label>

            <div className="form-actions">
              <button className="action-button" onClick={handleSubmit} type="button">
                Enviar solicitud
              </button>
            </div>
          </div>
        </article>

        <div className="summary-stack">
          <CommercialNotice />

          <article className="content-card quote-summary-panel hover-lift" data-animate="panel" tabIndex={0}>
            <SectionHeader eyebrow="Resumen comercial" title="Lo que recibira el equipo." />
            <div className="summary-list">
              <div className="summary-row">
                <span>Servicio</span>
                <strong>{serviceSummary}</strong>
              </div>
              <div className="summary-row">
                <span>Medidas</span>
                <strong>
                  {form.width || form.height ? `${form.width || '-'} x ${form.height || '-'}` : 'Pendientes'}
                </strong>
              </div>
              <div className="summary-row">
                <span>Archivo</span>
                <strong>{form.fileName || 'No adjunto'}</strong>
              </div>
              <div className="summary-row summary-row-total">
                <span>Estado</span>
                <strong>Solicitud mock preparada</strong>
              </div>
            </div>
          </article>

          {submitted ? (
            <CtaPanel
              actions={<a className="action-button action-link-button" href="#/contacto">Ir a contacto</a>}
              className="success-card quote-success-panel"
              description="Revisaremos tu proyecto y te responderemos con una propuesta personalizada."
              label="Solicitud recibida"
              title="El flujo comercial esta preparado para la siguiente fase."
            />
          ) : (
            <article className="content-card hover-lift" data-animate="panel" tabIndex={0}>
              <SectionHeader eyebrow="Siguiente paso" title="Presupuesto personalizado sin backend." />
              <ul className="placeholder-list">
                <li>Servicio principal preseleccionable desde el catalogo.</li>
                <li>Condiciones comerciales visibles desde el arranque.</li>
                <li>Contacto listo para respuesta comercial posterior.</li>
              </ul>
            </article>
          )}
        </div>
      </div>
    </PageShell>
  )
}

export default SolicitarPresupuesto
