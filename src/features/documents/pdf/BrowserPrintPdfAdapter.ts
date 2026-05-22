import { openDocumentPrintView } from '../services/documentPrintService'
import type { PdfExportRequest, PdfExportResult } from './PdfEngine'
import { PdfEngineAdapter } from './PdfEngineAdapter'

export class BrowserPrintPdfAdapter extends PdfEngineAdapter {
  readonly mode = 'browser_print' as const

  readonly capabilities = {
    supportsRealPdf: false,
    supportsPrintView: true,
    supportsA4Branding: true,
    requiresServerRuntime: false,
    status: 'active' as const,
  }

  export(request: PdfExportRequest): PdfExportResult {
    openDocumentPrintView(request.document)

    return {
      ok: true,
      mode: this.mode,
      handledAs: 'print_view',
      message: 'PDF real aun no esta activo. Se ha abierto la vista imprimible del navegador.',
    }
  }
}
