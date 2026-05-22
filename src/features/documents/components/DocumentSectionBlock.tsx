import type { DocumentBlock, DocumentSection } from '../types/documents'
import { DocumentChecklistBlock } from './DocumentChecklistBlock'
import { DocumentMetricGrid } from './DocumentMetricGrid'
import { DocumentSignatureBlock } from './DocumentSignatureBlock'
import { DocumentTimelineBlock } from './DocumentTimelineBlock'

type DocumentSectionBlockProps = {
  section: DocumentSection
}

function renderBlock(block: DocumentBlock) {
  if (block.type === 'metric_grid') {
    return <DocumentMetricGrid block={block} />
  }

  if (block.type === 'timeline') {
    return <DocumentTimelineBlock block={block} />
  }

  if (block.type === 'checklist') {
    return <DocumentChecklistBlock block={block} />
  }

  if (block.type === 'signature') {
    return <DocumentSignatureBlock block={block} />
  }

  return (
    <section className="document-block" key={block.id}>
      <h3>{block.title}</h3>
      {block.description ? <p>{block.description}</p> : null}
      <table className="document-table">
        <tbody>
          {block.rows.map((row) => (
            <tr key={`${block.id}-${row.label}`}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export function DocumentSectionBlock({ section }: DocumentSectionBlockProps) {
  return (
    <section className="document-section">
      <div className="document-section-head">
        <h2>{section.title}</h2>
        {section.description ? <p>{section.description}</p> : null}
      </div>
      <div className="document-section-body">
        {section.blocks.map((block) => (
          <div key={block.id}>{renderBlock(block)}</div>
        ))}
      </div>
    </section>
  )
}
