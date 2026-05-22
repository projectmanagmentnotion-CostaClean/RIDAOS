import type { DocumentBlock, DocumentDefinition } from '../types/documents'
import { documentPrintStyles } from '../utils/documentPrintStyles'

function renderBlock(block: DocumentBlock) {
  if (block.type === 'metric_grid') {
    return `
      <section class="document-block">
        <h3>${block.title}</h3>
        <div class="document-metric-grid">
          ${block.metrics
            .map(
              (metric) => `
                <article class="document-metric-card">
                  <span>${metric.label}</span>
                  <strong>${metric.value}</strong>
                  ${metric.note ? `<small>${metric.note}</small>` : ''}
                </article>`,
            )
            .join('')}
        </div>
      </section>`
  }

  if (block.type === 'timeline') {
    return `
      <section class="document-block">
        <h3>${block.title}</h3>
        <div class="document-timeline">
          ${block.items
            .map(
              (item) => `
                <article class="document-timeline-item">
                  <strong>${item.label}</strong>
                  <span>${item.value}</span>
                </article>`,
            )
            .join('')}
        </div>
      </section>`
  }

  if (block.type === 'checklist') {
    return `
      <section class="document-block">
        <h3>${block.title}</h3>
        <ul class="document-checklist">
          ${block.items.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </section>`
  }

  if (block.type === 'signature') {
    return `
      <section class="document-block">
        <h3>${block.title}</h3>
        <div class="document-signature">
          <span>${block.signerLabel}</span>
          <div class="document-signature-line"></div>
          ${block.note ? `<small>${block.note}</small>` : ''}
        </div>
      </section>`
  }

  return `
    <section class="document-block">
      <h3>${block.title}</h3>
      ${block.description ? `<p>${block.description}</p>` : ''}
      <table class="document-table">
        <tbody>
          ${block.rows
            .map(
              (row) => `
                <tr>
                  <td>${row.label}</td>
                  <td>${row.value}</td>
                </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </section>`
}

export function renderDocumentHtml(documentDefinition: DocumentDefinition) {
  const sections = documentDefinition.sections
    .map(
      (section) => `
        <section class="document-section">
          <div class="document-section-head">
            <h2>${section.title}</h2>
            ${section.description ? `<p>${section.description}</p>` : ''}
          </div>
          <div class="document-section-body">
            ${section.blocks.map(renderBlock).join('')}
          </div>
        </section>`,
    )
    .join('')

  return `
    <html>
      <head>
        <title>${documentDefinition.metadata.title}</title>
        <meta charset="utf-8" />
        <style>${documentPrintStyles}</style>
      </head>
      <body>
        <article class="operational-document operational-document--print_view">
          <header class="document-header">
            <div>
              <p>${documentDefinition.branding.accentLabel}</p>
              <h1>${documentDefinition.metadata.title}</h1>
              <p>${documentDefinition.metadata.description}</p>
            </div>
            <div class="document-meta">
              <strong>${documentDefinition.branding.brandName}</strong>
              <span>${documentDefinition.branding.strapline}</span>
              <span>${new Date(documentDefinition.metadata.generatedAt).toLocaleString('es-ES')}</span>
              <span>${documentDefinition.metadata.versionLabel}</span>
            </div>
          </header>
          <div class="operational-document__body">${sections}</div>
          <footer class="document-footer">
            <span>${documentDefinition.metadata.id}</span>
            <span>${documentDefinition.metadata.reportType}</span>
            <span>Mock/local only</span>
          </footer>
        </article>
      </body>
    </html>`
}

export function openDocumentPrintView(documentDefinition: DocumentDefinition) {
  if (typeof window === 'undefined') {
    return
  }

  const nextWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!nextWindow) {
    return
  }

  nextWindow.document.write(renderDocumentHtml(documentDefinition))
  nextWindow.document.close()
}
