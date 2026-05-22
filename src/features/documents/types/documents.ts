import type { ReportType } from '../../reporting/types/reporting'

export type DocumentExportTarget = 'order' | 'production' | 'upload' | 'prepress' | 'dispatch' | 'service' | 'kpi'

export type DocumentRenderMode = 'screen_preview' | 'print_view' | 'future_pdf'

export type DocumentBranding = {
  brandName: string
  strapline: string
  accentLabel: string
}

export type DocumentMetadata = {
  id: string
  title: string
  description: string
  generatedAt: string
  reportType: ReportType
  exportTarget: DocumentExportTarget
  versionLabel: string
}

export type DocumentBlock =
  | {
      id: string
      type: 'table'
      title: string
      description?: string
      rows: Array<{ label: string; value: string }>
    }
  | {
      id: string
      type: 'metric_grid'
      title: string
      metrics: Array<{ label: string; value: string; note?: string }>
    }
  | {
      id: string
      type: 'timeline'
      title: string
      items: Array<{ label: string; value: string }>
    }
  | {
      id: string
      type: 'checklist'
      title: string
      items: string[]
    }
  | {
      id: string
      type: 'signature'
      title: string
      signerLabel: string
      note?: string
    }

export type DocumentSection = {
  id: string
  title: string
  description?: string
  blocks: DocumentBlock[]
}

export type DocumentDefinition = {
  branding: DocumentBranding
  metadata: DocumentMetadata
  sections: DocumentSection[]
}
