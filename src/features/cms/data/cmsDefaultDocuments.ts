import { siteMap } from '../../../config/siteMap'
import { DTF_PRICING_CONFIG } from '../../../config/pricing/dtfPricing'
import { printPricingConfig } from '../../../config/pricing/printPricing'
import { productPricingConfig } from '../../../config/pricing/productPricing'
import { wrappingPricingConfig } from '../../../config/pricing/wrappingPricing'
import {
  adminMockQuickActions,
  adminMockOrderOverrides,
  adminMockUploadOverrides,
} from '../../../content/adminMockContent'
import { bannerContent } from '../../../content/bannerContent'
import { catalogContent } from '../../../content/catalogContent'
import { dtfPageContent } from '../../../content/dtfContent'
import { faqContent } from '../../../content/faqContent'
import { footerContent } from '../../../content/footerContent'
import {
  homeEditorialContent,
  homeFoundationContent,
  homeHeroContent,
  homeMetricsContent,
  homePreparationContent,
  homeProcessContent,
  homeTrustContent,
} from '../../../content/homeContent'
import { navigationContent } from '../../../content/navigationContent'
import { pricingContent } from '../../../content/pricingContent'
import { editableCatalogCategories } from '../../../catalog/categories'
import { catalogMock } from '../../../catalog/catalogMock'
import { editableCatalogProducts } from '../../../catalog/products'
import { productExperienceContent } from '../../products/product-detail/data/productExperienceContent'
import { cinematicAssets } from '../../../motion/cinematic/cinematicAssets'
import { cinematicScenes } from '../../../motion/cinematic/cinematicScenes'
import type { CmsDocumentDefinition } from '../types/cms'

const homeContentPayload = {
  homeHeroContent,
  homeMetricsContent,
  homeFoundationContent,
  homeProcessContent,
  homeEditorialContent,
  homePreparationContent,
  homeTrustContent,
}

const pricingConfigPayload = {
  DTF_PRICING_CONFIG,
  printPricingConfig,
  wrappingPricingConfig,
  productPricingConfig,
}

const adminMockContentPayload = {
  adminMockOrderOverrides,
  adminMockUploadOverrides,
  adminMockQuickActions,
}

const siteMapPayload = {
  siteMap,
}

const cinematicPayload = {
  cinematicScenes,
  cinematicAssets,
}

export const cmsDefaultDocuments: CmsDocumentDefinition[] = [
  {
    id: 'editable-zones-map',
    label: 'Mapa maestro de zonas editables',
    description: 'Registro central de IDs, tipos y archivos asociados para toda la web.',
    sourcePath: 'src/config/siteMap.ts',
    type: 'config',
    zoneIds: siteMap.map((zone) => zone.id),
    payload: siteMapPayload,
  },
  {
    id: 'home-content',
    label: 'Contenido de home',
    description: 'Hero, metricas, foundation, proceso y bloques de confianza de la home.',
    sourcePath: 'src/content/homeContent.ts',
    type: 'section',
    zoneIds: [
      'HOME_HERO',
      'HOME_METRICS',
      'HOME_FOUNDATION',
      'HOME_PROCESS',
      'HOME_EDITORIAL',
      'HOME_PREPARATION',
      'HOME_TRUST',
    ],
    payload: homeContentPayload,
  },
  {
    id: 'navigation-content',
    label: 'Navegacion principal',
    description: 'Marca y enlaces visibles del shell publico.',
    sourcePath: 'src/content/navigationContent.ts',
    type: 'config',
    zoneIds: ['NAV_MAIN'],
    payload: navigationContent,
  },
  {
    id: 'footer-content',
    label: 'Footer publico',
    description: 'Copy y enlaces del footer publico.',
    sourcePath: 'src/content/footerContent.ts',
    type: 'section',
    zoneIds: ['FOOTER_MAIN'],
    payload: footerContent,
  },
  {
    id: 'catalog-content',
    label: 'Contenido comercial del catalogo',
    description: 'Hero, paneles y bloques de lectura del catalogo.',
    sourcePath: 'src/content/catalogContent.ts',
    type: 'commerce',
    zoneIds: ['CATALOG_GRID'],
    payload: catalogContent,
  },
  {
    id: 'catalog-data',
    label: 'Catalogo mock',
    description: 'Productos, categorias y destacados del catalogo editable.',
    sourcePath: 'src/catalog/catalogMock.ts',
    type: 'commerce',
    zoneIds: ['CATALOG_GRID', 'CATALOG_FILTERS', 'CART_RECOMMENDATIONS'],
    payload: {
      catalogMock,
      editableCatalogProducts,
      editableCatalogCategories,
    },
  },
  {
    id: 'dtf-content',
    label: 'Contenido del configurador DTF',
    description: 'Mensajes, ayudas, presets y copy operacional del recorrido DTF.',
    sourcePath: 'src/content/dtfContent.ts',
    type: 'commerce',
    zoneIds: ['DTF_CONFIGURATOR'],
    payload: dtfPageContent,
  },
  {
    id: 'pricing-content',
    label: 'Copy comercial de carrito y checkout',
    description: 'Titulares, labels y narrativa mock de carrito y checkout.',
    sourcePath: 'src/content/pricingContent.ts',
    type: 'commerce',
    zoneIds: ['CART_DRAWER', 'CHECKOUT_MOCK_FLOW'],
    payload: pricingContent,
  },
  {
    id: 'pricing-config',
    label: 'Configuracion de precios mock',
    description: 'Precios base, urgencias, futuros impuestos y notas de pricing.',
    sourcePath: 'src/config/pricing/index.ts',
    type: 'commerce',
    zoneIds: ['DTF_CONFIGURATOR', 'PRODUCT_CONFIGURATOR', 'CHECKOUT_MOCK_FLOW'],
    payload: pricingConfigPayload,
  },
  {
    id: 'banner-content',
    label: 'Banners y CTA promocionales',
    description: 'Bloques promocionales y CTA de cierre.',
    sourcePath: 'src/content/bannerContent.ts',
    type: 'section',
    zoneIds: ['HOME_FINAL_CTA', 'PRODUCT_FINAL_CTA'],
    payload: bannerContent,
  },
  {
    id: 'faq-content',
    label: 'FAQ y objeciones',
    description: 'Titulares de FAQ y objeciones de home y DTF.',
    sourcePath: 'src/content/faqContent.ts',
    type: 'section',
    zoneIds: ['HOME_FAQ', 'PRODUCT_FAQ', 'DTF_CONFIGURATOR'],
    payload: faqContent,
  },
  {
    id: 'product-experience-content',
    label: 'Contenido premium de detalle de producto',
    description: 'Storytelling, galerias, CTA, recomendaciones y secciones de producto.',
    sourcePath: 'src/features/products/product-detail/data/productExperienceContent.ts',
    type: 'commerce',
    zoneIds: [
      'PRODUCT_DETAIL',
      'PRODUCT_HERO',
      'PRODUCT_GALLERY',
      'PRODUCT_CONFIGURATOR',
      'PRODUCT_SPECS',
      'PRODUCT_STORY',
      'PRODUCT_RECOMMENDATIONS',
      'PRODUCT_FAQ',
      'PRODUCT_FINAL_CTA',
    ],
    payload: productExperienceContent,
  },
  {
    id: 'cinematic-home-system',
    label: 'Sistema cinematico de home',
    description: 'Escenas, placeholders y rutas esperadas de assets para la home premium.',
    sourcePath: 'src/motion/cinematic/cinematicScenes.ts',
    type: 'motion',
    zoneIds: ['CINEMATIC_SCROLL_SYSTEM'],
    payload: cinematicPayload,
  },
  {
    id: 'admin-mock-content',
    label: 'Contenido interno mock admin',
    description: 'Overrides, acciones rapidas y soporte local del panel interno.',
    sourcePath: 'src/content/adminMockContent.ts',
    type: 'admin',
    zoneIds: ['ADMIN_DASHBOARD', 'ADMIN_ORDERS', 'ADMIN_CUSTOMERS', 'ADMIN_UPLOADS'],
    payload: adminMockContentPayload,
  },
]
