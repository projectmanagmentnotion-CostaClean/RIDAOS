import { resolveLegalNoticeItems } from '../catalog/notices/legalNotices'
import type { LegalNoticeKey } from '../types/product'

type CommercialNoticeGroupProps = {
  title?: string
  noticeKeys?: readonly LegalNoticeKey[]
  items?: readonly string[]
  className?: string
}

function CommercialNoticeGroup({
  title = 'Condiciones comerciales',
  noticeKeys,
  items,
  className = '',
}: CommercialNoticeGroupProps) {
  const resolvedItems = items ?? resolveLegalNoticeItems(noticeKeys)

  return (
    <article className={`content-card commercial-notice commercial-notice-group ${className}`.trim()}>
      <p className="section-label">Comercial</p>
      <h3>{title}</h3>
      <ul className="placeholder-list">
        {resolvedItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

export default CommercialNoticeGroup
