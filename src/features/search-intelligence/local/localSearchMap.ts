import type { LocalSearchArea } from '../types/searchIntelligence'

export const localSearchMap: LocalSearchArea[] = [
  {
    id: 'barcelona',
    label: 'Barcelona',
    keywords: [
      'Rotulacion de furgonetas Barcelona',
      'Vinilos para vehiculos Barcelona',
      'Rotulacion comercial Barcelona',
      'Rotulacion integral Barcelona',
      'DTI Barcelona',
      'Impresion personalizada Barcelona',
    ],
    services: ['Rotulacion comercial', 'DTF por metro', 'Vinilo comercial', 'Tarjetas empresa'],
    faqIds: ['rotulacion-price-barcelona'],
    opportunityNotes: [
      'Priorizar landings para negocio local y vehiculo de empresa.',
      'Cruzar rotulacion con escaparates y senaletica.',
    ],
  },
  {
    id: 'blanes',
    label: 'Blanes',
    keywords: [
      'Rotulacion de vehiculos Blanes',
      'Rotulacion de furgonetas Blanes',
      'Vinilos comerciales Blanes',
      'DTI Blanes',
    ],
    services: ['Rotulacion comercial', 'Escaparates', 'DTF por metro'],
    faqIds: ['rotulacion-blanes-costa-brava'],
    opportunityNotes: [
      'Enfatizar cercania y atencion a negocios locales.',
      'Abrir busquedas de branding para comercio de proximidad.',
    ],
  },
  {
    id: 'girona',
    label: 'Girona',
    keywords: [
      'Rotulacion comercial Girona',
      'Vinilos para empresas Girona',
      'Rotulacion de flotas Girona',
      'Impresion personalizada Girona',
    ],
    services: ['Rotulacion comercial', 'Flotas comerciales', 'Vinilo comercial'],
    faqIds: ['rotulacion-blanes-costa-brava'],
    opportunityNotes: [
      'Cruzar vehiculos de empresa con flotas y senaletica.',
      'Mantener enfoque B2B y cobertura comarcal.',
    ],
  },
  {
    id: 'costa-brava',
    label: 'Costa Brava',
    keywords: [
      'Rotulacion comercial Costa Brava',
      'DTI Costa Brava',
      'Vinilos comerciales Costa Brava',
    ],
    services: ['Rotulacion comercial', 'DTF por metro', 'Escaparates'],
    faqIds: ['rotulacion-blanes-costa-brava'],
    opportunityNotes: [
      'Relacionar proyectos de temporada, retail y hospitality.',
      'Usar lenguaje claro de cobertura territorial.',
    ],
  },
  {
    id: 'cataluna',
    label: 'Cataluna',
    keywords: ['Rotulacion vehiculos Cataluna', 'Impresion para empresas Cataluna', 'DTF textil Cataluna'],
    services: ['Rotulacion comercial', 'DTF por metro', 'Gran formato'],
    faqIds: [],
    opportunityNotes: ['Sirve como capa regional superior sin competir con las zonas prioritarias.'],
  },
  {
    id: 'espana',
    label: 'Espana',
    keywords: ['DTI Espana', 'Rotulacion de vehiculos Espana', 'Impresion personalizada Espana'],
    services: ['DTF por metro', 'Rotulacion comercial', 'Papeleria corporativa'],
    faqIds: [],
    opportunityNotes: ['Usar solo como capa nacional de captura semantica, no como promesa local principal.'],
  },
]
