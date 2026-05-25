import type { CompetitorPattern } from '../types/searchIntelligence'

export const competitorPatterns: CompetitorPattern[] = [
  {
    competitor: 'Pixartprinting',
    focus: 'Catalogo amplio, productos especificos, lenguaje tecnico util y plantillas guiadas.',
    strengths: ['Cobertura extensa de soportes', 'Buena relacion entre producto, plantilla y preparacion de archivo'],
    observedPatterns: [
      'Conecta producto concreto con aplicacion comercial visible.',
      'Refuerza sangrado, formatos y preparacion de archivo en contexto.',
      'Trabaja bien intencion de corte, vinilo, pegatinas y gran formato.',
    ],
    gapOpportunity: [
      'RidaosPrint puede ganar con mas claridad local y vehiculos de empresa.',
      'Tambien puede diferenciarse con respuestas mas conversacionales y menos catalogo puro.',
    ],
    sourceUrls: [
      'https://www.pixartprinting.es/impresion-etiquetas/stickers-adhesivos/pegatinas-corte-completo/',
      'https://www.pixartprinting.es/formato-grande/impresion-adhesivos-vinilicos/adhesivos-para-autos-motos/',
      'https://www.pixartprinting.es/blog/como-hacer-folleto-eficaz/',
    ],
  },
  {
    competitor: 'VistaPrint',
    focus: 'Entrada por necesidad de negocio, small business y merchandising claro.',
    strengths: ['Lectura comercial sencilla', 'Agrupacion de categorias entendible', 'Buen tono para no tecnicos'],
    observedPatterns: [
      'Agrupa por problema de negocio y por familia de producto.',
      'Usa preguntas frecuentes y beneficios simples antes de detalles tecnicos.',
      'Refuerza branding para empresa pequena y material promocional.',
    ],
    gapOpportunity: [
      'RidaosPrint puede ganar con mas profundidad tecnica en DTF, rotulacion y preprensa.',
      'Tambien con mas especificidad local en Barcelona, Blanes y Girona.',
    ],
    sourceUrls: [
      'https://www.vistaprint.es/materiales-de-marketing',
      'https://www.vistaprint.es/etiquetas-y-pegatinas',
      'https://www.vistaprint.es/lonas-y-posteres/vinilos',
    ],
  },
  {
    competitor: 'HelloPrint',
    focus: 'Diseño online, plantillas y flujo de uso muy guiado.',
    strengths: ['Fraseo accesible', 'Secuencia clara de pasos', 'Buen encaje para usuarios poco tecnicos'],
    observedPatterns: [
      'Convierte preguntas de uso en FAQs directas.',
      'Conecta plantilla, seleccion de producto y subida de archivo.',
      'Simplifica mucho el camino antes de la impresion.',
    ],
    gapOpportunity: [
      'RidaosPrint puede diferenciarse con mas autoridad local y enfoque B2B.',
      'Tambien con mas claridad entre configuracion, revision tecnica y produccion.',
    ],
    sourceUrls: ['https://www.helloprint.es/canva', 'https://www.helloprint.es/formato-a4'],
  },
  {
    competitor: 'OnlinePrinters',
    focus: 'Fichas tecnicas y especificaciones de archivo muy estructuradas.',
    strengths: ['Documentacion tecnica util', 'Plantillas y fichas con sangrado claros'],
    observedPatterns: [
      'La autoridad nace del detalle tecnico y de formatos muy concretos.',
      'Hay buena base para queries de preparacion de archivo y plantillas.',
    ],
    gapOpportunity: [
      'RidaosPrint puede cubrir la misma necesidad con menos friccion y tono mas humano.',
      'La oportunidad es unir tecnicidad con intencion comercial y local real.',
    ],
    sourceUrls: [
      'https://www.onlineprinters.es/%24WS/diedruckerei/shopdata/media/pim/04-aa/live/files/dataInfo/2c9ceb817c84b262017ca28d0b55753a.pdf?x=202111030744',
      'https://www.onlineprinters.es/%24WS/diedruckerei/shopdata/media/pim/04-aa/live/files/dataInfo/2c9ceb8181a5f24901820219f3c062e6.pdf?x=202207181038',
    ],
  },
]
