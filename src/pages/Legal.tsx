import CommercialNotice from '../components/CommercialNotice'
import PageShell from '../components/PageShell'
import SectionHeader from '../components/SectionHeader'
import TrustGrid from '../components/TrustGrid'

const legalSections = [
  {
    title: 'Aviso legal',
    summary: 'Identificacion del titular, canales de contacto y alcance general del servicio.',
  },
  {
    title: 'Privacidad',
    summary: 'Tratamiento de datos de contacto, pedidos, archivos y comunicaciones relacionadas con cada proyecto.',
  },
  {
    title: 'Cookies',
    summary: 'Informacion sobre analitica, preferencias tecnicas y almacenamiento necesario para el recorrido web.',
  },
  {
    title: 'Terminos y condiciones',
    summary: 'Condiciones aplicables a configuraciones, presupuestos, fabricacion, aprobaciones y entregas.',
  },
  {
    title: 'Devoluciones',
    summary: 'Criterios de revision de incidencias y alcance de reposiciones en productos personalizados.',
  },
  {
    title: 'Envios y recogida',
    summary: 'Plazos orientativos, modalidades de entrega y coordinacion de recogidas cuando corresponda.',
  },
  {
    title: 'Archivos y comprobacion tecnica',
    summary: 'Responsabilidades sobre formato, contenido, aprobacion de arte final y viabilidad de fabricacion.',
  },
]

function Legal() {
  return (
    <PageShell className="premium-page legal-page">
      <SectionHeader
        className="premium-hero legal-hero"
        description="Resumen informativo de los puntos legales y comerciales que acompanaran pedidos, presupuestos, archivos y entregas."
        eyebrow="Legal y confianza"
        hero
        title="Informacion legal clara para revisar antes de comprar."
      />

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Documentos" title="Bloques legales preparados para completar." />
        <div className="legal-grid">
          {legalSections.map((section) => (
            <article className="content-card panel-integrated legal-card hover-lift" data-animate="panel" key={section.title}>
              <p className="section-label">{section.title}</p>
              <p>{section.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Confianza" title="Compromisos visibles para pedidos y presupuestos." />
        <TrustGrid />
      </section>

      <section className="content-section" data-animate="reveal">
        <SectionHeader eyebrow="Condiciones comerciales" title="Condiciones visibles antes de confirmar el pedido." />
        <CommercialNotice />
      </section>
    </PageShell>
  )
}

export default Legal
