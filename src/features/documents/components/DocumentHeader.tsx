import type { DocumentBranding, DocumentMetadata } from '../types/documents'

type DocumentHeaderProps = {
  branding: DocumentBranding
  metadata: DocumentMetadata
}

export function DocumentHeader({ branding, metadata }: DocumentHeaderProps) {
  return (
    <header className="document-header">
      <div>
        <p className="section-label">{branding.accentLabel}</p>
        <h1>{metadata.title}</h1>
        <p>{metadata.description}</p>
      </div>
      <div className="document-meta">
        <strong>{branding.brandName}</strong>
        <span>{branding.strapline}</span>
        <span>{new Date(metadata.generatedAt).toLocaleString('es-ES')}</span>
        <span>{metadata.versionLabel}</span>
      </div>
    </header>
  )
}
