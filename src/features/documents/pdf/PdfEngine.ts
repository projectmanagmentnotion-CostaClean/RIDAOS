import type { DocumentDefinition } from '../types/documents'

export type PdfEngineMode = 'browser_print' | 'client_pdf' | 'server_pdf' | 'edge_pdf'

export type PdfEngineCapabilities = {
  supportsRealPdf: boolean
  supportsPrintView: boolean
  supportsA4Branding: boolean
  requiresServerRuntime: boolean
  status: 'active' | 'placeholder'
}

export type PdfExportRequest = {
  document: DocumentDefinition
  filename?: string
  mode?: PdfEngineMode
}

export type PdfExportResult = {
  ok: boolean
  mode: PdfEngineMode
  handledAs: 'print_view' | 'placeholder' | 'pdf'
  message: string
}

export interface PdfEngine {
  readonly mode: PdfEngineMode
  readonly capabilities: PdfEngineCapabilities
  export(request: PdfExportRequest): Promise<PdfExportResult> | PdfExportResult
}
