import type { PdfExportRequest, PdfExportResult } from './PdfEngine'
import { PdfEngineAdapter } from './PdfEngineAdapter'

export class FutureEdgePdfAdapter extends PdfEngineAdapter {
  readonly mode = 'edge_pdf' as const

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
      message: 'Edge PDF adapter preparado, sin funcion edge ni render real activados.',
    }
  }
}
