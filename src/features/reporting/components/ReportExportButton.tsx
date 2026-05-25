import { useState } from 'react'
import { useLiveToast } from '../../live-feedback'
import type { ReportDocument, ReportFormat } from '../types/reporting'
import { exportReportAsCsv, exportReportAsJson, exportReportAsPdf, openReportPrintView } from '../exporters/reportExporters'

type ReportExportButtonProps = {
  report: ReportDocument
  format: ReportFormat
}

export function ReportExportButton({ report, format }: ReportExportButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const { info, success } = useLiveToast()

  const handleClick = async () => {
    setFeedback(null)

    if (format === 'json') {
      exportReportAsJson(report)
      success('Exportacion lista', `${report.label} se ha descargado en JSON.`, 2200)
      return
    }

    if (format === 'csv') {
      exportReportAsCsv(report)
      success('Exportacion lista', `${report.label} se ha descargado en CSV.`, 2200)
      return
    }

    if (format === 'pdf') {
      const result = await exportReportAsPdf(report)
      setFeedback(result.message)
      info('Flujo PDF preparado', result.message, 2600)
      return
    }

    openReportPrintView(report)
    info('Vista imprimible abierta', 'El documento ya puede revisarse o imprimirse desde el navegador.', 2200)
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
