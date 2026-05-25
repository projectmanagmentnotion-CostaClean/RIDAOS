export const siteUrl = 'https://ridaos.vercel.app'

export const localSeoContent = {
  organization: {
    name: 'RidaosPrint',
    legalName: 'RidaosPrint',
    description:
      'Impresion personalizada, DTI por metro y rotulacion premium para negocios, vehiculos y proyectos comerciales.',
    email: 'hola@ridaosprint.com',
    telephone: '+34 600 000 000',
    areaServed: ['Barcelona', 'Blanes', 'Girona', 'Costa Brava', 'Espana'],
  },
  localBusiness: {
    name: 'RidaosPrint',
    description:
      'Taller orientado a impresion personalizada, DTI y rotulacion comercial con cobertura local en Barcelona, Blanes y Girona.',
    priceRange: '$$',
    address: {
      addressCountry: 'ES',
      addressRegion: 'Cataluna',
      addressLocality: 'Blanes',
    },
  },
  rotulacion: {
    hero: {
      title: 'Convierte cada trayecto en publicidad.',
      description:
        'Rotulacion premium para furgonetas, vehiculos de empresa y proyectos personalizados con cobertura local y propuesta adaptada.',
      alternateTitle: 'Tu vehiculo puede trabajar incluso cuando esta aparcado.',
      alternateDescription:
        'Rotulacion diseñada para negocios y marcas que quieren destacar en Barcelona, Blanes, Girona y Costa Brava.',
    },
    subcategories: [
      'Rotulacion de furgonetas',
      'Rotulacion comercial',
      'Rotulacion de vehiculos particulares',
      'Rotulacion integral',
      'Media rotulacion',
      'Escaparates',
      'Señaletica',
      'Vehiculos de empresa',
      'Flotas comerciales',
    ],
    localCoverage: [
      {
        label: 'Barcelona',
        items: [
          'Rotulacion de furgonetas Barcelona',
          'Vinilos para vehiculos Barcelona',
          'Rotulacion comercial Barcelona',
          'Rotulacion integral Barcelona',
          'DTF Barcelona',
          'Impresion personalizada Barcelona',
        ],
      },
      {
        label: 'Blanes',
        items: [
          'Rotulacion de vehiculos Blanes',
          'Rotulacion de furgonetas Blanes',
          'Vinilos comerciales Blanes',
          'DTF Blanes',
        ],
      },
      {
        label: 'Girona / Costa Brava',
        items: [
          'Rotulacion comercial Costa Brava',
          'Vinilos para empresas Girona',
          'Rotulacion de flotas Girona',
          'DTF Costa Brava',
        ],
      },
      {
        label: 'Espana',
        items: [
          'DTF Espana',
          'Rotulacion de vehiculos Espana',
          'Impresion personalizada Espana',
        ],
      },
    ],
    faq: [
      {
        question: '¿Hacéis rotulación de furgonetas en Barcelona?',
        answer:
          'Si. Diseñamos e instalamos rotulacion para furgonetas comerciales y vehiculos particulares en Barcelona y alrededores.',
      },
      {
        question: '¿Trabajáis en Blanes y Costa Brava?',
        answer:
          'Si, trabajamos en Blanes, Girona, Costa Brava y otras zonas cercanas para proyectos de rotulacion, vinilo comercial y DTF.',
      },
      {
        question: '¿Tambien hacéis rotulación de flotas comerciales?',
        answer:
          'Si. Preparamos rotulacion para vehiculos de empresa, flotas comerciales, media rotulacion y wrapping integral segun cobertura y uso.',
      },
      {
        question: '¿Puedo pedir rotulación comercial aunque no tenga el diseño final?',
        answer:
          'Si. Podemos revisar medidas, cobertura y objetivos comerciales primero, y cerrar el diseño final antes de fabricar e instalar.',
      },
    ],
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Rotulacion', path: '/servicios/rotulacion' },
    ],
  },
} as const
