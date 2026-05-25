import type { ArtworkProductRuleKey } from '../../../domain/storage'
import { useProductTemplates } from '../hooks/useProductTemplates'
import { TemplateDownloadCard } from './TemplateDownloadCard'
import { TemplateGuidePanel } from './TemplateGuidePanel'

type ProductTemplateDownloadsProps = {
  ruleKey: ArtworkProductRuleKey
  title?: string
  description?: string
  compact?: boolean
}

export function ProductTemplateDownloads({
  ruleKey,
  title = 'Descarga una plantilla recomendada',
  description = 'Usa una plantilla base para respetar corte, sangrado y zona segura antes de subir el archivo.',
  compact = false,
}: ProductTemplateDownloadsProps) {
  const { templates, isLoading } = useProductTemplates(ruleKey)
  const primaryTemplate = templates[0]

  return (
    <section className={`template-downloads${compact ? ' template-downloads-compact' : ''}`} data-cursor="interest">
      <div className="premium-panel-header">
        <div>
          <p className="section-label">Plantillas</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      {isLoading ? <p className="file-meta">Cargando plantillas recomendadas...</p> : null}
      {!isLoading && templates.length === 0 ? (
        <article className="content-card">
          <p className="inline-notice">Te guiamos desde el configurador con corte, sangrado y zona segura.</p>
        </article>
      ) : null}

      {primaryTemplate ? (
        <div className={`template-downloads__grid${compact ? ' template-downloads__grid-compact' : ''}`}>
          <TemplateDownloadCard template={primaryTemplate} />
          <TemplateGuidePanel template={primaryTemplate} />
        </div>
      ) : null}
    </section>
  )
}
