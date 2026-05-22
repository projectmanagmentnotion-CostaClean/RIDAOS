import type { ReportDocument } from '../types/reporting'

export function serializeReportToCsv(report: ReportDocument) {
  const lines = ['section,label,value']

  report.sections.forEach((section) => {
    section.rows.forEach((row) => {
      const escape = (value: string) => `"${value.replaceAll('"', '""')}"`
      lines.push([escape(section.title), escape(row.label), escape(row.value)].join(','))
    })
  })

  return lines.join('\n')
}
