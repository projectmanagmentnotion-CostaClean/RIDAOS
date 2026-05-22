export type ReportType =
  | 'ORDER_SUMMARY'
  | 'PRODUCTION_SHEET'
  | 'ARTWORK_REVIEW_REPORT'
  | 'PREPRESS_CHECK_REPORT'
  | 'DISPATCH_REPORT'
  | 'DELIVERY_HANDOFF_REPORT'
  | 'CLIENT_SERVICE_REPORT'
  | 'CAPACITY_REPORT'
  | 'ADMIN_KPI_REPORT'

export type ReportEntity =
  | 'order'
  | 'production'
  | 'prepress'
  | 'upload'
  | 'dispatch'
  | 'client_service'
  | 'capacity'
  | 'admin_kpi'

export type ReportFormat = 'json' | 'csv' | 'print_view' | 'pdf'

export type ReportStatus = 'draft' | 'ready' | 'pending'

export type ReportSectionRow = {
  label: string
  value: string
}

export type ReportSection = {
  id: string
  title: string
  description?: string
  rows: ReportSectionRow[]
}

export type ReportDefinition = {
  id: ReportType
  label: string
  description: string
  relatedEntity: ReportEntity
  sections: string[]
  availableFormats: ReportFormat[]
  status: ReportStatus
}

export type ReportDocument = {
  id: string
  type: ReportType
  label: string
  description: string
  relatedEntity: ReportEntity
  status: ReportStatus
  generatedAt: string
  sections: ReportSection[]
  availableFormats: ReportFormat[]
}

export type ReportHistoryEntry = {
  id: string
  label: string
  format: ReportFormat
  generatedAt: string
  status: 'generated' | 'previewed'
}
