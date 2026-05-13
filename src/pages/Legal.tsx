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
  'Archivos y comprobacion tecnica',
]

function Legal() {
  return (
    <PageShell className="premium-page legal-page">
      <SectionHeader
        className="premium-hero legal-hero"
        description="Base para los contenidos juridicos y comerciales que acompanaran el flujo de compra y presupuesto."
        eyebrow="Legal y confianza"
        hero
        title="Informacion legal clara antes del texto definitivo."
      />

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Documentos" title="Bloques legales preparados para completar." />
        <div className="legal-grid">
          {legalSections.map((section) => (
            <article className="content-card legal-card hover-lift" data-animate="panel" key={section}>
              <p className="section-label">{section}</p>
              <p>Texto pendiente de confirmacion legal.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Confianza" title="Compromisos visibles para el flujo comercial." />
        <TrustGrid />
      </section>

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Condiciones comerciales" title="Base comercial del catalogo 2026." />
        <CommercialNotice />
      </section>
    </PageShell>
  )
}

export default Legal
