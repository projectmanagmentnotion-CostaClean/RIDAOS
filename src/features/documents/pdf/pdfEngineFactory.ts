import { BrowserPrintPdfAdapter } from './BrowserPrintPdfAdapter'
import { FutureClientPdfAdapter } from './FutureClientPdfAdapter'
import { FutureEdgePdfAdapter } from './FutureEdgePdfAdapter'
import { FutureServerPdfAdapter } from './FutureServerPdfAdapter'
import type { PdfEngine, PdfEngineMode } from './PdfEngine'

const defaultMode: PdfEngineMode = 'browser_print'

export function resolvePdfEngineMode(preferredMode?: PdfEngineMode): PdfEngineMode {
  return preferredMode ?? defaultMode
}

export function createPdfEngine(preferredMode?: PdfEngineMode): PdfEngine {
  const mode = resolvePdfEngineMode(preferredMode)

  switch (mode) {
    case 'client_pdf':
      return new FutureClientPdfAdapter()
    case 'server_pdf':
      return new FutureServerPdfAdapter()
    case 'edge_pdf':
      return new FutureEdgePdfAdapter()
    case 'browser_print':
    default:
      return new BrowserPrintPdfAdapter()
  }
}
