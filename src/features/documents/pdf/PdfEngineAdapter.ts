import type { PdfEngine, PdfEngineCapabilities, PdfEngineMode, PdfExportRequest, PdfExportResult } from './PdfEngine'

export abstract class PdfEngineAdapter implements PdfEngine {
  abstract readonly mode: PdfEngineMode
  abstract readonly capabilities: PdfEngineCapabilities

  abstract export(request: PdfExportRequest): Promise<PdfExportResult> | PdfExportResult
}
