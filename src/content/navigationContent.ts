import { getPublicCtaHref, getPublicHref } from '../lib/navigation'

export const navigationContent = {
  brandLabel: 'RIDAOSPRINT',
  mainLinks: [
    { href: getPublicHref('home'), label: 'Inicio', route: 'home' as const },
    { href: getPublicCtaHref('catalogo'), label: 'Catalogo', route: 'catalogo' as const },
    { href: getPublicCtaHref('dtf'), label: 'DTI por metro', route: 'dtf' as const },
    { href: getPublicHref('rotulacion'), label: 'Rotulacion', route: 'rotulacion' as const },
    { href: getPublicHref('textil'), label: 'Textil', route: 'textil' as const },
    { href: '#/mi-cuenta', label: 'Mi cuenta', route: 'miCuenta' as const },
    { href: getPublicCtaHref('contacto'), label: 'Contacto', route: 'contacto' as const },
    { href: getPublicCtaHref('carrito'), label: 'Carrito', route: 'carrito' as const },
  ],
}
