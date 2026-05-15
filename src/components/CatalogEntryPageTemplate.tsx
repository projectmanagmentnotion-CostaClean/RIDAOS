import type { ReactNode } from 'react'
import type { CatalogEntry } from '../types/product'
import type { ConfigState } from '../lib/configuratorState'
import ProductConfiguratorShell from './ProductConfiguratorShell'
import ConfiguratorFieldRenderer from './ConfiguratorFieldRenderer'
import SectionHeader from './SectionHeader'

type CatalogEntryPageTemplateProps = {
  entry: CatalogEntry
  eyebrow: string
  title: string
  description: string
  config: ConfigState
  fieldErrors?: Partial<Record<string, string>>
  onConfigChange: (key: string, value: string) => void
  onFileChange?: (key: string, file: File | null) => void
  supportArea?: ReactNode
  resultArea: ReactNode
  ctaArea: ReactNode
  children?: ReactNode
  className?: string
}

function CatalogEntryPageTemplate({
  entry,
  eyebrow,
  title,
  description,
  config,
  fieldErrors = {},
  onConfigChange,
  onFileChange,
  supportArea,
  resultArea,
  ctaArea,
  children,
  className = '',
}: CatalogEntryPageTemplateProps) {
  return (
    <ProductConfiguratorShell
      className={className}
      description={description}
      eyebrow={eyebrow}
      title={title}
    >
      <div className="split-grid immersive-grid product-layout">
        <article className="content-card product-config-card" data-cursor-zone="conversion">
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

          {supportArea ? <div className="product-config-support section-fluid">{supportArea}</div> : null}
        </article>

        <div className="summary-stack">
          {resultArea}
          {children}
        </div>
      </div>
    </ProductConfiguratorShell>
  )
}

export default CatalogEntryPageTemplate
