import { useEffect, useState, type ReactNode } from 'react'
import './App.css'
import CustomCursor from './components/CustomCursor'
import FrameSequenceIntro from './components/FrameSequenceIntro'
import AdminArchivos from './pages/AdminArchivos'
import AdminDashboard from './pages/AdminDashboard'
import AdminDetallePedido from './pages/AdminDetallePedido'
import AdminPedidos from './pages/AdminPedidos'
import AccesoriosPage from './pages/AccesoriosPage'
import Carrito from './pages/Carrito'
import Catalogo from './pages/Catalogo'
import Checkout from './pages/Checkout'
import Contacto from './pages/Contacto'
import DTFPage from './pages/DTFPage'
import DetallePedido from './pages/DetallePedido'
import GuiaArchivos from './pages/GuiaArchivos'
import HistorialArchivos from './pages/HistorialArchivos'
import Home from './pages/Home'
import Legal from './pages/Legal'
import MaterialesPage from './pages/MaterialesPage'
import MiCuenta from './pages/MiCuenta'
import MisPedidos from './pages/MisPedidos'
import NeonesPage from './pages/NeonesPage'
import PapeleriaPage from './pages/PapeleriaPage'
import Portafolio from './pages/Portafolio'
import RotulacionPage from './pages/RotulacionPage'
import SolicitarPresupuesto from './pages/SolicitarPresupuesto'
import TextilPage from './pages/TextilPage'
import { applySEO } from './lib/seo'
import { initSmoothScroll } from './lib/smoothScroll'
import { refreshScrollNarrative, syncScrollTriggerWithLenis } from './lib/animations'

type RouteKey =
  | 'home'
  | 'catalogo'
  | 'dtf'
  | 'carrito'
  | 'checkout'
  | 'guia'
  | 'portafolio'
  | 'contacto'
  | 'legal'
  | 'miCuenta'
  | 'misPedidos'
  | 'detallePedido'
  | 'historialArchivos'
  | 'admin'
  | 'adminPedidos'
  | 'adminDetallePedido'
  | 'adminArchivos'
  | 'presupuesto'
  | 'textil'
  | 'papeleria'
  | 'materiales'
  | 'accesorios'
  | 'rotulacion'
  | 'neones'

const routes: Record<string, RouteKey> = {
  '#/': 'home',
  '#/catalogo': 'catalogo',
  '#/producto/dtf': 'dtf',
  '#/producto/textil': 'textil',
  '#/producto/papeleria': 'papeleria',
  '#/producto/materiales': 'materiales',
  '#/producto/accesorios': 'accesorios',
  '#/servicios/rotulacion': 'rotulacion',
  '#/servicios/neones': 'neones',
  '#/carrito': 'carrito',
  '#/checkout': 'checkout',
  '#/guia': 'guia',
  '#/portafolio': 'portafolio',
  '#/contacto': 'contacto',
  '#/legal': 'legal',
  '#/mi-cuenta': 'miCuenta',
  '#/mi-cuenta/pedidos': 'misPedidos',
  '#/mi-cuenta/pedidos/demo': 'detallePedido',
  '#/mi-cuenta/archivos': 'historialArchivos',
  '#/admin': 'admin',
  '#/admin/pedidos': 'adminPedidos',
  '#/admin/pedidos/demo': 'adminDetallePedido',
  '#/admin/archivos': 'adminArchivos',
  '#/presupuesto': 'presupuesto',
}

const navigation = [
  { href: '#/', label: 'Home', route: 'home' as const },
  { href: '#/catalogo', label: 'Catalogo', route: 'catalogo' as const },
  { href: '#/producto/dtf', label: 'DTF por metro', route: 'dtf' as const },
  { href: '#/producto/textil', label: 'Textil', route: 'textil' as const },
  { href: '#/mi-cuenta', label: 'Mi cuenta', route: 'miCuenta' as const },
  { href: '#/admin', label: 'Admin', route: 'admin' as const },
  { href: '#/contacto', label: 'Contacto', route: 'contacto' as const },
  { href: '#/carrito', label: 'Carrito', route: 'carrito' as const },
]

const pageComponents: Record<RouteKey, ReactNode> = {
  home: <Home />,
  catalogo: <Catalogo />,
  dtf: <DTFPage />,
  textil: <TextilPage />,
  papeleria: <PapeleriaPage />,
  materiales: <MaterialesPage />,
  accesorios: <AccesoriosPage />,
  rotulacion: <RotulacionPage />,
  neones: <NeonesPage />,
  carrito: <Carrito />,
  checkout: <Checkout />,
  guia: <GuiaArchivos />,
  portafolio: <Portafolio />,
  contacto: <Contacto />,
  legal: <Legal />,
  miCuenta: <MiCuenta />,
  misPedidos: <MisPedidos />,
  detallePedido: <DetallePedido />,
  historialArchivos: <HistorialArchivos />,
  admin: <AdminDashboard />,
  adminPedidos: <AdminPedidos />,
  adminDetallePedido: <AdminDetallePedido />,
  adminArchivos: <AdminArchivos />,
  presupuesto: <SolicitarPresupuesto />,
}

function getRouteFromHash(hash: string): RouteKey {
  const normalizedHash = hash.split('?')[0]

  if (!normalizedHash || normalizedHash === '#') {
    return 'home'
  }

  return routes[normalizedHash] ?? 'home'
}

function isNavigationActive(route: RouteKey, itemRoute: (typeof navigation)[number]['route']) {
  if (itemRoute === 'miCuenta') {
    return route === 'miCuenta' || route === 'misPedidos' || route === 'detallePedido' || route === 'historialArchivos'
  }

  if (itemRoute === 'admin') {
    return (
      route === 'admin' ||
      route === 'adminPedidos' ||
      route === 'adminDetallePedido' ||
      route === 'adminArchivos'
    )
  }

  return route === itemRoute
}

function App() {
  const [route, setRoute] = useState<RouteKey>(() => getRouteFromHash(window.location.hash))

  useEffect(() => {
    const smoothScroll = initSmoothScroll()
    syncScrollTriggerWithLenis()

    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#/'
    }

    const syncRoute = () => {
      setRoute(getRouteFromHash(window.location.hash))
    }

    syncRoute()
    window.addEventListener('hashchange', syncRoute)

    return () => {
      window.removeEventListener('hashchange', syncRoute)
      smoothScroll.destroy()
    }
  }, [])

  useEffect(() => {
    const smoothScroll = initSmoothScroll()
    smoothScroll.scrollToTop(smoothScroll.isReducedMotion())
    refreshScrollNarrative()
  }, [route])

  useEffect(() => {
    applySEO(window.location.hash || '#/')
  }, [route])

  return (
    <div className="app-shell">
      <CustomCursor />
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <div className="app-grid" aria-hidden="true" />
      <div className="scroll-progress-shell" aria-hidden="true">
        <div className="scroll-progress-rail">
          <div className="scroll-progress-fill" data-scroll-progress />
        </div>
      </div>
      <header className="site-header">
        <nav className="site-nav" aria-label="Principal">
          <a aria-label="Ir a la pagina de inicio" className="brand" data-cursor="invert" href="#/">
            RIDAOSPRINT
          </a>
          <div className="nav-links">
            {navigation.map((item) => (
              <a
                aria-current={isNavigationActive(route, item.route) ? 'page' : undefined}
                className={isNavigationActive(route, item.route) ? 'is-active' : undefined}
                data-cursor="invert"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {route === 'home' ? <FrameSequenceIntro /> : null}

      <main className="page-shell" id="main-content" tabIndex={-1}>
        {pageComponents[route]}
      </main>

      <footer className="site-footer">
        <p>Base visual RidaosPrint para catalogo, configuracion y checkout.</p>
        <div className="footer-links">
          <a data-cursor="invert" href="#/mi-cuenta">Mi cuenta</a>
          <a data-cursor="invert" href="#/admin">Admin</a>
          <a data-cursor="invert" href="#/guia">Guia de archivos</a>
          <a data-cursor="invert" href="#/legal">Legal</a>
        </div>
      </footer>
    </div>
  )
}

export default App
