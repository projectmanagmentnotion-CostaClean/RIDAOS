import CtaPanel from '../../components/CtaPanel'
import SectionHeader from '../../components/SectionHeader'
import { getPublicCtaHref } from '../../lib/navigation'

function FoundationSection() {
  return (
    <div className="split-grid home-lower-grid">
      <CtaPanel
        actions={
          <>
            <a className="action-button action-link-button" data-cursor="interest" href={getPublicCtaHref('catalogo')}>
              Ver catalogo
            </a>
            <a className="card-link" data-cursor="interest" href={getPublicCtaHref('guia')}>
              Ver guia de archivos
            </a>
          </>
        }
        className="home-foundation-panel cursor-interest"
        description="Pasa del catalogo al pedido con una lectura clara de archivo, precio y siguiente paso."
        label="Pedido claro"
        title="Un frente claro para ventas DTF por metro."
      />

      <article className="content-card home-quick-panel hover-lift cursor-interest" data-cursor="interest" tabIndex={0}>
        <SectionHeader title="Accesos rapidos" />
        <ul className="detail-list">
          <li>
            <a className="card-link" data-cursor="interest" href={getPublicCtaHref('catalogo')}>
              Ver catalogo
            </a>
          </li>
          <li>
            <a className="card-link" data-cursor="interest" href={getPublicCtaHref('dtf')}>
              Abrir pagina DTF por metro
            </a>
          </li>
          <li>
            <a className="card-link" data-cursor="interest" href={getPublicCtaHref('guia')}>
              Revisar guia de archivos
            </a>
          </li>
        </ul>
      </article>
    </div>
  )
}

export default FoundationSection
