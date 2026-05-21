import { artworkProductRules } from '../product-rules/artworkProductRules'
import type { ArtworkPreviewMetadata, ArtworkProductRuleKey } from '../types/artworkUpload'

type PrintPreviewCanvasProps = {
  metadata: ArtworkPreviewMetadata | null
  ruleKey: ArtworkProductRuleKey
}

export function PrintPreviewCanvas({ metadata, ruleKey }: PrintPreviewCanvasProps) {
  const rule = artworkProductRules[ruleKey]
  const aspectRatio =
    metadata?.widthPx && metadata?.heightPx ? `${metadata.widthPx} / ${metadata.heightPx}` : String(rule.guide.aspectRatio)

  return (
    <div className={`print-preview-canvas print-preview-canvas--${rule.guide.previewMode}`} style={{ aspectRatio }}>
      {metadata?.canPreview && metadata.objectUrl ? (
        <img
          alt={`Preview local de ${metadata.fileName}`}
          className="print-preview-canvas__artwork"
          src={metadata.objectUrl}
        />
      ) : (
        <div className="print-preview-canvas__placeholder">
          <span>{rule.label}</span>
          <strong>{rule.recommendedPhysicalSizeLabel}</strong>
          <p>{rule.helperCopy}</p>
        </div>
      )}

      <div className="print-preview-canvas__bleed" aria-hidden="true" />
      {rule.guide.showCutline ? <div className="print-preview-canvas__cutline" aria-hidden="true" /> : null}
      {rule.guide.showSafeZone ? <div className="print-preview-canvas__safezone" aria-hidden="true" /> : null}

      <div className="print-preview-canvas__legend" aria-hidden="true">
        <span>Sangrado {rule.guide.bleedMm} mm</span>
        <span>Zona segura {rule.guide.safeMarginMm} mm</span>
        <span>Orientación {metadata?.orientation ?? rule.guide.preferredOrientation}</span>
      </div>
    </div>
  )
}
