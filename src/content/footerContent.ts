import { getPublicCtaHref } from '../lib/navigation'

export const footerContent = {
  description:
    'Impresion personalizada, DTI por metro y rotulacion profesional para marcas, negocios y producciones a medida.',
  links: [
    { href: '#/mi-cuenta', label: 'Mi cuenta' },
    { href: getPublicCtaHref('guia'), label: 'Guia de archivos' },
    { href: '#/legal', label: 'Legal' },
    { href: getPublicCtaHref('contacto'), label: 'Contacto' },
  ],
}
