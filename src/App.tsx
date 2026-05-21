import { Suspense, lazy, useEffect, useRef, useState, type ComponentType } from 'react'
import './App.css'
import NotFoundPage from './components/NotFoundPage'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import PremiumCursor from './components/system/PremiumCursor'
import Home from './pages/Home'
import { applySEO } from './lib/seo'
import { initSmoothScroll } from './lib/smoothScroll'
import { refreshScrollNarrative, syncScrollTriggerWithLenis } from './lib/animations'
import { getPublicCtaHref, getPublicHref } from './lib/navigation'
import { getCurrentHashRoute, navigateToHashRoute, normalizeHashRoute } from './lib/hashRouting'
import { footerContent, navigationContent } from './content'
import { useCmsPreviewDocument } from './features/cms-preview'

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
  | 'adminContent'
  | 'adminService'
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
  '#/admin/content': 'adminContent',
  '#/admin/service': 'adminService',
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

/**
 * Editable Zone: NAV_MAIN
 * Content: src/content/navigationContent.ts
 * Visual component: src/App.tsx
 */
const buildMarker = `Ridaos build: ${__RIDAOS_BUILD_HASH__}`
const Catalogo = lazy(() => import('./pages/Catalogo'))
const DTFPage = lazy(() => import('./pages/DTFPage'))
const TextilPage = lazy(() => import('./pages/TextilPage'))
const PapeleriaPage = lazy(() => import('./pages/PapeleriaPage'))
const CarteleriaPage = lazy(() => import('./pages/CarteleriaPage'))
const MaterialesPage = lazy(() => import('./pages/MaterialesPage'))
const AccesoriosPage = lazy(() => import('./pages/AccesoriosPage'))
const RotulacionPage = lazy(() => import('./pages/RotulacionPage'))
const NeonesPage = lazy(() => import('./pages/NeonesPage'))
const Carrito = lazy(() => import('./pages/Carrito'))
const Checkout = lazy(() => import('./pages/Checkout'))
const GuiaArchivos = lazy(() => import('./pages/GuiaArchivos'))
const Portafolio = lazy(() => import('./pages/Portafolio'))
const Contacto = lazy(() => import('./pages/Contacto'))
const Legal = lazy(() => import('./pages/Legal'))
const MiCuenta = lazy(() => import('./pages/MiCuenta'))
const MisPedidos = lazy(() => import('./pages/MisPedidos'))
const DetallePedido = lazy(() => import('./pages/DetallePedido'))
const HistorialArchivos = lazy(() => import('./pages/HistorialArchivos'))
const SolicitarPresupuesto = lazy(() => import('./pages/SolicitarPresupuesto'))
const MotionTest = lazy(() => import('./pages/MotionTest'))
const DashboardPage = lazy(() => import('./admin/pages/DashboardPage'))
const ContentStudioPage = lazy(() => import('./admin/pages/ContentStudioPage'))
const ClientServicePage = lazy(() => import('./admin/pages/ClientServicePage'))
const OrdersPage = lazy(() => import('./admin/pages/OrdersPage'))
const OrderDetailPage = lazy(() => import('./admin/pages/OrderDetailPage'))
const UploadsPage = lazy(() => import('./admin/pages/UploadsPage'))
const CustomersPage = lazy(() => import('./admin/pages/CustomersPage'))
const ProductionPage = lazy(() => import('./admin/pages/ProductionPage'))

const pageComponents: Record<RouteKey, ComponentType> = {
  home: Home,
  catalogo: Catalogo,
  dtf: DTFPage,
  textil: TextilPage,
  papeleria: PapeleriaPage,
  carteleria: CarteleriaPage,
  materiales: MaterialesPage,
  accesorios: AccesoriosPage,
  rotulacion: RotulacionPage,
  neones: NeonesPage,
  carrito: Carrito,
  checkout: Checkout,
  guia: GuiaArchivos,
  portafolio: Portafolio,
  contacto: Contacto,
  legal: Legal,
  miCuenta: MiCuenta,
  misPedidos: MisPedidos,
  detallePedido: DetallePedido,
  historialArchivos: HistorialArchivos,
  admin: DashboardPage,
  adminContent: ContentStudioPage,
  adminService: ClientServicePage,
  adminOrders: OrdersPage,
  adminOrderDetail: OrderDetailPage,
  adminUploads: UploadsPage,
  adminCustomers: CustomersPage,
  adminProduction: ProductionPage,
  presupuesto: SolicitarPresupuesto,
  motionTest: MotionTest,
  notFound: NotFoundPage,
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
      route === 'adminContent' ||
      route === 'adminService' ||
      route === 'adminOrders' ||
      route === 'adminOrderDetail' ||
      route === 'adminUploads' ||
      route === 'adminCustomers' ||
      route === 'adminProduction'
    )
  }

  return route === itemRoute
}

function PageLoadingFallback() {
  return (
    <section className="page-loading-shell" aria-live="polite">
      <div className="page-loading-mark" />
      <p>Cargando seccion…</p>
    </section>
  )
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

  const ActivePage = pageComponents[route] ?? NotFoundPage
  const previewNavigation = useCmsPreviewDocument(
    'src/content/navigationContent.ts',
    navigationContent,
  )
  const previewFooter = useCmsPreviewDocument(
    'src/content/footerContent.ts',
    footerContent,
  )

  return (
    <div className="app-shell">
      <PremiumCursor />
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <div className="app-grid" aria-hidden="true" />
      {/* Editable Zone: NAV_MAIN | Content: src/content/navigationContent.ts */}
      <header
        className={`site-header${route === 'home' ? ' site-header--overlay' : ''}${
          isHeaderHidden ? ' site-header--hidden' : ''
        }${isHeaderSolid ? ' site-header--solid' : ''}`}
      >
        <nav className="site-nav" aria-label="Principal">
          <a aria-label="Ir a la pagina de inicio" className="brand" data-cursor="interactive" href={getPublicHref('home')}>
            {previewNavigation.brandLabel}
          </a>
          <div className="nav-links">
            {previewNavigation.mainLinks.map((item) => (
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
          <Suspense fallback={<PageLoadingFallback />}>
            <ActivePage />
          </Suspense>
        </RouteErrorBoundary>
      </main>

      {/* Editable Zone: FOOTER_MAIN | Content: src/content/footerContent.ts */}
      <footer className="site-footer">
        <p>{previewFooter.description}</p>
        <div className="footer-links">
          {previewFooter.links.map((link) => (
            <a data-cursor="interactive" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </div>
        <p className="build-marker">{buildMarker}</p>
      </footer>
    </div>
  )
}

export default App
