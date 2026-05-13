import { useEffect, useMemo, useState } from 'react'
import CommercialNotice from '../components/CommercialNotice'
import ConfiguratorFieldRenderer from '../components/ConfiguratorFieldRenderer'
import CtaPanel from '../components/CtaPanel'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import { getQuoteServices } from '../lib/catalogSelectors'
import { publicRoutes } from '../lib/navigation'
import type { ConfiguratorField } from '../types/product'

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

const quoteFields: ConfiguratorField[] = [
  {
    key: 'details',
    type: 'textarea',
    label: 'Detalles del proyecto',
    required: true,
    rows: 5,
    placeholder: 'Describe acabados, soporte, instalacion, cantidad o cualquier contexto util.',
  },
  {
    key: 'width',
    type: 'text',
    label: 'Ancho (opcional)',
    placeholder: 'Ej. 320 cm',
  },
  {
    key: 'height',
    type: 'text',
    label: 'Alto (opcional)',
    placeholder: 'Ej. 180 cm',
  },
  {
    key: 'fileName',
    type: 'file',
    label: 'Archivo de referencia (opcional)',
    accept: '.pdf,.ai,.eps,.svg,.png,.jpg,.jpeg,.tiff,.zip',
  },
]

function normalizeServiceKey(rawValue: string | null, serviceOptions: ReturnType<typeof getQuoteServices>) {
  if (!rawValue) {
    return serviceOptions[0]?.key ?? ''
  }

  const normalized = rawValue.toLowerCase().replace(/[_\s]+/g, '-')
  const match = serviceOptions.find((service) => {
    const key = service.key.toLowerCase().replace(/[_\s]+/g, '-')
    const label = service.label.toLowerCase().replace(/[_\s]+/g, '-')
    return normalized === key || normalized === label || label.includes(normalized)
  })

  return match?.key ?? serviceOptions[0]?.key ?? ''
}

function getServiceFromLocationHash(serviceOptions: ReturnType<typeof getQuoteServices>) {
  const hash = window.location.hash
  const query = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : ''
  const params = new URLSearchParams(query)

  return normalizeServiceKey(params.get('service'), serviceOptions)
}

function SolicitarPresupuesto() {
  const serviceOptions = useMemo(() => getQuoteServices(), [])
  const [form, setForm] = useState<QuoteForm>({
    service: serviceOptions[0]?.key ?? '',
    details: '',
    width: '',
    height: '',
    fileName: '',
    nombre: '',
    email: '',
    telefono: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteForm, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const applyHashService = () => {
      setForm((current) => ({
        ...current,
        service: getServiceFromLocationHash(serviceOptions),
      }))
    }

    applyHashService()
    window.addEventListener('hashchange', applyHashService)

    return () => {
      window.removeEventListener('hashchange', applyHashService)
    }
  }, [serviceOptions])

  const selectedService = useMemo(
    () => serviceOptions.find((service) => service.key === form.service) ?? serviceOptions[0],
    [form.service, serviceOptions],
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
        description="Presupuesto preparado desde el catalogo central para servicios, materiales y proyectos a medida."
        eyebrow="Solicitud de presupuesto"
        hero
        title="Proyectos personalizados con lectura comercial directa."
      />

      <div className="split-grid quote-layout" data-animate="reveal" data-scroll-section>
        <article className="content-card quote-form-panel hover-lift" data-animate="panel" tabIndex={0}>
          <SectionHeader eyebrow="Servicio" title="Define el alcance del proyecto." />

          <div className="service-selector-grid">
            {serviceOptions.map((service) => (
              <button
                className={`service-selector-card${form.service === service.key ? ' is-selected' : ''}`}
                key={service.key}
                onClick={() => setField('service', service.key)}
                type="button"
              >
                {service.label}
              </button>
            ))}
          </div>

          <div className="configurator-form">
            {quoteFields.map((field) => (
              <ConfiguratorFieldRenderer
                error={errors[field.key as keyof QuoteForm]}
                field={field}
                key={field.key}
                onChange={(key, value) => setField(key as keyof QuoteForm, value)}
                onFileChange={(_, file) => setField('fileName', file?.name ?? '')}
                value={form[field.key as keyof QuoteForm] ?? ''}
              />
            ))}

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
          <CommercialNotice items={selectedService?.legalNotes ?? []} />

          <article className="content-card quote-summary-panel hover-lift" data-animate="panel" tabIndex={0}>
            <SectionHeader eyebrow="Resumen comercial" title="Lo que recibira el equipo." />
            <div className="summary-list">
              <div className="summary-row">
                <span>Servicio</span>
                <strong>{selectedService?.label ?? 'Pendiente'}</strong>
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
                <strong>Solicitud lista para enviar</strong>
              </div>
            </div>
          </article>

          {submitted ? (
            <CtaPanel
              actions={
                <>
                  <a className="action-button action-link-button" href={publicRoutes.contacto}>Ir a contacto</a>
                  <a className="card-link" href={publicRoutes.catalogo}>Ver catalogo</a>
                </>
              }
              className="success-card quote-success-panel"
              description="Revisaremos tu proyecto y te responderemos con una propuesta personalizada."
              label="Solicitud recibida"
              title="Tu proyecto ya esta listo para recibir una propuesta."
            />
          ) : (
            <article className="content-card hover-lift" data-animate="panel" tabIndex={0}>
              <SectionHeader eyebrow="Siguiente paso" title="Presupuesto centralizado desde el catalogo." />
              <ul className="placeholder-list">
                <li>Servicio principal derivado del catalogo central.</li>
                <li>Condiciones comerciales visibles sin duplicar listas manuales.</li>
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
