import { commercialConditions } from '../lib/products'

type CommercialNoticeProps = {
  title?: string
  items?: readonly string[]
  className?: string
}

function CommercialNotice({
  title = 'Condiciones comerciales',
  items = commercialConditions,
  className = '',
}: CommercialNoticeProps) {
  return (
    <article className={`content-card commercial-notice ${className}`.trim()}>
      <p className="section-label">Comercial</p>
      <h3>{title}</h3>
      <ul className="placeholder-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

export default CommercialNotice
