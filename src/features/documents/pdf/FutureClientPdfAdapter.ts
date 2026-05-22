import type { PdfExportRequest, PdfExportResult } from './PdfEngine'
import { PdfEngineAdapter } from './PdfEngineAdapter'

export class FutureClientPdfAdapter extends PdfEngineAdapter {
  readonly mode = 'client_pdf' as const

  readonly capabilities = {
    supportsRealPdf: false,
    supportsPrintView: false,
    supportsA4Branding: true,
    requiresServerRuntime: false,
    status: 'placeholder' as const,
  }

  export(request: PdfExportRequest): PdfExportResult {
    void request

    return {
      ok: false,
      mode: this.mode,
      handledAs: 'placeholder',
      message: 'Client PDF adapter preparado, sin libreria real cargada todavia.',
    }
  }
}
