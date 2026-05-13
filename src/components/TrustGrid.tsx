const defaultTrustItems = [
  {
    title: 'Pago seguro tras confirmar el pedido',
    description: 'El cobro se confirma una vez revisado el archivo y validado el trabajo.',
  },
  {
    title: 'Comprobacion tecnica del archivo',
    description: 'Comprobamos el arte final antes de lanzar la fabricacion cuando el trabajo lo necesita.',
  },
  {
    title: 'Fabricacion confirmada tras revision tecnica',
    description: 'El trabajo avanza con confirmacion tecnica para evitar errores en el resultado final.',
  },
  {
    title: 'Atencion personalizada',
    description: 'Cada proyecto especial cuenta con seguimiento directo y propuesta a medida.',
  },
  {
    title: 'Precios sin IVA',
    description: 'Las referencias del catalogo 2026 se muestran sin impuestos.',
  },
  {
    title: 'Anticipo y saldo',
    description: 'Trabajamos con un anticipo inicial y el resto a la entrega del pedido.',
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
