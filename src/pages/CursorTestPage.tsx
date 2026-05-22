function CursorTestPage() {
  return (
    <div className="page premium-page motion-test-page">
      <section className="page-hero content-card">
        <p className="eyebrow">Cursor Test</p>
        <h1>Verificacion local del PremiumCursor</h1>
        <p>
          Esta ruta sirve para comprobar hover, inputs, cards interactivas y cambios de estado sin depender de otras vistas.
        </p>
      </section>

      <section className="card-grid">
        <article className="content-card">
          <h2>Link y CTA</h2>
          <p>Comprueba que el cursor crece en enlaces y botones.</p>
          <div className="catalog-card-actions">
            <a className="action-button" data-cursor="interactive" href="#/catalogo">
              Ir a catalogo
            </a>
            <button className="action-button action-button-muted" type="button">
              Boton de prueba
            </button>
          </div>
        </article>

        <article className="content-card cursor-interest" data-cursor="interest">
          <h2>Card premium</h2>
          <p>Este bloque debe activar el estado verde por delegacion.</p>
        </article>

        <article className="content-card">
          <h2>Formulario</h2>
          <div className="cms-document-form">
            <label className="cms-field">
              <span>Nombre</span>
              <input className="form-input" placeholder="Texto de prueba" type="text" />
            </label>
            <label className="cms-field">
              <span>Tipo</span>
              <select className="form-input" defaultValue="dtf">
                <option value="dtf">DTF</option>
                <option value="stickers">Pegatinas</option>
              </select>
            </label>
            <label className="cms-field">
              <span>Notas</span>
              <textarea className="form-input" placeholder="Textarea de prueba" rows={4} />
            </label>
          </div>
        </article>
      </section>
    </div>
  )
}

export default CursorTestPage
