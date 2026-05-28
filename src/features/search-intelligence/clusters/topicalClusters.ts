import { publicRoutes } from '../../../lib/navigation'
import type { SearchTopicCluster } from '../types/searchIntelligence'

export const topicalClusters: SearchTopicCluster[] = [
  {
    id: 'rotulacion-hub',
    label: 'Hub de rotulacion comercial',
    hub: publicRoutes.rotulacion,
    entity: 'rotulacion',
    intentMix: ['commercial', 'local', 'comparative'],
    supportingPages: [publicRoutes.carteleria, publicRoutes.contacto, publicRoutes.portafolio, publicRoutes.catalogo],
    internalLinks: ['Escaparates', 'Senaletica', 'Vinilo comercial', 'Flotas comerciales'],
    questionIds: ['rotulacion-price-barcelona', 'rotulacion-turnaround', 'rotulacion-blanes-costa-brava'],
    keywordGroupIds: ['rotulacion-commercial-core', 'rotulacion-local-longtail', 'vinyl-commercial-core'],
  },
  {
    id: 'dtf-hub',
    label: 'Hub de DTF por metro',
    hub: publicRoutes.dtf,
    entity: 'dtf',
    intentMix: ['transactional', 'commercial', 'informational'],
    supportingPages: [publicRoutes.guia, publicRoutes.catalogo, publicRoutes.contacto],
    internalLinks: ['Uniformes empresa', 'Textil', 'Revision de archivo DTF'],
    questionIds: ['dtf-vs-dti-difference', 'prepare-dtf-file'],
    keywordGroupIds: ['dtf-meter-core'],
  },
  {
    id: 'print-basics-hub',
    label: 'Hub de impresion comercial basica',
    hub: '#/catalogo',
    entity: 'tarjetas',
    intentMix: ['transactional', 'commercial', 'informational'],
    supportingPages: [publicRoutes.productoTarjetas, publicRoutes.productoVinilo, publicRoutes.guia],
    internalLinks: ['Tarjetas empresa', 'Flyers personalizados', 'Pegatinas personalizadas'],
    questionIds: ['business-cards-quantity', 'print-from-photo'],
    keywordGroupIds: ['cards-business-core', 'flyers-commercial-core', 'stickers-custom-core'],
  },
]
