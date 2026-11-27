import { getQuoteHref, publicRoutes } from '../lib/navigation'
import { usePublicationPolicy } from '../config/publicationContext'
import { isPublicationRouteAllowed } from '../config/publicationPolicy.mjs'

function Contacto() {
  const publicationPolicy = usePublicationPolicy()
  const dtiOnly = publicationPolicy.dtiOnlyMode
  const relatedRoutes = [
    { href: publicRoutes.dtf, label: 'Configurar DTI Innuro' },
    { href: publicRoutes.misPedidos, label: 'Mis pedidos' },
    { href: publicRoutes.ayuda, label: 'Ayuda y preguntas frecuentes' },
    { href: publicRoutes.catalogo, label: 'Volver al catalogo' },
    { href: getQuoteHref(), label: 'Solicitar presupuesto' },
    { href: publicRoutes.rotulacion, label: 'Ver rotulacion de furgonetas' },
    { href: publicRoutes.neones, label: 'Ver neones' },
    { href: publicRoutes.legal, label: 'Revisar base legal' },
  ].filter((item) => isPublicationRouteAllowed(item.href, publicationPolicy))

  return (
    <section className="page premium-page">
      <div className="page-hero premium-hero content-readable">
        <p className="eyebrow">Contacto</p>
        <h1>Canal directo para pedidos y presupuestos.</h1>
        <p>{dtiOnly
          ? 'Contacta con Ridaos Print BCN para resolver dudas sobre tu pedido DTI Innuro, sus archivos o su seguimiento.'
          : 'Contacta con RidaosPrint para resolver dudas, pedir una propuesta o continuar un proyecto especial.'}</p>
        <div className="catalog-cta-row">
          {isPublicationRouteAllowed(getQuoteHref(), publicationPolicy) ? <a className="action-button action-link-button" href={getQuoteHref()}>
            Solicitar presupuesto
          </a> : null}
          {isPublicationRouteAllowed(publicRoutes.catalogo, publicationPolicy) ? <a className="action-button action-button-muted action-link-button" href={publicRoutes.catalogo}>
            Ver catalogo
          </a> : null}
        </div>
      </div>

      <div className="split-grid section-fluid">
        <article className="content-card panel-integrated content-readable">
          <p className="section-label">Canales</p>
          <ul className="hint-list">
            <li>{dtiOnly ? 'Soporte para pedidos DTI Innuro y archivos.' : 'Correo comercial para nuevas solicitudes.'}</li>
            <li>{dtiOnly ? 'Consulta el estado desde Mis pedidos.' : 'WhatsApp o telefono para seguimiento rapido.'}</li>
            <li>{dtiOnly ? 'La revisión técnica y el presupuesto de adaptación se mantienen separados del pago.' : 'Formulario web para centralizar la propuesta del proyecto.'}</li>
          </ul>
        </article>

        <article className="content-card panel-integrated content-readable">
          <p className="section-label">Navegacion relacionada</p>
          <ul className="hint-list">
            {relatedRoutes.map((item) => <li key={item.href}>
              <a className="card-link" href={item.href}>{item.label}</a>
            </li>)}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default Contacto
