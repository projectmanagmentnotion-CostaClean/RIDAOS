import { getPublicCtaHref } from '../lib/navigation'

function NotFoundPage() {
  return (
    <section className="page premium-page">
      <div className="page-hero premium-hero">
        <p className="eyebrow">Ruta no disponible</p>
        <h1>No hemos encontrado esta pagina.</h1>
        <p>
          Vuelve al catalogo o al producto principal para continuar tu pedido sin perder el recorrido.
        </p>
      </div>

      <div className="split-grid">
        <article className="content-card">
          <p className="section-label">Siguiente paso</p>
          <div className="catalog-card-actions">
            <a className="action-button action-link-button" href={getPublicCtaHref('catalogo')}>
              Ver catalogo
            </a>
            <a className="action-button action-button-muted action-link-button" href={getPublicCtaHref('dtf')}>
              Ir a DTF por metro
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}

export default NotFoundPage
