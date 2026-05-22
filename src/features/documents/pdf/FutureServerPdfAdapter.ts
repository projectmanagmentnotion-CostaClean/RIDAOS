import type { PdfExportRequest, PdfExportResult } from './PdfEngine'
import { PdfEngineAdapter } from './PdfEngineAdapter'

export class FutureServerPdfAdapter extends PdfEngineAdapter {
  readonly mode = 'server_pdf' as const

  readonly capabilities = {
    supportsRealPdf: false,
    supportsPrintView: false,
    supportsA4Branding: true,
    requiresServerRuntime: true,
    status: 'placeholder' as const,
  }

  export(request: PdfExportRequest): PdfExportResult {
    void request

    return {
      ok: false,
      mode: this.mode,
      handledAs: 'placeholder',
      message: 'Server PDF adapter preparado, sin runtime ni requests reales.',
    }
  }
}
