import ConfiguratorFieldRenderer from '../../../../components/ConfiguratorFieldRenderer'
import ConfiguratorSupportBlock from '../../../../components/ConfiguratorSupportBlock'
import SectionHeader from '../../../../components/SectionHeader'
import { ArtworkUploadFlow } from '../../../artwork-upload'
import type { ConfigState } from '../../../../lib/configuratorState'
import type { CatalogEntry } from '../../../../types/product'
import type { ArtworkPreviewSummary, ArtworkProductRuleKey, ArtworkUploadFlowState } from '../../../artwork-upload'
import type { ProductSupportSection } from '../types/productExperience.types'
import type { ReactNode } from 'react'

type ProductConfiguratorSectionProps = {
  entry: CatalogEntry
  config: ConfigState
  fieldErrors: Partial<Record<string, string>>
  supportSections: ProductSupportSection[]
  ctaArea: ReactNode
  artworkRuleKey: ArtworkProductRuleKey
  selectedFile: File | null
  onConfigChange: (key: string, value: string) => void
  onFileChange?: (key: string, file: File | null) => void
  onArtworkStateChange?: (state: {
    metadata: ArtworkUploadFlowState['metadata']
    summary: ArtworkPreviewSummary | null
    confirmed: boolean
  }) => void
}

export function ProductConfiguratorSection({
  entry,
  config,
  fieldErrors,
  supportSections,
  ctaArea,
  artworkRuleKey,
  selectedFile,
  onConfigChange,
  onFileChange,
  onArtworkStateChange,
}: ProductConfiguratorSectionProps) {
  const artworkField = entry.configuratorFields.find((field) => field.type === 'file')

  return (
    <article className="content-card product-config-card product-experience-config" data-cursor-zone="conversion" data-product-reveal>
      <SectionHeader eyebrow="Configurador" title={`Configura ${entry.name.toLowerCase()}.`} />
      <div className="configurator-form">
        {entry.configuratorFields.filter((field) => field.type !== 'file').map((field) => (
          <ConfiguratorFieldRenderer
            error={fieldErrors[field.key]}
            field={field}
            key={`${entry.id}-${field.key}`}
            onChange={onConfigChange}
            onFileChange={onFileChange}
            value={config[field.key] ?? ''}
          />
        ))}

        {artworkField ? (
          <ArtworkUploadFlow
            acceptedFormats={artworkField.accept}
            description="Sube el archivo, revisa guías de imprenta y confirma la pieza antes de seguir."
            file={selectedFile}
            onFileChange={(file) => onFileChange?.(artworkField.key, file)}
            onStateChange={onArtworkStateChange}
            ruleKey={artworkRuleKey}
            title="Artwork upload y print preview"
          />
        ) : null}

        <div className="form-actions">{ctaArea}</div>
      </div>

      <div className="product-config-support section-fluid">
        <ConfiguratorSupportBlock sections={supportSections} />
      </div>
    </article>
  )
}
