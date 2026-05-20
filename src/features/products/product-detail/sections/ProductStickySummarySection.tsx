import type { ReactNode } from 'react'
import CatalogResultPanel from '../../../../components/CatalogResultPanel'
import CommercialNoticeGroup from '../../../../components/CommercialNoticeGroup'
import type { CatalogPricingResult } from '../../../../catalog/adapters/catalogPricingAdapter'
import type { CatalogEntry } from '../../../../types/product'
import { resolveLegalNoticeItems } from '../../../../lib/products'

type ProductStickySummarySectionProps = {
  entry: CatalogEntry
  estimate: CatalogPricingResult | null
  message: string
  successLinks?: ReactNode
  summaryTitle?: string
}

export function ProductStickySummarySection({
  entry,
  estimate,
  message,
  successLinks,
  summaryTitle = 'Resumen',
}: ProductStickySummarySectionProps) {
  return (
    <div className="summary-stack">
      <div className="sticky-summary-panel sticky-summary-panel--product" data-product-reveal>
        {estimate ? <CatalogResultPanel result={estimate} title={summaryTitle} /> : null}
        <CommercialNoticeGroup items={resolveLegalNoticeItems(entry.legalNotes)} />
        {entry.notes?.length ? (
          <article className="content-card">
            <p className="section-label">Notas del producto</p>
            <ul className="hint-list">
              {entry.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        ) : null}
        {message ? <p className="inline-notice">{message}</p> : null}
        {message && successLinks ? <div className="catalog-cta-row">{successLinks}</div> : null}
      </div>
    </div>
  )
}
