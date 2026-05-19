import { getPublicCtaHref } from '../lib/navigation'

export const footerContent = {
  description:
    'RidaosPrint centraliza catalogo, configuracion y seguimiento del pedido en un mismo recorrido.',
  links: [
    { href: '#/mi-cuenta', label: 'Mi cuenta' },
    { href: getPublicCtaHref('guia'), label: 'Guia de archivos' },
    { href: '#/legal', label: 'Legal' },
    { href: getPublicCtaHref('contacto'), label: 'Contacto' },
  ],
}
