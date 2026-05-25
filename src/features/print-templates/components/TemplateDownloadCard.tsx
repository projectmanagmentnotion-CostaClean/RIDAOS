import { useMemo, useState } from 'react'
import type { ProductTemplateAsset } from '../../../domain/storage'
import { templateStatusCopy } from '../mock/templateStatusCopy'
import type { TemplateDownloadFormat } from '../types/printTemplates'
import { templateFormatLabels } from '../utils/templateFormatLabels'
import { TemplateFormatSelector } from './TemplateFormatSelector'

type TemplateDownloadCardProps = {
  template: ProductTemplateAsset
}

export function TemplateDownloadCard({ template }: TemplateDownloadCardProps) {
  const [selectedFormat, setSelectedFormat] = useState<TemplateDownloadFormat>(template.recommendedFormat)

  const selectedUrl = useMemo(() => template.downloadUrls[selectedFormat], [selectedFormat, template.downloadUrls])

  return (
    <article className="content-card template-download-card" data-cursor="interest">
      <div className="order-card-head">
        <div>
          <p className="section-label">{template.productTypeLabel}</p>
          <h3>{template.label}</h3>
          <p>{template.description}</p>
        </div>
        <span className={`status-badge status-${template.status === 'ready' ? 'success' : 'warning'}`}>
          {templateStatusCopy[template.status]}
        </span>
      </div>

      <div className="summary-list compact-summary">
        <div className="summary-row">
          <span>Version</span>
          <strong>{template.version}</strong>
        </div>
        <div className="summary-row">
          <span>Actualizada</span>
          <strong>{new Date(template.updatedAt).toLocaleDateString('es-ES')}</strong>
        </div>
        <div className="summary-row">
          <span>Formato recomendado</span>
          <strong>{templateFormatLabels[template.recommendedFormat]}</strong>
        </div>
        <div className="summary-row">
          <span>Tamano base</span>
          <strong>{template.recommendedSize}</strong>
        </div>
      </div>

      <TemplateFormatSelector onChange={setSelectedFormat} selectedFormat={selectedFormat} template={template} />

      <div className="catalog-card-actions">
        {selectedUrl && template.status === 'ready' ? (
          <a className="action-button action-link-button" download href={selectedUrl}>
            Descargar {templateFormatLabels[selectedFormat]}
          </a>
        ) : (
          <button className="action-button action-button-muted" disabled type="button">
            Solicitar plantilla
          </button>
        )}
        <span className="inline-notice">
          {selectedUrl ? 'Incluye corte, sangrado y zona segura para preparar el archivo con mas seguridad.' : 'Si la necesitas fuera de la web, te la preparamos a partir de esta configuracion.'}
        </span>
      </div>
    </article>
  )
}
