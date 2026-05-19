import CtaPanel from '../../components/CtaPanel'
import { getPublicCtaHref } from '../../lib/navigation'

function FinalCtaSection() {
  return (
    <section className="content-section">
      <CtaPanel
        className="cursor-interest"
        actions={
          <a className="action-button action-link-button" data-cursor="interest" href={getPublicCtaHref('dtf')}>
            Configurar DTF ahora
          </a>
        }
        description="Configura, sube archivo y avanza con una experiencia clara de principio a fin."
        label="Siguiente paso"
        title="Activa tu pedido DTF."
      />
    </section>
  )
}

export default FinalCtaSection
