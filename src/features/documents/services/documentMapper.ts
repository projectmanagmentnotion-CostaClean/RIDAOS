import { defaultDocumentBranding } from '../mock/documentTemplates'
import type { DocumentDefinition } from '../types/documents'
import type { ReportDocument, ReportEntity, ReportSection } from '../../reporting/types/reporting'

function mapTarget(relatedEntity: ReportEntity): DocumentDefinition['metadata']['exportTarget'] {
  switch (relatedEntity) {
    case 'order':
      return 'order'
    case 'production':
      return 'production'
    case 'prepress':
      return 'prepress'
    case 'upload':
      return 'upload'
    case 'dispatch':
      return 'dispatch'
    case 'client_service':
      return 'service'
    case 'capacity':
      return 'production'
    case 'admin_kpi':
    default:
      return 'kpi'
  }
}

function mapSection(section: ReportSection, index: number): DocumentDefinition['sections'][number] {
  const blocks: DocumentDefinition['sections'][number]['blocks'] = []

  if (section.rows.length <= 4) {
    blocks.push({
      id: `${section.id}-metrics`,
      type: 'metric_grid',
      title: section.title,
      metrics: section.rows.map((row) => ({ label: row.label, value: row.value })),
    })
  } else {
    blocks.push({
      id: `${section.id}-table`,
      type: index === 1 ? 'timeline' : 'table',
      title: section.title,
      description: section.description,
      ...(index === 1
        ? { items: section.rows.map((row) => ({ label: row.label, value: row.value })) }
        : { rows: section.rows }),
    } as DocumentDefinition['sections'][number]['blocks'][number])
  }

  return {
    id: section.id,
    title: section.title,
    description: section.description,
    blocks,
  }
}

export function mapReportToDocument(report: ReportDocument): DocumentDefinition {
  return {
    branding: defaultDocumentBranding,
    metadata: {
      id: report.id,
      title: report.label,
      description: report.description,
      generatedAt: report.generatedAt,
      reportType: report.type,
      exportTarget: mapTarget(report.relatedEntity),
      versionLabel: 'local-v1',
    },
    sections: [
      ...report.sections.map((section, index) => mapSection(section, index)),
      {
        id: 'signature',
        title: 'Validacion interna',
        blocks: [
          {
            id: 'signature-block',
            type: 'signature',
            title: 'Firma operativa',
            signerLabel: 'Equipo interno RidaosPrint',
            note: 'Documento local preparado para exportacion documental.',
          },
        ],
      },
    ],
  }
}
