import type { CSSProperties, ReactNode } from 'react'
import CatalogResultPanel from '../../../../components/CatalogResultPanel'
import CommercialNoticeGroup from '../../../../components/CommercialNoticeGroup'
import type { CatalogPricingResult } from '../../../../catalog/adapters/catalogPricingAdapter'
import type { CatalogEntry } from '../../../../types/product'
import { resolveLegalNoticeItems } from '../../../../lib/products'

type ProductStickySummarySectionProps = {
  entry: CatalogEntry
  estimate: CatalogPricingResult | null
  message: string
  summaryItems?: Array<{ label: string; value: string }>
  summaryAction?: ReactNode
  summaryAccent?: string
  successLinks?: ReactNode
  summaryTitle?: string
}

export function ProductStickySummarySection({
  entry,
  estimate,
  message,
  summaryItems = [],
  summaryAction,
  summaryAccent,
  successLinks,
  summaryTitle = 'Resumen',
}: ProductStickySummarySectionProps) {
  return (
    <div className="summary-stack">
      <div
        className="sticky-summary-panel sticky-summary-panel--product"
        data-product-reveal
        style={{ '--product-summary-accent': summaryAccent ?? 'rgba(217, 255, 0, 0.16)' } as CSSProperties}
      >
        <article className="content-card product-summary-card">
          <p className="section-label">Resumen del producto</p>
          <h3>{entry.name}</h3>
          <p className="product-summary-card__copy">
            Configuracion elegida, revision tecnica y siguiente paso en una sola vista.
          </p>
          {summaryItems.length ? (
            <div className="product-summary-card__meta">
              {summaryItems.map((item) => (
                <div className="product-summary-card__row" key={`${item.label}-${item.value}`}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
          {summaryAction ? <div className="catalog-cta-row product-summary-card__actions">{summaryAction}</div> : null}
        </article>
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
