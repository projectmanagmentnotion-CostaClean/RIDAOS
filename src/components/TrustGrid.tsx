const defaultTrustItems = [
  {
    title: 'Pago seguro proximamente',
    description: 'La capa de pago se activara mas adelante tras validacion tecnica y legal.',
  },
  {
    title: 'Revision de archivos',
    description: 'El arte final se revisa antes de pasar a produccion cuando el flujo lo requiera.',
  },
  {
    title: 'Produccion bajo aprobacion',
    description: 'La produccion queda sujeta a confirmacion visual o tecnica previa.',
  },
  {
    title: 'Atencion personalizada',
    description: 'Los trabajos especiales pasan por propuesta o seguimiento directo.',
  },
  {
    title: 'Precios sin IVA',
    description: 'Las referencias del catalogo 2026 se muestran sin impuestos.',
  },
  {
    title: 'Anticipo y saldo',
    description: 'Se trabaja con anticipo y saldo restante contra entrega.',
  },
] as const

type TrustGridProps = {
  items?: ReadonlyArray<{
    title: string
    description: string
  }>
}

function TrustGrid({ items = defaultTrustItems }: TrustGridProps) {
  return (
    <div className="trust-grid" data-animate="reveal">
      {items.map((item) => (
        <article className="content-card trust-card hover-lift" data-animate="panel" key={item.title}>
          <p className="section-label">Confianza</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  )
}

export default TrustGrid
