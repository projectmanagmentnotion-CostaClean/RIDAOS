import FAQSection from '../components/FAQSection'
import PageShell from '../components/PageShell'
import ProcessSteps from '../components/ProcessSteps'
import SectionHeader from '../components/SectionHeader'
import TrustGrid from '../components/TrustGrid'
import { getPublicCtaHref } from '../lib/navigation'

const acceptedFormats = ['PDF', 'AI', 'EPS', 'SVG', 'PNG', 'JPG', 'TIFF', 'ZIP']

const commonMistakes = [
  'Enviar capturas de pantalla en lugar del arte final.',
  'Trabajar en RGB cuando la pieza se va a imprimir en CMYK.',
  'Olvidar sangrados o margenes de seguridad.',
  'Rasterizar textos pequenos o no adjuntar tipografias.',
  'Comprimir archivos sin nombrado claro ni estructura.',
]

const finalChecklist = [
  'Revisar medidas finales y escala de impresion.',
  'Confirmar resolucion adecuada para el soporte.',
  'Verificar colores, transparencias y negros enriquecidos.',
  'Adjuntar fuentes o convertir textos a curvas.',
  'Agrupar archivos finales y referencias en un ZIP si hay varias piezas.',
]

const guideFaq = [
  {
    question: 'Archivos',
    answer: 'Se aceptan PDF, AI, EPS, SVG, PNG, JPG, TIFF y ZIP.',
  },
  {
    question: 'Fabricacion',
    answer: 'La comprobacion tecnica se confirma antes de fabricar cuando haga falta.',
  },
  {
    question: 'Presupuestos personalizados',
    answer: 'Si el proyecto no encaja en compra directa, el siguiente paso es presupuesto.',
  },
]

function GuiaArchivos() {
  return (
    <PageShell className="guide-page premium-page">
      <SectionHeader
        className="guide-hero premium-hero"
        description="Esta guia concentra criterios tecnicos para reducir errores antes de pasar por el configurador DTF o solicitar un presupuesto para otras lineas del catalogo."
        eyebrow="Preparacion de archivos"
        hero
        title="Arte listo para fabricar sin friccion innecesaria."
      />

      <div className="split-grid guide-layout">
        <article className="content-card guide-lead-card" data-animate="panel">
          <p className="section-label">Formatos aceptados</p>
          <div className="format-chip-grid">
            {acceptedFormats.map((format) => (
              <span className="format-chip" key={format}>
                {format}
              </span>
            ))}
          </div>

          <div className="guide-copy-block">
            <h3>Resolucion recomendada</h3>
            <p>
              Para arte raster, prepara el archivo a tamano final. Trabaja cerca de 300 ppp cuando se necesite detalle fino.
            </p>
          </div>

          <div className="guide-copy-block">
            <h3>Sangrado y corte</h3>
            <p>
              Deja sangrado cuando el acabado lo requiera y respeta una zona de seguridad para textos y elementos criticos.
            </p>
          </div>
        </article>

        <article className="content-card upload-preview-card" data-animate="panel">
          <p className="section-label">Zona de carga</p>
          <div className="upload-preview-box" aria-label="Panel visual de carga de archivos">
            <div aria-hidden="true" className="upload-preview-icon">
              +
            </div>
            <h3>Zona de carga visual</h3>
            <p>Arrastra aqui tus artes finales o reune todo en un ZIP. Este panel muestra como se presentara la carga del proyecto.</p>
            <div className="upload-preview-meta">
              <span>PDF, AI, EPS, SVG, PNG, JPG, TIFF, ZIP</span>
              <span>Maximo recomendado: estructura limpia por proyecto</span>
            </div>
          </div>
          <a aria-label="Ir al producto DTF por metro" className="action-button action-link-button" href={getPublicCtaHref('dtf')}>
            Ir a DTF por metro
          </a>
        </article>
      </div>

      <div className="guide-card-grid" data-animate="reveal">
        <article className="content-card guide-card" data-animate="panel">
          <p className="section-label">CMYK y RGB</p>
          <p>No des por hecho que un color visto en pantalla se comportara igual impreso. Revisa el espacio de color antes de fabricar.</p>
        </article>

        <article className="content-card guide-card" data-animate="panel">
          <p className="section-label">Tipografia</p>
          <p>Convierte textos a curvas cuando el flujo lo permita o adjunta las fuentes necesarias para evitar sustituciones.</p>
        </article>
      </div>

      <div className="guide-card-grid" data-animate="reveal">
        <article className="content-card guide-card" data-animate="panel">
          <p className="section-label">Errores comunes</p>
          <ul className="guide-checklist">
            {commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </article>

        <article className="content-card guide-card" data-animate="panel">
          <p className="section-label">Checklist final</p>
          <ul className="guide-checklist">
            {finalChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Como funciona" title="Proceso base antes de fabricar." />
        <ProcessSteps />
      </section>

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Confianza" title="Comprobacion tecnica visible desde la guia." />
        <TrustGrid />
      </section>

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="FAQ" title="Preguntas rapidas sobre archivos y proceso." />
        <FAQSection items={guideFaq} />
      </section>
    </PageShell>
  )
}

export default GuiaArchivos
