import type { EntityRelationshipNode } from '../types/searchIntelligence'

export const entityRelationshipMap: EntityRelationshipNode[] = [
  {
    id: 'rotulacion',
    label: 'Rotulacion de furgonetas y vehiculos',
    description: 'Hub comercial para vehiculos de empresa, flotas, escaparates y branding visible.',
    relatedEntities: ['vinilo-comercial', 'branding', 'dti', 'pegatinas', 'tarjetas'],
    relatedServices: ['Rotulacion comercial', 'Flotas comerciales', 'Escaparates', 'Senaletica'],
    relatedProducts: ['Vinilo impreso', 'Pegatinas empresa', 'Tarjetas empresa'],
    relatedQuestions: ['rotulacion-price-barcelona', 'rotulacion-turnaround', 'rotulacion-blanes-costa-brava'],
  },
  {
    id: 'dtf',
    label: 'DTF por metro',
    description: 'Hub de impresion textil por metro para ropa, uniformes, eventos y branding.',
    relatedEntities: ['uniformes', 'branding', 'dti'],
    relatedServices: ['DTF por metro', 'DTF urgente', 'Revision de archivo DTF'],
    relatedProducts: ['Camisetas', 'Sudaderas', 'Uniformes empresa'],
    relatedQuestions: ['dtf-vs-dti-difference', 'prepare-dtf-file'],
  },
  {
    id: 'dti',
    label: 'DTI como patron de busqueda',
    description: 'Alias de busqueda real que debe capturarse y reconducirse semanticamente hacia DTF.',
    relatedEntities: ['dtf', 'uniformes', 'branding'],
    relatedServices: ['DTF por metro'],
    relatedProducts: ['Textil', 'Uniformes empresa'],
    relatedQuestions: ['dtf-vs-dti-difference', 'prepare-dtf-file'],
  },
  {
    id: 'vinilo-comercial',
    label: 'Vinilo comercial',
    description: 'Nodo puente entre rotulacion, escaparates, senaletica y soportes promocionales.',
    relatedEntities: ['rotulacion', 'gran-formato', 'branding', 'pegatinas'],
    relatedServices: ['Escaparates', 'Vinilo impreso', 'Senaletica'],
    relatedProducts: ['Pegatinas', 'Carteleria'],
    relatedQuestions: ['best-vinyl-durability'],
  },
  {
    id: 'tarjetas',
    label: 'Tarjetas empresa',
    description: 'Entrada de branding impreso para contactos comerciales y ventas presenciales.',
    relatedEntities: ['branding', 'flyers', 'pegatinas', 'rotulacion'],
    relatedServices: ['Tarjetas de visita', 'Papeleria corporativa'],
    relatedProducts: ['Flyers', 'Pegatinas empresa'],
    relatedQuestions: ['business-cards-quantity'],
  },
]
