import type { ReportType } from '../../reporting/types/reporting'

export const documentDefinitionCatalog: Array<{
  reportType: ReportType
  label: string
  primaryLayout: 'operational'
  supportedModes: Array<'screen_preview' | 'print_view' | 'future_pdf'>
}> = [
  { reportType: 'ORDER_SUMMARY', label: 'Order summary document', primaryLayout: 'operational', supportedModes: ['screen_preview', 'print_view', 'future_pdf'] },
  { reportType: 'PRODUCTION_SHEET', label: 'Production sheet document', primaryLayout: 'operational', supportedModes: ['screen_preview', 'print_view', 'future_pdf'] },
  { reportType: 'ARTWORK_REVIEW_REPORT', label: 'Artwork review document', primaryLayout: 'operational', supportedModes: ['screen_preview', 'print_view', 'future_pdf'] },
  { reportType: 'PREPRESS_CHECK_REPORT', label: 'Prepress check document', primaryLayout: 'operational', supportedModes: ['screen_preview', 'print_view', 'future_pdf'] },
  { reportType: 'DELIVERY_HANDOFF_REPORT', label: 'Delivery handoff document', primaryLayout: 'operational', supportedModes: ['screen_preview', 'print_view', 'future_pdf'] },
  { reportType: 'CLIENT_SERVICE_REPORT', label: 'Client service document', primaryLayout: 'operational', supportedModes: ['screen_preview', 'print_view', 'future_pdf'] },
  { reportType: 'ADMIN_KPI_REPORT', label: 'Admin KPI document', primaryLayout: 'operational', supportedModes: ['screen_preview', 'print_view', 'future_pdf'] },
]
