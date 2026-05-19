export type EditableZoneType = 'section' | 'data' | 'config' | 'page' | 'admin' | 'commerce'

export type EditableZone = {
  id: string
  label: string
  description: string
  filePath: string
  editableContentPath?: string
  type: EditableZoneType
}

export const siteMap: EditableZone[] = [
  {
    id: 'HOME_HERO',
    label: 'Hero principal de home',
    description: 'Secuencia fullscreen, titular principal, bullets y CTAs del primer impacto.',
    filePath: 'src/sections/home/HeroSection.tsx',
    editableContentPath: 'src/content/homeContent.ts',
    type: 'section',
  },
  {
    id: 'HOME_METRICS',
    label: 'Metricas de home',
    description: 'Tarjetas de valor comercial y referencias rapidas del flujo principal.',
    filePath: 'src/sections/home/MetricsSection.tsx',
    editableContentPath: 'src/content/homeContent.ts',
    type: 'section',
  },
  {
    id: 'HOME_FOUNDATION',
    label: 'Bloque base de home',
    description: 'Panel de lectura comercial y accesos rapidos del flujo principal.',
    filePath: 'src/sections/home/FoundationSection.tsx',
    editableContentPath: 'src/content/homeContent.ts',
    type: 'section',
  },
  {
    id: 'HOME_PROCESS',
    label: 'Proceso de home',
    description: 'Cabecera y copy del bloque que explica el proceso de pedido.',
    filePath: 'src/sections/home/ProcessSection.tsx',
    editableContentPath: 'src/content/homeContent.ts',
    type: 'section',
  },
  {
    id: 'HOME_EDITORIAL',
    label: 'Bloque editorial de home',
    description: 'Titulos de apoyo y conexiones con el contenido SEO del producto principal.',
    filePath: 'src/sections/home/EditorialSection.tsx',
    editableContentPath: 'src/content/homeContent.ts',
    type: 'section',
  },
  {
    id: 'HOME_PREPARATION',
    label: 'Preparacion de home',
    description: 'Titulos de orientacion y confianza para preparar pedidos antes del checkout.',
    filePath: 'src/sections/home/PreparationSection.tsx',
    editableContentPath: 'src/content/homeContent.ts',
    type: 'section',
  },
  {
    id: 'HOME_TRUST',
    label: 'Bloque de confianza de home',
    description: 'Cabecera del grid de confianza y mensaje comercial asociado.',
    filePath: 'src/sections/home/TrustSection.tsx',
    editableContentPath: 'src/content/homeContent.ts',
    type: 'section',
  },
  {
    id: 'HOME_FAQ',
    label: 'Respuestas y FAQ de home',
    description: 'Titulos del bloque de objeciones y preguntas frecuentes.',
    filePath: 'src/sections/home/AnswersSection.tsx',
    editableContentPath: 'src/content/faqContent.ts',
    type: 'section',
  },
  {
    id: 'HOME_FINAL_CTA',
    label: 'CTA final de home',
    description: 'Bloque promocional final con copy y llamada principal.',
    filePath: 'src/sections/home/FinalCtaSection.tsx',
    editableContentPath: 'src/content/bannerContent.ts',
    type: 'section',
  },
  {
    id: 'NAV_MAIN',
    label: 'Navegacion principal',
    description: 'Marca, enlaces visibles y orden de la navegacion publica.',
    filePath: 'src/App.tsx',
    editableContentPath: 'src/content/navigationContent.ts',
    type: 'config',
  },
  {
    id: 'FOOTER_MAIN',
    label: 'Footer principal',
    description: 'Mensaje final y enlaces secundarios del pie publico.',
    filePath: 'src/App.tsx',
    editableContentPath: 'src/content/footerContent.ts',
    type: 'section',
  },
  {
    id: 'CATALOG_GRID',
    label: 'Grid principal de catalogo',
    description: 'Hero del catalogo, bloques introductorios y tarjetas de entrada.',
    filePath: 'src/pages/Catalogo.tsx',
    editableContentPath: 'src/content/catalogContent.ts',
    type: 'commerce',
  },
  {
    id: 'CATALOG_FILTERS',
    label: 'Categorias y lectura del catalogo',
    description: 'Etiquetas y descripciones de categorias visibles en catalogo.',
    filePath: 'src/catalog/categories.ts',
    editableContentPath: 'src/catalog/categories.ts',
    type: 'data',
  },
  {
    id: 'DTF_CONFIGURATOR',
    label: 'Configurador DTF',
    description: 'Campos, ayudas, presets, mensajes y textos del flujo DTF.',
    filePath: 'src/pages/DTFPage.tsx',
    editableContentPath: 'src/content/dtfContent.ts',
    type: 'commerce',
  },
  {
    id: 'PRODUCT_DETAIL',
    label: 'Detalle de producto',
    description: 'Contenido base de productos y servicios ligados al registro del catalogo.',
    filePath: 'src/catalog/products.ts',
    editableContentPath: 'src/catalog/products.ts',
    type: 'commerce',
  },
  {
    id: 'CART_DRAWER',
    label: 'Carrito y resumen',
    description: 'Textos del resumen, CTAs de carrito y mensajes de continuidad comercial.',
    filePath: 'src/pages/Carrito.tsx',
    editableContentPath: 'src/content/pricingContent.ts',
    type: 'commerce',
  },
  {
    id: 'ADMIN_DASHBOARD',
    label: 'Dashboard admin mock',
    description: 'Mensajes y acciones rapidas del panel interno preparado.',
    filePath: 'src/admin/pages/DashboardPage.tsx',
    editableContentPath: 'src/content/adminMockContent.ts',
    type: 'admin',
  },
  {
    id: 'ADMIN_ORDERS',
    label: 'Pedidos admin mock',
    description: 'Overrides y contenido mock de pedidos internos.',
    filePath: 'src/content/adminMockContent.ts',
    editableContentPath: 'src/content/adminMockContent.ts',
    type: 'admin',
  },
  {
    id: 'ADMIN_CUSTOMERS',
    label: 'Clientes admin mock',
    description: 'Contenido de apoyo y referencias mock del panel de clientes.',
    filePath: 'src/content/adminMockContent.ts',
    editableContentPath: 'src/content/adminMockContent.ts',
    type: 'admin',
  },
  {
    id: 'ADMIN_UPLOADS',
    label: 'Uploads admin mock',
    description: 'Notas de revision y estados mock para archivos.',
    filePath: 'src/content/adminMockContent.ts',
    editableContentPath: 'src/content/adminMockContent.ts',
    type: 'admin',
  },
]

export const siteMapById = Object.fromEntries(siteMap.map((zone) => [zone.id, zone]))
