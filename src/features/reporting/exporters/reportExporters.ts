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
  if (typeof window === 'undefined') {
    return
  }

  const nextWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!nextWindow) {
    return
  }

  const sections = report.sections
    .map(
      (section) => `
        <section style="margin-bottom:24px;">
          <h2 style="font-size:18px;margin:0 0 8px;">${section.title}</h2>
          ${section.description ? `<p style="margin:0 0 12px;color:#555;">${section.description}</p>` : ''}
          <table style="width:100%;border-collapse:collapse;">
            <tbody>
              ${section.rows
                .map(
                  (row) => `
                    <tr>
                      <td style="padding:8px;border-bottom:1px solid #ddd;color:#555;">${row.label}</td>
                      <td style="padding:8px;border-bottom:1px solid #ddd;font-weight:600;">${row.value}</td>
                    </tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </section>`,
    )
    .join('')

  nextWindow.document.write(`
    <html>
      <head>
        <title>${report.label}</title>
        <meta charset="utf-8" />
      </head>
      <body style="font-family:Arial,sans-serif;padding:32px;color:#111;">
        <header style="margin-bottom:24px;">
          <p style="margin:0 0 8px;color:#555;">PRINT_VIEW mock</p>
          <h1 style="margin:0 0 8px;">${report.label}</h1>
          <p style="margin:0;color:#555;">${report.description}</p>
        </header>
        ${sections}
      </body>
    </html>
  `)
  nextWindow.document.close()
}
