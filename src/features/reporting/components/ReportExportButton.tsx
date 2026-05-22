import type { ReportDocument, ReportFormat } from '../types/reporting'
import { exportReportAsCsv, exportReportAsJson, openReportPrintView } from '../exporters/reportExporters'

type ReportExportButtonProps = {
  report: ReportDocument
  format: ReportFormat
}

export function ReportExportButton({ report, format }: ReportExportButtonProps) {
  const handleClick = () => {
    if (format === 'json') {
      exportReportAsJson(report)
      return
    }

    if (format === 'csv') {
      exportReportAsCsv(report)
      return
    }

    openReportPrintView(report)
  }

  return (
    <button className="action-button" onClick={handleClick} type="button">
      {format === 'print_view' ? 'Abrir vista imprimible' : `Exportar ${format.toUpperCase()}`}
    </button>
  )
}
