import type { LocalServiceHub } from '../types/discoverability'

export const localServiceHubs: LocalServiceHub[] = [
  {
    id: 'barcelona-services',
    title: 'Servicios populares en Barcelona',
    description: 'Rotulacion comercial, DTF y branding impreso para negocios y vehiculos de empresa.',
    locality: 'Barcelona',
    links: [
      { id: 'ls-bar-rot', title: 'Rotulacion de furgonetas Barcelona', description: 'Vehiculos de empresa y cobertura comercial.', href: '#/servicios/rotulacion', tag: 'Local' },
      { id: 'ls-bar-dtf', title: 'DTF Barcelona', description: 'Impresion DTF por metro para textil y uniformes.', href: '#/producto/dtf', tag: 'DTF' },
      { id: 'ls-bar-cards', title: 'Tarjetas empresa Barcelona', description: 'Papeleria para ventas y visitas.', href: '#/producto/papeleria', tag: 'Print' },
    ],
  },
  {
    id: 'blanes-services',
    title: 'Servicios populares en Blanes',
    description: 'Cobertura local para vehiculos, escaparates y produccion impresa para negocio de proximidad.',
    locality: 'Blanes',
    links: [
      { id: 'ls-bla-rot', title: 'Rotulacion de vehiculos Blanes', description: 'Presencia comercial para calle y reparto.', href: '#/servicios/rotulacion', tag: 'Local' },
      { id: 'ls-bla-vinyl', title: 'Vinilos comerciales Blanes', description: 'Cristal, escaparate y senaletica.', href: '#/servicios/carteleria', tag: 'Retail' },
      { id: 'ls-bla-dtf', title: 'DTI Blanes', description: 'Captura de demanda local para DTF por metro.', href: '#/producto/dtf', tag: 'Intent' },
    ],
  },
  {
    id: 'girona-costa-brava-services',
    title: 'Servicios populares en Girona y Costa Brava',
    description: 'Rotulacion comercial, flotas y vinilos para empresas con cobertura territorial clara.',
    locality: 'Girona / Costa Brava',
    links: [
      { id: 'ls-gir-flotas', title: 'Rotulacion de flotas Girona', description: 'Cobertura repetible para empresas.', href: '#/servicios/rotulacion', tag: 'Fleet' },
      { id: 'ls-gir-vinyl', title: 'Vinilos para empresas Girona', description: 'Escaparate y visibilidad retail.', href: '#/servicios/carteleria', tag: 'Retail' },
      { id: 'ls-gir-print', title: 'Impresion personalizada Girona', description: 'Papeleria, pegatinas y branding fisico.', href: '#/catalogo', tag: 'Print' },
    ],
  },
]
