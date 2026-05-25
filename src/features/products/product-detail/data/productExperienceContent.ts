import { getQuoteHref, publicRoutes } from '../../../../lib/navigation'
import type { ProductExperienceConfig } from '../types/productExperience.types'

export const productExperienceContent: Record<string, ProductExperienceConfig> = {
  textil: {
    key: 'textil',
    className: 'textil-page',
    sections: ['hero', 'gallery', 'configurator', 'specs', 'story', 'recommendations', 'faq', 'final-cta', 'sticky-summary'],
    faqTitle: 'FAQ textil',
    fallbackEyebrow: 'Estampados / textil',
    fallbackTitle: 'Textil listo para estimar.',
    fallbackDescription: 'Prendas y accesorios textiles con lectura clara por cantidad, acabado y siguiente paso comercial.',
    heroStickerWords: ['textil', 'drop'],
    supportSections: [
      {
        label: 'Antes de pedir',
        title: 'Define cantidad, prenda y acabado.',
        items: [
          'Cambia de prenda sin salir del configurador.',
          'Usa notas para tallaje, posiciones de estampacion o prendas aportadas por cliente.',
          'La revision final se hace antes de fabricar.',
        ],
      },
      {
        label: 'Siguiente paso',
        title: 'Compra directa si encaja, propuesta si necesita ajuste.',
        items: [
          'Si la configuracion encaja en tramo, puedes pasar al carrito directamente.',
          'El archivo puede enviarse en este paso o completarse durante la comprobacion tecnica.',
          'La propuesta sigue disponible cuando el pedido se sale del tramo visible.',
        ],
      },
    ],
    storyBlocks: [
      {
        id: 'textil-story-1',
        eyebrow: 'Storytelling',
        title: 'Una ficha pensada para drops, reposiciones y tiradas cortas.',
        description: 'La lectura mezcla cantidad, acabado y archivo en un flujo unico para que el producto no dependa de una pagina distinta cada vez.',
        bullets: [
          'Escala por volumen sin ocultar el siguiente paso comercial.',
          'Pensada para prendas base, merchandising y activaciones.',
          'Preparada para crecer con variantes y acabados sin perder claridad.',
        ],
      },
    ],
    galleryFrames: [
      {
        id: 'textil-gallery-1',
        label: 'Visual editorial',
        title: 'Prenda hero',
        description: 'Vista principal para sudadera o camiseta con protagonismo de marca.',
      },
      {
        id: 'textil-gallery-2',
        label: 'Detalle',
        title: 'Acabado y tacto',
        description: 'Espacio reservado para textura, tinta o costura en enfoque macro.',
      },
    ],
    processSteps: [
      { id: 'brief', title: 'Seleccion', description: 'Elige base, tirada y acabado antes de pedir.' },
      { id: 'artwork', title: 'Archivo', description: 'Adjunta el arte final o deja una referencia para revisarlo contigo.' },
      { id: 'review', title: 'Revision', description: 'La comprobacion tecnica sigue separada del cierre de carrito.' },
    ],
    finalCta: {
      label: 'Cierre del producto',
      title: 'Listo para sumar prendas al carrito o saltar a una propuesta.',
      description: 'Todo queda listo para cerrar prendas, cantidades y archivo sin salir del mismo flujo.',
      primaryLabel: 'Ir al carrito',
      primaryHref: publicRoutes.carrito,
      secondaryLabel: 'Solicitar presupuesto',
      secondaryHref: getQuoteHref('textil'),
    },
    recommendations: [
      {
        id: 'dtf-upgrade',
        title: 'Combinar con DTI por metro',
        description: 'Prepara transferencias y prendas desde el mismo flujo comercial.',
        href: publicRoutes.dtf,
        priceLabel: 'Configurable',
        tag: 'Cross-sell',
      },
      {
        id: 'quote-brand-pack',
        title: 'Activacion completa',
        description: 'Si el proyecto necesita mas soportes, salta a presupuesto guiado.',
        href: getQuoteHref('textil'),
        priceLabel: 'Propuesta personalizada',
        tag: 'Expansion',
      },
    ],
  },
  papeleria: {
    key: 'papeleria',
    className: 'papeleria-page',
    sections: ['hero', 'gallery', 'configurator', 'specs', 'story', 'recommendations', 'faq', 'final-cta', 'sticky-summary'],
    faqTitle: 'FAQ papeleria',
    fallbackEyebrow: 'Papeleria',
    fallbackTitle: 'Papeleria de tirada corta y media.',
    fallbackDescription: 'Tarjetas y flyers con opciones claras de formato, papel y acabado antes de pedir.',
    heroStickerWords: ['print', 'run'],
    supportSections: [
      {
        label: 'Archivo y tirada',
        title: 'Confirma la cantidad antes de avanzar.',
        items: [
          'Las tiradas visibles ya estan preparadas para una lectura rapida del precio.',
          'Adjunta el PDF o una referencia si ya tienes el arte final.',
          'Si el proyecto necesita adaptacion o formato fuera de tramo, la via de presupuesto sigue abierta.',
        ],
      },
      {
        label: 'Para decidir',
        title: 'Usa el carrito para piezas cerradas.',
        items: [
          'Cuando la tirada encaja, puedes dejar la impresion preparada desde aqui.',
          'Las notas ayudan a aclarar acabados, caras y necesidades de diseno.',
          'El plazo se confirma al revisar archivo y acabados.',
        ],
      },
    ],
    storyBlocks: [
      {
        id: 'paper-story-1',
        eyebrow: 'Storytelling',
        title: 'Una ficha para tiradas claras, no para esconder precios.',
        description: 'Separa la lectura comercial del arte final y deja el pedido claro para papeleria premium, invitaciones o series cortas.',
        bullets: [
          'Tramos legibles sin tablas dispersas.',
          'Archivo opcional cuando todavia estas cerrando el diseño.',
          'Lista para sumar acabados editoriales sin perder lectura comercial.',
        ],
      },
    ],
    galleryFrames: [
      {
        id: 'paper-gallery-1',
        label: 'Visual editorial',
        title: 'Pila de piezas',
        description: 'Composicion principal para tarjetas, flyers o papeleria desplegada.',
      },
      {
        id: 'paper-gallery-2',
        label: 'Macro',
        title: 'Textura y tintas',
        description: 'Espacio reservado para detalle de gramaje o barniz.',
      },
    ],
    processSteps: [
      { id: 'quantity', title: 'Tirada', description: 'Se fija el tramo visible desde el primer paso.' },
      { id: 'artwork', title: 'Archivo', description: 'Adjunta el archivo final o deja una referencia para revisar el acabado contigo.' },
      { id: 'output', title: 'Salida', description: 'Carrito directo si la combinación es cerrada.' },
    ],
    finalCta: {
      label: 'Cierre del producto',
      title: 'Papeleria lista para carrito o propuesta adicional.',
      description: 'La plantilla ya soporta storytelling, galeria y comparativas sin recrear toda la página.',
      primaryLabel: 'Ir al carrito',
      primaryHref: publicRoutes.carrito,
      secondaryLabel: 'Solicitar presupuesto',
      secondaryHref: getQuoteHref('papeleria'),
    },
    recommendations: [
      {
        id: 'signage-bundle',
        title: 'Extender a carteleria',
        description: 'Completa la campaña con piezas de gran formato y propuesta guiada.',
        href: '#/carteleria',
        priceLabel: 'Proyecto',
        tag: 'Bundle',
      },
      {
        id: 'quote-print-pack',
        title: 'Proyecto mixto',
        description: 'Cruza papeleria con soportes a medida desde una propuesta comercial unificada.',
        href: getQuoteHref('papeleria'),
        priceLabel: 'Propuesta personalizada',
        tag: 'Expansion',
      },
    ],
  },
  materiales: {
    key: 'materiales',
    className: 'materiales-page',
    sections: ['hero', 'gallery', 'configurator', 'specs', 'story', 'recommendations', 'faq', 'final-cta', 'sticky-summary'],
    faqTitle: 'FAQ materiales',
    fallbackEyebrow: 'Materiales',
    fallbackTitle: 'Materiales y vinilos por m2.',
    fallbackDescription: 'Vinilos y materiales por metro cuadrado con lectura clara de medidas, soporte y siguiente paso comercial.',
    heroStickerWords: ['vinilo', 'm2'],
    supportSections: [
      {
        label: 'Medicion',
        title: 'Calcula una base clara por superficie.',
        items: [
          'Introduce la superficie total para obtener una referencia inmediata.',
          'Usa presupuesto cuando el proyecto incluya instalacion, homologacion o medicion real.',
          'El archivo es util, pero no obligatorio para una primera estimacion.',
        ],
      },
      {
        label: 'Siguiente paso',
        title: 'Material directo con salida comercial limpia.',
        items: [
          'Si el soporte encaja, puedes dejar el material preparado en el carrito.',
          'Los acabados complejos se revisan antes de fabricar.',
          'El plazo final depende de soporte, medidas y comprobacion tecnica.',
        ],
      },
    ],
    storyBlocks: [
      {
        id: 'materials-story-1',
        eyebrow: 'Storytelling',
        title: 'Soportes, vinilos y acabados dentro de una misma gramática visual.',
        description: 'Esta plantilla deja sitio a comparativas, texturas y overlays para que el producto no se reduzca a un simple formulario.',
        bullets: [
          'Base reutilizable para vinilos, rigid media o materiales tecnicos.',
          'Pensada para sumar muestras visuales y before/after sin perder claridad de compra.',
          'Compatible con pricing por m2 y nuevas variantes de soporte.',
        ],
      },
    ],
    galleryFrames: [
      {
        id: 'materials-gallery-1',
        label: 'Visual editorial',
        title: 'Lamina de material',
        description: 'Composicion principal para superficie, soporte o vinilo recortado.',
      },
      {
        id: 'materials-gallery-2',
        label: 'Detalle',
        title: 'Acabado del material',
        description: 'Espacio para textura, adhesivo o corte en primer plano.',
      },
    ],
    processSteps: [
      { id: 'measure', title: 'Superficie', description: 'El cálculo arranca desde el area del soporte.' },
      { id: 'support', title: 'Soporte', description: 'Se encuadra el material antes de cerrar el pedido.' },
      { id: 'review', title: 'Revision', description: 'El acabado técnico se valida después del carrito.' },
    ],
    finalCta: {
      label: 'Cierre del producto',
      title: 'Materiales listos para carrito o salto a propuesta.',
      description: 'La estructura ya permite sumar galerías de muestras y comparativas más complejas.',
      primaryLabel: 'Ir al carrito',
      primaryHref: publicRoutes.carrito,
      secondaryLabel: 'Solicitar presupuesto',
      secondaryHref: getQuoteHref('materiales'),
    },
    recommendations: [
      {
        id: 'wrap-upgrade',
        title: 'Escalar a wrapping',
        description: 'Si el material acaba en flota o fachada, continua con una propuesta a medida.',
        href: '#/rotulacion',
        priceLabel: 'Servicio',
        tag: 'Cross-sell',
      },
      {
        id: 'signage-direct',
        title: 'Completar con carteleria',
        description: 'Anade soportes impresos o piezas de gran formato al mismo proyecto.',
        href: '#/carteleria',
        priceLabel: 'Proyecto',
        tag: 'Bundle',
      },
    ],
  },
  accesorios: {
    key: 'accesorios',
    className: 'accesorios-page',
    sections: ['hero', 'gallery', 'configurator', 'specs', 'story', 'recommendations', 'faq', 'final-cta', 'sticky-summary'],
    faqTitle: 'FAQ accesorios',
    fallbackEyebrow: 'Accesorios',
    fallbackTitle: 'Accesorios con lectura rapida.',
    fallbackDescription: 'Llaveros, pegatinas y piezas pequeñas con configuración rápida y paso directo al carrito.',
    heroStickerWords: ['promo', 'pack'],
    supportSections: [
      {
        label: 'Preparacion',
        title: 'Tirada, formato y acabado sin rodeos.',
        items: [
          'Las tiradas visibles estan pensadas para promociones y series cortas.',
          'Adjunta archivo cuando corte, laminado o forma dependan del arte final.',
          'Las notas ayudan a indicar brillo, mate o referencias concretas.',
        ],
      },
      {
        label: 'Siguiente paso',
        title: 'Compra directa para lotes claros.',
        items: [
          'Cuando la tirada encaja, puedes pasar al carrito con una base clara.',
          'Los acabados especiales se validan antes de fabricar.',
          'El plazo final depende de cantidad, archivo y acabado.',
        ],
      },
    ],
    storyBlocks: [
      {
        id: 'accessories-story-1',
        eyebrow: 'Storytelling',
        title: 'Pequeño formato, misma exigencia premium.',
        description: 'La ficha trata accesorios con la misma exigencia visual que cualquier otro producto de la tienda.',
        bullets: [
          'Útil para stickers, llaveros y promo packs.',
          'Lista para bundles y sugerencias contextuales.',
          'Mantiene lectura rápida sin sacrificar estructura.',
        ],
      },
    ],
    galleryFrames: [
      {
        id: 'accessories-gallery-1',
        label: 'Visual editorial',
        title: 'Pack de producto',
        description: 'Vista principal para lote de accesorios, sticker sheet o pieza de branding.',
      },
      {
        id: 'accessories-gallery-2',
        label: 'Detalle',
        title: 'Acabado y corte',
        description: 'Espacio reservado para borde, laminado o troquel.',
      },
    ],
    processSteps: [
      { id: 'pick', title: 'Seleccion', description: 'Se elige el accesorio y la tirada visible.' },
      { id: 'file', title: 'Archivo', description: 'Se adjunta cuando el corte o la forma dependen del arte.' },
      { id: 'cart', title: 'Carrito', description: 'La linea queda lista para pasar a checkout con el resumen completo.' },
    ],
    finalCta: {
      label: 'Cierre del producto',
      title: 'Accesorios listos para carrito o ampliación de proyecto.',
      description: 'La ficha deja accesorios, cantidades y archivo listos para cerrar el pedido con rapidez.',
      primaryLabel: 'Ir al carrito',
      primaryHref: publicRoutes.carrito,
      secondaryLabel: 'Solicitar presupuesto',
      secondaryHref: getQuoteHref('otro'),
    },
    recommendations: [
      {
        id: 'paper-bundle',
        title: 'Completar con papeleria',
        description: 'Cruza promo packs con tarjetas, flyers o inserts de campaña.',
        href: '#/papeleria',
        priceLabel: 'Cross-sell',
        tag: 'Bundle',
      },
      {
        id: 'contact-upgrade',
        title: 'Proyecto especial',
        description: 'Si el accesorio se sale del tramo, pasamos a una propuesta personalizada.',
        href: getQuoteHref('otro'),
        priceLabel: 'Propuesta personalizada',
        tag: 'Servicio',
      },
    ],
  },
  carteleria: {
    key: 'carteleria',
    className: 'carteleria-page',
    sections: ['hero', 'gallery', 'configurator', 'specs', 'story', 'recommendations', 'faq', 'final-cta', 'sticky-summary'],
    faqTitle: 'FAQ carteleria',
    fallbackEyebrow: 'Carteleria',
    fallbackTitle: 'Carteleria y gran formato.',
    fallbackDescription: 'Carteleria y gran formato para proyectos que dependen de medidas, confeccion y uso final.',
    heroStickerWords: ['signage', 'big-format'],
    supportSections: [
      {
        label: 'Que preparar',
        title: 'Medidas, uso y acabado cambian la propuesta.',
        items: [
          'Indica ancho, alto y si necesitas ojales, refuerzos o confeccion.',
          'Adjunta una referencia visual si ya existe arte final o boceto.',
          'Si la instalacion o el soporte son clave, dejalo indicado desde el inicio.',
        ],
      },
      {
        label: 'Siguiente paso',
        title: 'Proyecto preparado para presupuesto serio.',
        items: [
          'La propuesta final se ajusta tras revisar material, confeccion y uso real.',
          'El servicio no pasa a compra directa porque depende de medidas y acabado.',
          'Tras enviar la solicitud, el equipo comercial responde con una propuesta adaptada.',
        ],
      },
    ],
    storyBlocks: [
      {
        id: 'signage-story-1',
        eyebrow: 'Storytelling',
        title: 'Una base escalable para gran formato, no solo un formulario de presupuesto.',
        description: 'Esta capa permite combinar referencias visuales, proceso y comparativas sin rehacer cada servicio a mano.',
        bullets: [
          'Pensada para lonas, paneles y proyectos de instalación.',
          'Preparada para antes/después y overlays de medidas.',
          'Separa el valor comercial de la mecánica del presupuesto.',
        ],
      },
    ],
    galleryFrames: [
      {
        id: 'signage-gallery-1',
        label: 'Visual editorial',
        title: 'Lona o panel hero',
        description: 'Vista principal para pieza de gran formato en contexto real.',
      },
      {
        id: 'signage-gallery-2',
        label: 'Detalle',
        title: 'Confección y soporte',
        description: 'Espacio para ojales, bastidor o anclaje en primer plano.',
      },
    ],
    processSteps: [
      { id: 'measure', title: 'Medidas', description: 'Se fija tamaño, uso y soporte previsto.' },
      { id: 'scope', title: 'Alcance', description: 'La propuesta toma forma según confección e instalación.' },
      { id: 'quote', title: 'Propuesta', description: 'El cierre se hace con una propuesta ajustada a medidas, soporte y montaje.' },
    ],
    finalCta: {
      label: 'Cierre del producto',
      title: 'Carteleria preparada para avanzar a propuesta.',
      description: 'La experiencia deja lista la propuesta sin perder contexto de medidas, soporte y uso final.',
      primaryLabel: 'Solicitar presupuesto',
      primaryHref: getQuoteHref('carteleria'),
      secondaryLabel: 'Contactar',
      secondaryHref: publicRoutes.contacto,
    },
    recommendations: [
      {
        id: 'materials-upgrade',
        title: 'Ver materiales y vinilos',
        description: 'Si el proyecto necesita soportes definidos, abre la capa de materiales.',
        href: '#/materiales',
        priceLabel: 'Referencia',
        tag: 'Support',
      },
      {
        id: 'wrap-cross',
        title: 'Cruzar con rotulación',
        description: 'Escala a flota o fachada cuando el soporte sale del gran formato estándar.',
        href: '#/rotulacion',
        priceLabel: 'Servicio',
        tag: 'Expansion',
      },
    ],
  },
  rotulacion: {
    key: 'rotulacion',
    className: 'rotulacion-page',
    sections: ['hero', 'gallery', 'configurator', 'specs', 'story', 'recommendations', 'faq', 'final-cta', 'sticky-summary'],
    faqTitle: 'FAQ rotulacion',
    fallbackEyebrow: 'Rotulacion / vehiculos / flotas',
    fallbackTitle: 'Convierte cada trayecto en publicidad.',
    fallbackDescription:
      'Rotulacion premium para furgonetas, vehiculos de empresa, escaparates y proyectos personalizados en Barcelona, Blanes, Girona y Costa Brava.',
    heroStickerWords: ['wrap', 'fleet'],
    supportSections: [
      {
        label: 'Antes de pedir',
        title: 'Define cobertura, tipo de vehiculo y objetivo comercial.',
        items: [
          'La referencia visible sirve para situar el proyecto sin empezar la conversacion desde cero.',
          'Puedes avanzar aunque todavia no tengas el arte final cerrado si ya sabes el tipo de cobertura.',
          'La propuesta final confirma materiales, instalacion, calendario y zona de trabajo real.',
        ],
      },
      {
        label: 'Siguiente paso',
        title: 'Propuesta adaptada al vehiculo y a la marca.',
        items: [
          'La rotulacion no pasa a compra directa porque depende de cobertura, montaje y condicion real del soporte.',
          'El siguiente paso recoge medidas, referencias, ciudad y tipo de negocio para cerrar mejor la propuesta.',
          'La comprobacion tecnica se hace antes de fabricar e instalar para evitar errores de produccion.',
        ],
      },
    ],
    storyBlocks: [
      {
        id: 'wrap-story-1',
        eyebrow: 'Storytelling',
        title: 'Rotulacion pensada para negocio, flota y visibilidad diaria.',
        description:
          'La experiencia separa visual, configuracion y propuesta para que la lectura siga siendo clara incluso en proyectos de cobertura amplia.',
        bullets: [
          'Valida para furgonetas, vehiculos de empresa, escaparates y flotas comerciales.',
          'Lista para sumar proyectos reales y bloques visuales mas editoriales sin rehacer la base.',
          'Mantiene clara la diferencia entre rango orientativo, revision tecnica y propuesta final.',
        ],
      },
    ],
    galleryFrames: [
      {
        id: 'wrap-gallery-1',
        label: 'Visual editorial',
        title: 'Vehiculo hero',
        description: 'Vista principal para furgoneta o vehiculo de empresa con cobertura de marca visible.',
      },
      {
        id: 'wrap-gallery-2',
        label: 'Detalle',
        title: 'Cobertura y remates',
        description: 'Espacio reservado para remates, union de piezas, textura vinilo y lectura de marca.',
      },
    ],
    processSteps: [
      { id: 'coverage', title: 'Cobertura', description: 'Se define si el proyecto es comercial, parcial, integral o para flota.' },
      { id: 'vehicle', title: 'Vehiculo', description: 'Se ordenan medidas, tipo de soporte, ciudad y referencias visuales.' },
      { id: 'proposal', title: 'Propuesta', description: 'La revision tecnica aterriza materiales, montaje, calendario y presupuesto.' },
    ],
    finalCta: {
      label: 'Cierre del producto',
      title: 'Tu vehiculo puede trabajar incluso cuando esta aparcado.',
      description:
        'Rotulacion premium para negocios y marcas que quieren destacar con una propuesta clara antes de fabricar e instalar.',
      primaryLabel: 'Ver proyectos',
      primaryHref: publicRoutes.portafolio,
      secondaryLabel: 'Solicitar presupuesto',
      secondaryHref: getQuoteHref('rotulacion'),
    },
    recommendations: [
      {
        id: 'fleet-signage',
        title: 'Escalar a senaletica y escaparates',
        description: 'Amplia la rotulacion del vehiculo con piezas para punto de venta, cristal o fachada.',
        href: '#/servicios/carteleria',
        priceLabel: 'Expansion',
        tag: 'Bundle',
      },
      {
        id: 'vehicle-materials',
        title: 'Revisar materiales y acabados',
        description: 'Consulta soportes, laminados y acabados antes de cerrar una propuesta de wrapping o cobertura parcial.',
        href: '#/materiales',
        priceLabel: 'Materiales',
        tag: 'Support',
      },
    ],
  },
  neones: {
    key: 'neones',
    className: 'neones-page',
    sections: ['hero', 'gallery', 'configurator', 'specs', 'story', 'recommendations', 'faq', 'final-cta', 'sticky-summary'],
    faqTitle: 'FAQ neones',
    fallbackEyebrow: 'Neones',
    fallbackTitle: 'Neones y carteleria luminosa.',
    fallbackDescription: 'Neones y rotulos decorativos sujetos a medida, colores y complejidad de diseno.',
    heroStickerWords: ['neon', 'light'],
    supportSections: [
      {
        label: 'Referencia visual',
        title: 'Forma, medida y contexto marcan la propuesta.',
        items: [
          'Adjunta logo, boceto o referencia cuando la pieza ya tenga direccion visual.',
          'Si todavia estas definiendo el proyecto, usa detalles y medidas aproximadas.',
          'La instalacion y la complejidad final se confirman durante la propuesta.',
        ],
      },
      {
        label: 'Siguiente paso',
        title: 'Proyecto orientado a propuesta personalizada.',
        items: [
          'Esta pagina sirve para situar el rango y preparar una solicitud clara.',
          'Los colores, anclajes y materiales se revisan antes de cerrar fabricacion.',
          'El equipo comercial responde con una propuesta ajustada al proyecto real.',
        ],
      },
    ],
    storyBlocks: [
      {
        id: 'neon-story-1',
        eyebrow: 'Storytelling',
        title: 'Una ficha lista para branding luminoso con más capas visuales.',
        description: 'La experiencia deja espacio para referencias visuales de luz y acabado sin entorpecer la lectura comercial del proyecto.',
        bullets: [
          'Base válida para neones de interior, eventos y retail.',
          'Pensada para sumar visuales luminosos y referencias de acabado con control.',
          'Mantiene el producto indexable y editable por zonas.',
        ],
      },
    ],
    galleryFrames: [
      {
        id: 'neon-gallery-1',
        label: 'Visual editorial',
        title: 'Rótulo hero',
        description: 'Vista principal para pieza luminosa en pared o escaparate.',
      },
      {
        id: 'neon-gallery-2',
        label: 'Detalle',
        title: 'Tubo, soporte y luz',
        description: 'Espacio para conexiones, glow y anclaje en primer plano.',
      },
    ],
    processSteps: [
      { id: 'concept', title: 'Concepto', description: 'Se define mensaje, escala y contexto de uso.' },
      { id: 'specs', title: 'Especificación', description: 'La propuesta recoge colores, materiales y montaje.' },
      { id: 'proposal', title: 'Propuesta', description: 'La salida se resuelve con una propuesta personalizada y el alcance del proyecto bien definido.' },
    ],
    finalCta: {
      label: 'Cierre del producto',
      title: 'Neones listos para una siguiente iteración visual más rica.',
      description: 'La ficha deja claro el alcance del proyecto y prepara la propuesta sin ruido innecesario.',
      primaryLabel: 'Solicitar presupuesto',
      primaryHref: getQuoteHref('neones'),
      secondaryLabel: 'Contactar',
      secondaryHref: publicRoutes.contacto,
    },
    recommendations: [
      {
        id: 'signage-cross',
        title: 'Cruzar con carteleria',
        description: 'Si el proyecto necesita piezas impresas o soportes físicos, abre gran formato.',
        href: '#/carteleria',
        priceLabel: 'Proyecto',
        tag: 'Bundle',
      },
      {
        id: 'branding-contact',
        title: 'Proyecto integral',
        description: 'Combina iluminación, rotulación y soportes desde una propuesta única.',
        href: publicRoutes.contacto,
        priceLabel: 'Consultoría',
        tag: 'Expansion',
      },
    ],
  },
}
