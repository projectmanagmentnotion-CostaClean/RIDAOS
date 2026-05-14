import { getQuoteHref, publicRoutes } from '../lib/navigation'

function Contacto() {
  return (
    <section className="page premium-page">
      <div className="page-hero premium-hero">
        <p className="eyebrow">Contacto</p>
        <h1>Canal directo para pedidos y presupuestos.</h1>
        <p>
          Contacta con RidaosPrint para resolver dudas, pedir una propuesta o continuar un proyecto especial.
        </p>
        <div className="catalog-cta-row">
          <a className="action-button action-link-button" href={getQuoteHref()}>
            Solicitar presupuesto
          </a>
          <a className="action-button action-button-muted action-link-button" href={publicRoutes.catalogo}>
            Ver catalogo
          </a>
        </div>
      </div>

      <div className="split-grid">
        <article className="content-card">
          <p className="section-label">Canales</p>
          <ul className="hint-list">
            <li>Correo comercial para nuevas solicitudes.</li>
            <li>WhatsApp o telefono para seguimiento rapido.</li>
            <li>Formulario web para centralizar la propuesta del proyecto.</li>
          </ul>
        </article>

        <article className="content-card">
          <p className="section-label">Navegacion relacionada</p>
          <ul className="hint-list">
            <li>
              <a className="card-link" href={publicRoutes.catalogo}>
                Volver al catalogo
              </a>
            </li>
            <li>
              <a className="card-link" href={getQuoteHref()}>
                Solicitar presupuesto
              </a>
            </li>
            <li>
              <a className="card-link" href={publicRoutes.rotulacion}>
                Ver rotulacion de furgonetas
              </a>
            </li>
            <li>
              <a className="card-link" href={publicRoutes.neones}>
                Ver neones
              </a>
            </li>
            <li>
              <a className="card-link" href={publicRoutes.legal}>
                Revisar base legal
              </a>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default Contacto
