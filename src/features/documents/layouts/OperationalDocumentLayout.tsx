import type { DocumentDefinition } from '../types/documents'
import { DocumentFooter } from '../components/DocumentFooter'
import { DocumentHeader } from '../components/DocumentHeader'
import { DocumentSectionBlock } from '../components/DocumentSectionBlock'

type OperationalDocumentLayoutProps = {
  document: DocumentDefinition
  mode: 'screen_preview' | 'print_view' | 'future_pdf'
}

export function OperationalDocumentLayout({ document, mode }: OperationalDocumentLayoutProps) {
  return (
    <article className={`operational-document operational-document--${mode}`}>
      <DocumentHeader branding={document.branding} metadata={document.metadata} />
      <div className="operational-document__body">
        {document.sections.map((section) => (
          <DocumentSectionBlock key={section.id} section={section} />
        ))}
      </div>
      <DocumentFooter metadata={document.metadata} />
    </article>
  )
}
