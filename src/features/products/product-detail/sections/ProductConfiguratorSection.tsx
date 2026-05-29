import { useRef, type ReactNode } from 'react'
import ConfiguratorSupportBlock from '../../../../components/ConfiguratorSupportBlock'
import SectionHeader from '../../../../components/SectionHeader'
import type { ConfigState } from '../../../../lib/configuratorState'
import type { CatalogEntry, ConfiguratorField } from '../../../../types/product'
import { ArtworkUploadFlow } from '../../../artwork-upload'
import type { ArtworkPreviewSummary, ArtworkProductRuleKey, ArtworkUploadFlowState } from '../../../artwork-upload'
import { useLiveToast } from '../../../live-feedback'
import { ProductConfiguratorVisualFields } from '../components/ProductConfiguratorVisualFields'
import type { ProductSupportSection } from '../types/productExperience.types'

type ProductConfiguratorSectionProps = {
  entry: CatalogEntry
  fields: ConfiguratorField[]
  hideProductField?: boolean
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
  hideProductField = false,
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
  const visibleFields = fields.filter((field) => {
    if (field.type === 'file') {
      return false
    }

    if (hideProductField && field.key === 'product') {
      return false
    }

    return true
  })

  const handleFieldChange = (key: string, value: string) => {
    onConfigChange(key, value)
  }

  const hasDesignerAssistanceOption = visibleFields.some(
    (field) =>
      (field.key === 'fileReview' || field.key === 'designService') &&
      (field.type === 'select' || field.type === 'variant' || field.type === 'size') &&
      field.options.some((option) => option.value === 'assisted' || option.value === 'studio-support'),
  )
  const specialFinishValue = config.specialFinish ?? 'none'
  const needsSpecialFinishGuidance = entry.id === 'tarjetas-estandar' && specialFinishValue !== 'none'
  const needsFlyerDuplexGuidance = (entry.id === 'flyer-a6' || entry.id === 'flyer-a5') && config.printSides === 'double'
  const needsStickerCutlineGuidance =
    (entry.id === 'pegatina-sin-laminar' || entry.id === 'pegatina-laminada') &&
    ['custom', 'full-cut', 'kiss-cut'].includes(config.shape ?? '')
  const contextualGuidance = [
    needsSpecialFinishGuidance
      ? {
          title: specialFinishValue === 'varnish-3d' ? 'Reserva para barniz 3D' : 'Reserva para acabado metalico',
          body:
            'Este acabado necesita una capa o pagina separada indicando exactamente donde aplicar el efecto, sin degradados ni transparencias.',
        }
      : null,
    needsFlyerDuplexGuidance
      ? {
          title: 'Archivo recomendado para doble cara',
          body:
            'Para una pieza a dos caras recomendamos un PDF con anverso y reverso en paginas separadas o claramente identificadas.',
        }
      : null,
    needsStickerCutlineGuidance
      ? {
          title: 'Linea de corte recomendada',
          body:
            'Si el corte es personalizado, completo o kiss cut, prepara una linea de corte clara o pide ayuda de diseno Ridaos.',
        }
      : null,
  ].filter(Boolean) as Array<{ title: string; body: string }>

  const handleDesignerSupportSelection = () => {
    const assistanceField = visibleFields.find(
      (field) =>
        (field.key === 'fileReview' || field.key === 'designService') &&
        (field.type === 'select' || field.type === 'variant' || field.type === 'size'),
    )

    if (!assistanceField || !('options' in assistanceField)) {
      return
    }

    if (assistanceField.options.some((option) => option.value === 'assisted')) {
      onConfigChange(assistanceField.key, 'assisted')
      return
    }

    if (assistanceField.options.some((option) => option.value === 'studio-support')) {
      onConfigChange(assistanceField.key, 'studio-support')
    }
  }

  return (
    <article
      className="content-card product-config-card product-experience-config"
      data-cursor-zone="conversion"
      data-product-reveal
      id="product-configurator"
    >
      <SectionHeader eyebrow="Configura tu producto" title={`Configura ${entry.name.toLowerCase()} con una lectura clara y profesional.`} />
      <p className="product-config-card__intro">
        Elige formato, materiales y archivo con una estructura por bloques pensada para imprenta online, sin perder la lectura comercial.
      </p>
      <div className="storefront-inline-tags product-config-card__tags">
        <span>Resumen de presupuesto</span>
        <span>Prepress integrado</span>
        <span>Ayuda Ridaos visible</span>
      </div>
      <div className="configurator-form">
        <ProductConfiguratorVisualFields
          config={config}
          entryId={entry.id}
          fieldErrors={fieldErrors}
          fields={visibleFields}
          onChange={handleFieldChange}
          onFileChange={onFileChange}
        />

        {contextualGuidance.length ? (
          <article className="content-card product-config-guidance">
            <p className="section-label">Indicaciones de prepress</p>
            <div className="product-config-guidance__stack">
              {contextualGuidance.map((item) => (
                <div className="product-config-guidance__item" key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
            {hasDesignerAssistanceOption ? (
              <div className="catalog-cta-row">
                <button className="action-button action-button-muted" onClick={handleDesignerSupportSelection} type="button">
                  Solicitar ayuda de diseno Ridaos
                </button>
              </div>
            ) : null}
          </article>
        ) : null}

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
            summaryItems={visibleFields
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
