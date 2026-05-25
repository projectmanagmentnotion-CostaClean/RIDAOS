import type { ReactNode } from 'react'
import ConfiguratorFieldRenderer from '../../../../components/ConfiguratorFieldRenderer'
import ConfiguratorSupportBlock from '../../../../components/ConfiguratorSupportBlock'
import SectionHeader from '../../../../components/SectionHeader'
import type { ConfigState } from '../../../../lib/configuratorState'
import type { CatalogEntry, ConfiguratorField } from '../../../../types/product'
import { ArtworkUploadFlow } from '../../../artwork-upload'
import type { ArtworkPreviewSummary, ArtworkProductRuleKey, ArtworkUploadFlowState } from '../../../artwork-upload'
import { useLiveToast } from '../../../live-feedback'
import { getConfigFeedbackLabel } from '../../../live-feedback/utils/feedbackCopy'
import type { ProductSupportSection } from '../types/productExperience.types'

type ProductConfiguratorSectionProps = {
  entry: CatalogEntry
  fields: ConfiguratorField[]
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
  fields,
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
  const artworkField = fields.find((field) => field.type === 'file')
  const { info, success } = useLiveToast()

  const handleFieldChange = (key: string, value: string) => {
    onConfigChange(key, value)

    if (!value || key === 'notes') {
      return
    }

    info(getConfigFeedbackLabel(key), 'Tu resumen y el precio estimado se han actualizado.', 1800)
  }

  return (
    <article
      className="content-card product-config-card product-experience-config"
      data-cursor-zone="conversion"
      data-product-reveal
      id="product-configurator"
    >
      <SectionHeader eyebrow="Configurador" title={`Configura ${entry.name.toLowerCase()}.`} />
      <div className="configurator-form">
        {fields.filter((field) => field.type !== 'file').map((field) => (
          <ConfiguratorFieldRenderer
            error={fieldErrors[field.key]}
            field={field}
            key={`${entry.id}-${field.key}`}
            onChange={handleFieldChange}
            onFileChange={onFileChange}
            value={config[field.key] ?? ''}
          />
        ))}

        {artworkField ? (
          <ArtworkUploadFlow
            acceptedFormats={artworkField.accept}
            description="Sube el archivo, revisa guias de imprenta y confirma la pieza antes de seguir."
            file={selectedFile}
            onFileChange={(file) => onFileChange?.(artworkField.key, file)}
            onStateChange={(state) => {
              onArtworkStateChange?.(state)

              if (state.confirmed) {
                success('Archivo confirmado', 'La pieza queda lista para continuar con tu pedido.', 2200)
              }
            }}
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
