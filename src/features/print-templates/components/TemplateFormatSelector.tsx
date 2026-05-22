import type { ProductTemplateAsset } from '../../../domain/storage'
import type { TemplateDownloadFormat } from '../types/printTemplates'
import { templateFormatLabels } from '../utils/templateFormatLabels'

type TemplateFormatSelectorProps = {
  selectedFormat: TemplateDownloadFormat
  template: ProductTemplateAsset
  onChange: (format: TemplateDownloadFormat) => void
}

export function TemplateFormatSelector({ selectedFormat, template, onChange }: TemplateFormatSelectorProps) {
  return (
    <label className="field-group">
      <span className="field-label">Formato</span>
      <select
        className="form-input"
        onChange={(event) => onChange(event.target.value as TemplateDownloadFormat)}
        value={selectedFormat}
      >
        {template.formatsAvailable.map((format) => (
          <option key={format} value={format}>
            {templateFormatLabels[format]}
          </option>
        ))}
      </select>
    </label>
  )
}
