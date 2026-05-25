import type { DiscoverabilityLink } from '../types/discoverability'

export const internalLinkGraph: Record<string, DiscoverabilityLink[]> = {
  rotulacion: [
    { id: 'il-rot-contact', title: 'Solicitar propuesta de rotulacion', description: 'Entrada comercial directa para proyectos con medicion o instalacion.', href: '#/contacto' },
    { id: 'il-rot-portfolio', title: 'Ver proyectos de rotulacion', description: 'Lectura visual de casos y acabados.', href: '#/portafolio' },
    { id: 'il-rot-carteleria', title: 'Explorar carteleria y escaparates', description: 'Conecta vehiculo y punto de venta.', href: '#/servicios/carteleria' },
    { id: 'il-rot-materials', title: 'Ver materiales y soportes', description: 'Puente a vinilo, laminado y acabados.', href: '#/materiales' },
  ],
  dtf: [
    { id: 'il-dtf-guide', title: 'Preparar archivo DTF', description: 'Checklist previo a imprimir.', href: '#/guia' },
    { id: 'il-dtf-textil', title: 'Explorar textil personalizado', description: 'Soportes finales para aplicar DTF.', href: '#/producto/textil' },
    { id: 'il-dtf-contact', title: 'Pedir ayuda con el archivo', description: 'Consulta tecnica o comercial antes de producir.', href: '#/contacto' },
  ],
  catalogo: [
    { id: 'il-cat-rot', title: 'Ir a rotulacion', description: 'Hub principal de vehiculos y branding visible.', href: '#/servicios/rotulacion' },
    { id: 'il-cat-dtf', title: 'Ir a DTF por metro', description: 'Configuracion directa para impresion textil.', href: '#/producto/dtf' },
    { id: 'il-cat-guide', title: 'Abrir guia de archivos', description: 'Ayuda tecnica antes de configurar o pedir.', href: '#/guia' },
  ],
}
