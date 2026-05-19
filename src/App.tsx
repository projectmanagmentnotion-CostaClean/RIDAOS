import { useEffect, useRef, useState, type ReactNode } from 'react'
import './App.css'
import CustomersPage from './admin/pages/CustomersPage'
import DashboardPage from './admin/pages/DashboardPage'
import OrderDetailPage from './admin/pages/OrderDetailPage'
import OrdersPage from './admin/pages/OrdersPage'
import ProductionPage from './admin/pages/ProductionPage'
import UploadsPage from './admin/pages/UploadsPage'
import CustomCursor from './components/CustomCursor'
import NotFoundPage from './components/NotFoundPage'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import AccesoriosPage from './pages/AccesoriosPage'
import Carrito from './pages/Carrito'
import CarteleriaPage from './pages/CarteleriaPage'
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
import MotionTest from './pages/MotionTest'
import NeonesPage from './pages/NeonesPage'
import PapeleriaPage from './pages/PapeleriaPage'
import Portafolio from './pages/Portafolio'
import RotulacionPage from './pages/RotulacionPage'
import SolicitarPresupuesto from './pages/SolicitarPresupuesto'
import TextilPage from './pages/TextilPage'
import { applySEO } from './lib/seo'
import { initSmoothScroll } from './lib/smoothScroll'
import { refreshScrollNarrative, syncScrollTriggerWithLenis } from './lib/animations'
import { getPublicCtaHref, getPublicHref } from './lib/navigation'
import { getCurrentHashRoute, navigateToHashRoute, normalizeHashRoute } from './lib/hashRouting'

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
  | 'adminOrders'
  | 'adminOrderDetail'
  | 'adminUploads'
  | 'adminCustomers'
  | 'adminProduction'
  | 'presupuesto'
  | 'motionTest'
  | 'notFound'
  | 'textil'
  | 'papeleria'
  | 'carteleria'
  | 'materiales'
  | 'accesorios'
  | 'rotulacion'
  | 'neones'

const routes: Record<string, RouteKey> = {
  [getPublicHref('home')]: 'home',
  [getPublicCtaHref('catalogo')]: 'catalogo',
  [getPublicCtaHref('dtf')]: 'dtf',
  '#/dtf': 'dtf',
  [getPublicHref('textil')]: 'textil',
  '#/textil': 'textil',
  [getPublicHref('papeleria')]: 'papeleria',
  '#/papeleria': 'papeleria',
  [getPublicHref('carteleria')]: 'carteleria',
  '#/carteleria': 'carteleria',
  [getPublicHref('materiales')]: 'materiales',
  '#/materiales': 'materiales',
  [getPublicHref('accesorios')]: 'accesorios',
  '#/accesorios': 'accesorios',
  [getPublicHref('rotulacion')]: 'rotulacion',
  [getPublicHref('neones')]: 'neones',
  [getPublicCtaHref('carrito')]: 'carrito',
  '#/checkout': 'checkout',
  [getPublicCtaHref('guia')]: 'guia',
  '#/guia-archivos': 'guia',
  '#/portafolio': 'portafolio',
  [getPublicCtaHref('contacto')]: 'contacto',
  '#/legal': 'legal',
  '#/mi-cuenta': 'miCuenta',
  '#/mi-cuenta/pedidos': 'misPedidos',
  '#/mi-cuenta/pedidos/demo': 'detallePedido',
  '#/mi-cuenta/archivos': 'historialArchivos',
  '#/admin': 'admin',
  '#/admin/orders': 'adminOrders',
  '#/admin/uploads': 'adminUploads',
  '#/admin/customers': 'adminCustomers',
  '#/admin/production': 'adminProduction',
  '#/admin/pedidos': 'adminOrders',
  '#/admin/archivos': 'adminUploads',
  [getPublicCtaHref('presupuesto')]: 'presupuesto',
  '#/solicitar-presupuesto': 'presupuesto',
  '#/motion-test': 'motionTest',
}

const navigation = [
  { href: getPublicHref('home'), label: 'Home', route: 'home' as const },
  { href: getPublicCtaHref('catalogo'), label: 'Catalogo', route: 'catalogo' as const },
  { href: getPublicCtaHref('dtf'), label: 'DTF por metro', route: 'dtf' as const },
  { href: getPublicHref('textil'), label: 'Textil', route: 'textil' as const },
  { href: '#/mi-cuenta', label: 'Mi cuenta', route: 'miCuenta' as const },
  { href: getPublicCtaHref('contacto'), label: 'Contacto', route: 'contacto' as const },
  { href: getPublicCtaHref('carrito'), label: 'Carrito', route: 'carrito' as const },
]

const buildMarker = `Ridaos build: ${__RIDAOS_BUILD_HASH__}`

const pageComponents: Record<RouteKey, ReactNode> = {
  home: <Home />,
  catalogo: <Catalogo />,
  dtf: <DTFPage />,
  textil: <TextilPage />,
  papeleria: <PapeleriaPage />,
  carteleria: <CarteleriaPage />,
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
  admin: <DashboardPage />,
  adminOrders: <OrdersPage />,
  adminOrderDetail: <OrderDetailPage />,
  adminUploads: <UploadsPage />,
  adminCustomers: <CustomersPage />,
  adminProduction: <ProductionPage />,
  presupuesto: <SolicitarPresupuesto />,
  motionTest: <MotionTest />,
  notFound: <NotFoundPage />,
}

function getRouteFromHash(hash: string): RouteKey {
  const normalizedHash = normalizeHashRoute(hash)

  if (!normalizedHash || normalizedHash === '#') {
    return 'home'
  }

  if (normalizedHash.startsWith('#/admin/orders/')) {
    return 'adminOrderDetail'
  }

  if (normalizedHash === '#/admin/pedidos/demo') {
    return 'adminOrderDetail'
  }

  return routes[normalizedHash] ?? 'notFound'
}

function isNavigationActive(route: RouteKey, itemRoute: RouteKey) {
  if (itemRoute === 'miCuenta') {
    return route === 'miCuenta' || route === 'misPedidos' || route === 'detallePedido' || route === 'historialArchivos'
  }

  if (itemRoute === 'admin') {
    return (
      route === 'admin' ||
      route === 'adminOrders' ||
      route === 'adminOrderDetail' ||
      route === 'adminUploads' ||
      route === 'adminCustomers' ||
      route === 'adminProduction'
    )
  }

  return route === itemRoute
}

function App() {
  const [currentHashRoute, setCurrentHashRoute] = useState(() => getCurrentHashRoute())
  const [route, setRoute] = useState<RouteKey>(() => getRouteFromHash(currentHashRoute))
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const [isHeaderSolid, setIsHeaderSolid] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const smoothScroll = initSmoothScroll()
    syncScrollTriggerWithLenis()

    if (!window.location.hash || window.location.hash === '#') {
      navigateToHashRoute('#/')
    }

    const syncRoute = () => {
      const nextHashRoute = getCurrentHashRoute()
      setCurrentHashRoute(nextHashRoute)
      setRoute(getRouteFromHash(nextHashRoute))
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
    applySEO(currentHashRoute)
  }, [currentHashRoute])

  useEffect(() => {
    let frame = 0

    const syncHeader = () => {
      frame = 0
      const currentY = window.scrollY
      const delta = currentY - lastScrollYRef.current
      const nearTop = currentY < 48

      setIsHeaderSolid(currentY > 18)

      if (nearTop) {
        setIsHeaderHidden(false)
      } else if (delta > 10 && currentY > 140) {
        setIsHeaderHidden(true)
      } else if (delta < -10) {
        setIsHeaderHidden(false)
      }

      lastScrollYRef.current = currentY
    }

    const requestHeaderSync = () => {
      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(syncHeader)
    }

    syncHeader()
    window.addEventListener('scroll', requestHeaderSync, { passive: true })

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
      window.removeEventListener('scroll', requestHeaderSync)
    }
  }, [])

  return (
    <div className="app-shell">
      <CustomCursor />
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <div className="app-grid" aria-hidden="true" />
      <header
        className={`site-header${route === 'home' ? ' site-header--overlay' : ''}${
          isHeaderHidden ? ' site-header--hidden' : ''
        }${isHeaderSolid ? ' site-header--solid' : ''}`}
      >
        <nav className="site-nav" aria-label="Principal">
          <a aria-label="Ir a la pagina de inicio" className="brand" data-cursor="interactive" href={getPublicHref('home')}>
            RIDAOSPRINT
          </a>
          <div className="nav-links">
            {navigation.map((item) => (
              <a
                aria-current={isNavigationActive(route, item.route) ? 'page' : undefined}
                className={isNavigationActive(route, item.route) ? 'is-active' : undefined}
                data-cursor="interactive"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className={`page-shell${route === 'home' ? ' page-shell--home' : ''}`} id="main-content" tabIndex={-1}>
        <RouteErrorBoundary fallback={<NotFoundPage />}>
          {pageComponents[route] ?? <NotFoundPage />}
        </RouteErrorBoundary>
      </main>

      <footer className="site-footer">
        <p>RidaosPrint centraliza catalogo, configuracion y seguimiento del pedido en un mismo recorrido.</p>
        <div className="footer-links">
          <a data-cursor="interactive" href="#/mi-cuenta">Mi cuenta</a>
          <a data-cursor="interactive" href={getPublicCtaHref('guia')}>Guia de archivos</a>
          <a data-cursor="interactive" href="#/legal">Legal</a>
          <a data-cursor="interactive" href={getPublicCtaHref('contacto')}>Contacto</a>
        </div>
        <p className="build-marker">{buildMarker}</p>
      </footer>
    </div>
  )
}

export default App
