import type { ReportFormat } from '../types/reporting'

type ReportFormatSelectorProps = {
  formats: ReportFormat[]
  value: ReportFormat
  onChange: (format: ReportFormat) => void
}

const labels: Record<ReportFormat, string> = {
  json: 'JSON',
  csv: 'CSV',
  print_view: 'PRINT_VIEW',
  pdf: 'PDF',
}

export function ReportFormatSelector({ formats, value, onChange }: ReportFormatSelectorProps) {
  return (
    <label className="field-group">
      <span className="field-label">Formato</span>
      <select className="form-input" onChange={(event) => onChange(event.target.value as ReportFormat)} value={value}>
        {formats.map((format) => (
          <option key={format} value={format}>
            {labels[format]}
          </option>
        ))}
      </select>
    </label>
  )
}
