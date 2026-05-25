import type { AnswerStyleQuestion } from '../types/searchIntelligence'

export const answerStyleQuestions: AnswerStyleQuestion[] = [
  {
    id: 'dtf-vs-dti-difference',
    question: '¿Que diferencia hay entre DTI y DTF?',
    answer:
      'En busqueda real, muchos clientes usan DTI para referirse a DTF. La forma tecnica correcta en nuestro catalogo es DTF por metro, orientado a impresion textil y produccion de transfers.',
    frame: 'comparacion',
    entity: 'dti',
    intents: ['informational', 'commercial'],
    priority: 'high',
    relatedServices: ['DTF por metro'],
    relatedProducts: ['Camisetas', 'Sudaderas', 'Uniformes empresa'],
  },
  {
    id: 'rotulacion-price-barcelona',
    question: '¿Cuanto cuesta rotular una furgoneta en Barcelona?',
    answer:
      'Depende de la cobertura, el tamano del vehiculo, el material y si se trata de media rotulacion o integral. La mejor forma de afinarlo es partir de cobertura, ciudad y referencias visuales.',
    frame: 'que',
    entity: 'rotulacion',
    intents: ['commercial', 'local'],
    priority: 'high',
    locality: 'barcelona',
    relatedServices: ['Rotulacion comercial de furgonetas', 'Rotulacion integral de vehiculo'],
    relatedProducts: ['Vinilo comercial'],
  },
  {
    id: 'best-vinyl-durability',
    question: '¿Que vinilo dura mas?',
    answer:
      'Para exterior y vehiculo, la durabilidad depende del material, el laminado y el uso real. En proyectos comerciales conviene definir primero soporte, exposicion y tiempo esperado de vida.',
    frame: 'que',
    entity: 'vinilo-comercial',
    intents: ['informational', 'commercial'],
    priority: 'medium',
    relatedServices: ['Vinilo impreso', 'Escaparates', 'Rotulacion comercial'],
    relatedProducts: ['Senaletica'],
  },
  {
    id: 'rotulacion-turnaround',
    question: '¿Cuanto tarda una rotulacion comercial?',
    answer:
      'El plazo cambia segun medicion, diseno, impresion, laminado e instalacion. Para una respuesta seria hay que revisar cobertura, vehiculo y ciudad de trabajo.',
    frame: 'cuando',
    entity: 'rotulacion',
    intents: ['commercial', 'local'],
    priority: 'high',
    relatedServices: ['Rotulacion comercial', 'Flotas comerciales'],
    relatedProducts: ['Tarjetas empresa'],
  },
  {
    id: 'print-from-photo',
    question: '¿Puedo imprimir desde una foto?',
    answer:
      'Si, pero depende de la resolucion, el tamano final y el tipo de producto. Para carteleria, pegatinas o DTF conviene revisar calidad antes de producir.',
    frame: 'como',
    entity: 'gran-formato',
    intents: ['informational', 'commercial'],
    priority: 'medium',
    relatedServices: ['Revision de archivo', 'Carteleria', 'Pegatinas troqueladas'],
    relatedProducts: ['DTF por metro'],
  },
  {
    id: 'prepare-dtf-file',
    question: '¿Como preparar un archivo DTI?',
    answer:
      'Lo mas util es tratarlo como un archivo DTF: definir ancho, mantener buena resolucion, separar disenos y dejar margen tecnico suficiente antes de producir.',
    frame: 'como',
    entity: 'dti',
    intents: ['informational', 'commercial'],
    priority: 'high',
    relatedServices: ['DTF por metro', 'Revision de archivo DTF'],
    relatedProducts: ['Uniformes empresa', 'Textil'],
  },
  {
    id: 'rotulacion-blanes-costa-brava',
    question: '¿Trabajais rotulacion en Blanes y Costa Brava?',
    answer:
      'Si. La cobertura incluye Blanes, Girona, Costa Brava y otras zonas cercanas para proyectos de vehiculos de empresa, escaparates y vinilo comercial.',
    frame: 'donde',
    entity: 'rotulacion',
    intents: ['local', 'commercial'],
    priority: 'high',
    locality: 'blanes',
    relatedServices: ['Rotulacion comercial', 'Escaparates', 'Senaletica'],
    relatedProducts: ['Vinilo comercial'],
  },
  {
    id: 'business-cards-quantity',
    question: '¿Cuantas tarjetas de visita necesito para empezar?',
    answer:
      'Depende del ritmo comercial y de si las vas a usar en tienda, visitas o eventos. Para empresas locales suele ser mas util empezar con una tirada clara y reponer rapido.',
    frame: 'que',
    entity: 'tarjetas',
    intents: ['informational', 'commercial'],
    priority: 'medium',
    relatedServices: ['Tarjetas de visita'],
    relatedProducts: ['Flyers', 'Pegatinas empresa'],
  },
]
