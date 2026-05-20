import ConfiguratorFieldRenderer from '../../../../components/ConfiguratorFieldRenderer'
import ConfiguratorSupportBlock from '../../../../components/ConfiguratorSupportBlock'
import SectionHeader from '../../../../components/SectionHeader'
import type { ConfigState } from '../../../../lib/configuratorState'
import type { CatalogEntry } from '../../../../types/product'
import type { ProductSupportSection } from '../types/productExperience.types'
import type { ReactNode } from 'react'

type ProductConfiguratorSectionProps = {
  entry: CatalogEntry
  config: ConfigState
  fieldErrors: Partial<Record<string, string>>
  supportSections: ProductSupportSection[]
  ctaArea: ReactNode
  onConfigChange: (key: string, value: string) => void
  onFileChange?: (key: string, file: File | null) => void
}

export function ProductConfiguratorSection({
  entry,
  config,
  fieldErrors,
  supportSections,
  ctaArea,
  onConfigChange,
  onFileChange,
}: ProductConfiguratorSectionProps) {
  return (
    <article className="content-card product-config-card product-experience-config" data-cursor-zone="conversion" data-product-reveal>
      <SectionHeader eyebrow="Configurador" title={`Configura ${entry.name.toLowerCase()}.`} />
      <div className="configurator-form">
        {entry.configuratorFields.map((field) => (
          <ConfiguratorFieldRenderer
            error={fieldErrors[field.key]}
            field={field}
            key={`${entry.id}-${field.key}`}
            onChange={onConfigChange}
            onFileChange={onFileChange}
            value={config[field.key] ?? ''}
          />
        ))}

        <div className="form-actions">{ctaArea}</div>
      </div>

      <div className="product-config-support section-fluid">
        <ConfiguratorSupportBlock sections={supportSections} />
      </div>
    </article>
  )
}
