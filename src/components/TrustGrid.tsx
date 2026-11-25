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
    title: 'Fabricacion confirmada tras comprobacion tecnica',
    description: 'El trabajo avanza con confirmacion tecnica para evitar errores en el resultado final.',
  },
  {
    title: 'Atencion personalizada',
    description: 'Cada proyecto especial cuenta con seguimiento directo y propuesta a medida.',
  },
  {
    title: 'Precio DTI transparente',
    description: 'DTI Innuro cuesta 15 €/m y el envío peninsular 5 €; ambos precios incluyen IVA.',
  },
  {
    title: 'Adaptación aprobada antes del pago',
    description: 'La adaptación profesional se presupuesta a 35 €/hora + IVA y requiere aprobación antes de cobrar.',
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
