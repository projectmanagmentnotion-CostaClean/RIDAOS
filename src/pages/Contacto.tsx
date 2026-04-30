function Contacto() {
  return (
    <section className="page premium-page">
      <div className="page-hero premium-hero">
        <p className="eyebrow">Contacto</p>
        <h1>Canal directo para pedidos y presupuestos.</h1>
        <p>
          Página base para concentrar datos de contacto, tiempos de respuesta y
          acceso directo al nuevo flujo de propuesta personalizada.
        </p>
      </div>

      <div className="split-grid">
        <article className="content-card">
          <p className="section-label">Canales</p>
          <ul className="placeholder-list">
            <li>Correo comercial para nuevas solicitudes.</li>
            <li>WhatsApp o telefono para seguimiento rapido.</li>
            <li>Formulario web en futura fase.</li>
          </ul>
        </article>

        <article className="content-card">
          <p className="section-label">Navegacion relacionada</p>
          <ul className="placeholder-list">
            <li>
              <a className="card-link" href="#/catalogo">
                Volver al catalogo
              </a>
            </li>
            <li>
              <a className="card-link" href="#/presupuesto">
                Solicitar presupuesto
              </a>
            </li>
            <li>
              <a className="card-link" href="#/servicios/rotulacion">
                Ver rotulacion de furgonetas
              </a>
            </li>
            <li>
              <a className="card-link" href="#/servicios/neones">
                Ver neones
              </a>
            </li>
            <li>
              <a className="card-link" href="#/legal">
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
