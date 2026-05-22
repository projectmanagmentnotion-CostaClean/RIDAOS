import { createPdfEngine, mapReportToDocument, openDocumentPrintView } from '../../documents'
import type { PdfExportResult } from '../../documents'
import type { ReportDocument } from '../types/reporting'
import { serializeReportToCsv } from '../utils/reportCsv'

function downloadBlob(filename: string, content: BlobPart, type: string) {
  if (typeof window === 'undefined') {
    return
  }

  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportReportAsJson(report: ReportDocument) {
  downloadBlob(`${report.id}.json`, JSON.stringify(report, null, 2), 'application/json')
}

export function exportReportAsCsv(report: ReportDocument) {
  downloadBlob(`${report.id}.csv`, serializeReportToCsv(report), 'text/csv;charset=utf-8')
}

export function openReportPrintView(report: ReportDocument) {
  openDocumentPrintView(mapReportToDocument(report))
}

export async function exportReportAsPdf(report: ReportDocument): Promise<PdfExportResult> {
  const engine = createPdfEngine('browser_print')

  return engine.export({
    document: mapReportToDocument(report),
    filename: `${report.id}.pdf`,
    mode: 'browser_print',
  })
}
