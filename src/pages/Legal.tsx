import CommercialNotice from '../components/CommercialNotice'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import TrustGrid from '../components/TrustGrid'

const legalSections = [
  'Aviso legal',
  'Privacidad',
  'Cookies',
  'Terminos y condiciones',
  'Devoluciones',
  'Envios y recogida',
  'Archivos y revision tecnica',
]

function Legal() {
  return (
    <PageShell className="premium-page legal-page">
      <SectionHeader
        className="premium-hero legal-hero"
        description="Estructura base para contenidos juridicos, operativos y de confianza. Cada bloque queda pendiente de revision legal antes de publicacion final."
        eyebrow="Legal y confianza"
        hero
        title="Base legal clara antes de completar el texto definitivo."
      />

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Documentos" title="Bloques legales preparados para completar." />
        <div className="legal-grid">
          {legalSections.map((section) => (
            <article className="content-card legal-card hover-lift" data-animate="panel" key={section}>
              <p className="section-label">{section}</p>
              <p>Pendiente de revision legal.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Confianza" title="Compromisos visibles para el flujo comercial." />
        <TrustGrid />
      </section>

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Condiciones comerciales" title="Base operativa del catalogo 2026." />
        <CommercialNotice />
      </section>
    </PageShell>
  )
}

export default Legal
