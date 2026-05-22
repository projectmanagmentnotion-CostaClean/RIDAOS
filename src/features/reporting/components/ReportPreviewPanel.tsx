import { useState } from 'react'
import { OperationalDocumentLayout, mapReportToDocument } from '../../documents'
import type { ReportDocument, ReportFormat } from '../types/reporting'
import { ReportExportButton } from './ReportExportButton'
import { ReportFormatSelector } from './ReportFormatSelector'

type ReportPreviewPanelProps = {
  report: ReportDocument
  title?: string
}

export function ReportPreviewPanel({ report, title = 'REPORT_EXPORTS' }: ReportPreviewPanelProps) {
  const [format, setFormat] = useState<ReportFormat>(report.availableFormats[0] ?? 'json')
  const documentDefinition = mapReportToDocument(report)

  return (
    <article className="content-card report-preview-panel" data-cursor="interactive">
      <div className="premium-panel-header">
        <div>
          <p className="section-label">{title}</p>
          <h3>{report.label}</h3>
          <p>{report.description}</p>
        </div>
        <span className={`status-badge status-${report.status === 'ready' ? 'success' : report.status === 'draft' ? 'warning' : 'info'}`}>
          {report.status}
        </span>
      </div>

      <ReportFormatSelector formats={report.availableFormats} onChange={setFormat} value={format} />

      <div className="catalog-card-actions">
        <ReportExportButton format={format} report={report} />
      </div>

      <OperationalDocumentLayout document={documentDefinition} mode="screen_preview" />
    </article>
  )
}
