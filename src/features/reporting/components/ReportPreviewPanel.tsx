import { useState } from 'react'
import type { ReportDocument, ReportFormat } from '../types/reporting'
import { ReportExportButton } from './ReportExportButton'
import { ReportFormatSelector } from './ReportFormatSelector'

type ReportPreviewPanelProps = {
  report: ReportDocument
  title?: string
}

export function ReportPreviewPanel({ report, title = 'REPORT_EXPORTS' }: ReportPreviewPanelProps) {
  const [format, setFormat] = useState<ReportFormat>(report.availableFormats[0] ?? 'json')

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
        <button className="action-button action-button-muted" disabled type="button">
          PDF proximamente
        </button>
      </div>

      <div className="summary-stack">
        {report.sections.map((section) => (
          <article className="content-card" key={section.id}>
            <p className="section-label">{section.title}</p>
            {section.description ? <p>{section.description}</p> : null}
            <div className="summary-list compact-summary">
              {section.rows.map((row) => (
                <div className="summary-row" key={`${section.id}-${row.label}`}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </article>
  )
}
