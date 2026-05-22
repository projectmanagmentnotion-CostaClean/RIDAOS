export const documentPrintStyles = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, sans-serif; color: #111; background: #fff; }
  .operational-document { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm 14mm 12mm; background: #fff; }
  .document-header, .document-footer { display: flex; justify-content: space-between; gap: 12px; }
  .document-header { border-bottom: 1px solid #ddd; padding-bottom: 8mm; margin-bottom: 8mm; }
  .document-footer { border-top: 1px solid #ddd; padding-top: 6mm; margin-top: 8mm; font-size: 11px; color: #555; }
  .document-meta { display: grid; gap: 4px; text-align: right; font-size: 12px; color: #555; }
  .operational-document__body { display: grid; gap: 8mm; }
  .document-section { page-break-inside: avoid; break-inside: avoid; }
  .document-section-head h2, .document-block h3, .document-header h1 { margin: 0 0 4px; }
  .document-section-head p, .document-header p, .document-block p { margin: 0 0 8px; color: #555; }
  .document-table { width: 100%; border-collapse: collapse; }
  .document-table td { padding: 8px 0; border-bottom: 1px solid #e5e5e5; vertical-align: top; }
  .document-table td:first-child { width: 38%; color: #555; }
  .document-metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .document-metric-card { border: 1px solid #ddd; padding: 10px; border-radius: 8px; }
  .document-metric-card strong { display: block; margin-top: 4px; font-size: 18px; }
  .document-timeline, .document-checklist { display: grid; gap: 8px; }
  .document-timeline-item { border-bottom: 1px solid #e5e5e5; padding-bottom: 8px; }
  .document-signature { display: grid; gap: 8px; margin-top: 12px; }
  .document-signature-line { height: 1px; background: #111; width: 240px; }
  @page { size: A4; margin: 12mm; }
`
