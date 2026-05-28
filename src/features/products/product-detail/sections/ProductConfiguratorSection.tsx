import { useRef, type ReactNode } from 'react'
import ConfiguratorFieldRenderer from '../../../../components/ConfiguratorFieldRenderer'
import ConfiguratorSupportBlock from '../../../../components/ConfiguratorSupportBlock'
import SectionHeader from '../../../../components/SectionHeader'
import type { ConfigState } from '../../../../lib/configuratorState'
import type { CatalogEntry, ConfiguratorField } from '../../../../types/product'
import { ArtworkUploadFlow } from '../../../artwork-upload'
import type { ArtworkPreviewSummary, ArtworkProductRuleKey, ArtworkUploadFlowState } from '../../../artwork-upload'
import { useLiveToast } from '../../../live-feedback'
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
    acceptance: ArtworkUploadFlowState['acceptance']
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
  const { success } = useLiveToast()
  const confirmedToastShownRef = useRef(false)

  const handleFieldChange = (key: string, value: string) => {
    onConfigChange(key, value)
  }

  return (
    <article
      className="content-card product-config-card product-experience-config"
      data-cursor-zone="conversion"
      data-product-reveal
      id="product-configurator"
    >
      <SectionHeader eyebrow="Configurador" title={`Configura ${entry.name.toLowerCase()} con una lectura clara y directa.`} />
      <p className="product-config-card__intro">
        Elige lo importante, revisa el precio estimado y sube tu archivo cuando la pieza ya este lista para pasar a
        revision.
      </p>
      <div className="storefront-inline-tags product-config-card__tags">
        <span>Precio estimado en vivo</span>
        <span>Revision tecnica</span>
        <span>Produccion profesional</span>
      </div>
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
            description="Sube el archivo, revisa la guia de impresion y confirma la pieza antes de continuar."
            file={selectedFile}
            onFileChange={(file) => onFileChange?.(artworkField.key, file)}
            onStateChange={(state) => {
              onArtworkStateChange?.(state)

              if (state.confirmed && !confirmedToastShownRef.current) {
                confirmedToastShownRef.current = true
                success('Archivo confirmado', 'La pieza queda lista para continuar con tu pedido.', 2200)
              } else if (!state.confirmed) {
                confirmedToastShownRef.current = false
              }
            }}
            ruleKey={artworkRuleKey}
            summaryItems={fields
              .filter((field) => field.type !== 'file')
              .map((field) => {
                const selectedValue = config[field.key]

                if (!selectedValue) {
                  return null
                }

                const optionLabel =
                  field.type === 'select' || field.type === 'variant' || field.type === 'size'
                    ? field.options.find((option) => option.value === selectedValue)?.label ?? selectedValue
                    : selectedValue

                return {
                  label: field.label,
                  value: optionLabel,
                }
              })
              .filter(Boolean) as Array<{ label: string; value: string }>}
            title="Sube tu diseno y revisa la vista previa"
            validationContext={{ configuration: config, productName: entry.name }}
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
