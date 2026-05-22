import type { DocumentMetadata } from '../types/documents'

type DocumentFooterProps = {
  metadata: DocumentMetadata
}

export function DocumentFooter({ metadata }: DocumentFooterProps) {
  return (
    <footer className="document-footer">
      <span>{metadata.id}</span>
      <span>{metadata.reportType}</span>
      <span>Mock/local only</span>
    </footer>
  )
}
