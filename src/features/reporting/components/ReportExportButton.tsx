import { useState } from 'react'
import type { ReportDocument, ReportFormat } from '../types/reporting'
import { exportReportAsCsv, exportReportAsJson, exportReportAsPdf, openReportPrintView } from '../exporters/reportExporters'

type ReportExportButtonProps = {
  report: ReportDocument
  format: ReportFormat
}

export function ReportExportButton({ report, format }: ReportExportButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleClick = async () => {
    setFeedback(null)

    if (format === 'json') {
      exportReportAsJson(report)
      return
    }

    if (format === 'csv') {
      exportReportAsCsv(report)
      return
    }

    if (format === 'pdf') {
      const result = await exportReportAsPdf(report)
      setFeedback(result.message)
      return
    }

    openReportPrintView(report)
  }

  return (
    <div className="report-export-action">
      <button className="action-button" onClick={handleClick} type="button">
        {format === 'print_view' ? 'Abrir vista imprimible' : format === 'pdf' ? 'Abrir flujo PDF' : `Exportar ${format.toUpperCase()}`}
      </button>
      {feedback ? <p className="report-export-feedback">{feedback}</p> : null}
    </div>
  )
}
