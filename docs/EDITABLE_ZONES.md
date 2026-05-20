# Zonas editables de RidaosPrint

Esta guia describe que archivo controla cada bloque editable antes de activar datos reales.

## Como usar esta guia

Cada zona tiene:

- **ID**: identificador estable para pedir cambios
- **Archivo visual**: componente o pagina que renderiza la zona
- **Contenido editable**: archivo con textos, CTAs, precios o mocks

Ejemplos de ordenes:

- `Edita HOME_HERO`
- `Cambia precios en DTF_CONFIGURATOR`
- `Actualiza banners en HOME_FINAL_CTA`
- `Modifica productos en CATALOG_GRID`

## HOME_HERO

- Archivo visual: `src/sections/home/HeroSection.tsx`
- Contenido editable: `src/content/homeContent.ts`
- Controla: eyebrow, copy principal, bullets orbit, CTA principal y CTA secundaria

Ejemplos:

- `Cambia el titular del HOME_HERO por...`
- `Cambia el CTA principal del HOME_HERO por...`

## HOME_METRICS

- Archivo visual: `src/sections/home/MetricsSection.tsx`
- Contenido editable: `src/content/homeContent.ts`
- Controla: metricas comerciales de la home

## HOME_FOUNDATION

- Archivo visual: `src/sections/home/FoundationSection.tsx`
- Contenido editable: `src/content/homeContent.ts`
- Controla: panel comercial y accesos rapidos

## HOME_PROCESS

- Archivo visual: `src/sections/home/ProcessSection.tsx`
- Contenido editable: `src/content/homeContent.ts`
- Controla: cabecera del bloque de proceso

## HOME_EDITORIAL

- Archivo visual: `src/sections/home/EditorialSection.tsx`
- Contenido editable: `src/content/homeContent.ts`
- Controla: titulos del bloque editorial

## HOME_PREPARATION

- Archivo visual: `src/sections/home/PreparationSection.tsx`
- Contenido editable: `src/content/homeContent.ts`
- Controla: titulos del bloque de preparacion y confianza

## HOME_TRUST

- Archivo visual: `src/sections/home/TrustSection.tsx`
- Contenido editable: `src/content/homeContent.ts`
- Controla: eyebrow y titulo del bloque de confianza

## HOME_FAQ

- Archivo visual: `src/sections/home/AnswersSection.tsx`
- Contenido editable: `src/content/faqContent.ts`
- Controla: titulos de objeciones y FAQ

## HOME_FINAL_CTA

- Archivo visual: `src/sections/home/FinalCtaSection.tsx`
- Contenido editable: `src/content/bannerContent.ts`
- Controla: label, titulo, descripcion y CTA final de home

## CINEMATIC_SCROLL_SYSTEM

- Archivo visual: `src/motion/cinematic/CinematicHomeScroll.tsx`
- Escenas: `src/motion/cinematic/cinematicScenes.ts`
- Assets esperados: `src/motion/cinematic/cinematicAssets.ts`
- Hook motion: `src/motion/cinematic/useCinematicScroll.ts`
- Controla: overlays decorativos, placeholders de escenas, profundidad y transiciones de scroll de la home

Ejemplos:

- `Edita TEXTILE_DTF_TRANSITION`
- `Cambia la entrada del coche en VEHICLE_WRAP_TRANSITION`
- `Anade mas profundidad al HERO_CINEMATIC`

## NAV_MAIN

- Archivo visual: `src/App.tsx`
- Contenido editable: `src/content/navigationContent.ts`
- Controla: marca y enlaces principales del header publico

## FOOTER_MAIN

- Archivo visual: `src/App.tsx`
- Contenido editable: `src/content/footerContent.ts`
- Controla: mensaje principal y enlaces del footer

## CATALOG_GRID

- Archivo visual: `src/pages/Catalogo.tsx`
- Contenido editable: `src/content/catalogContent.ts`
- Controla: hero del catalogo, bloques de lectura comercial y titulos de seccion

Ejemplos:

- `Cambia el texto del hero de CATALOG_GRID`
- `Actualiza el bloque visual del catalogo`

## CATALOG_FILTERS

- Archivo visual: `src/catalog/categories.ts`
- Contenido editable: `src/catalog/categories.ts`
- Controla: etiquetas y descripciones de categorias

## DTF_CONFIGURATOR

- Archivo visual: `src/pages/DTFPage.tsx`
- Contenido editable: `src/content/dtfContent.ts`
- Precios: `src/config/pricing/dtfPricing.ts`
- Controla: mensajes del configurador, presets, labels, ayudas, CTA y textos del recorrido DTF

Ejemplos:

- `Cambia el precio del DTF por metro a 18 EUR`
- `Agrega opcion urgente 24h con suplemento`
- `Cambia el texto de ayuda del campo archivo`

## PRODUCT_DETAIL

- Archivo visual: `src/features/products/product-detail/ProductExperiencePage.tsx`
- Contenido editable: `src/features/products/product-detail/data/productExperienceContent.ts`
- Controla: composición premium del detalle configurable, storytelling, recomendaciones y CTA final

## PRODUCT_HERO

- Archivo visual: `src/features/products/product-detail/sections/ProductHeroSection.tsx`
- Contenido editable: `src/features/products/product-detail/data/productExperienceContent.ts`
- Controla: eyebrow, titular, intro y sticker words de cada familia de producto

## PRODUCT_GALLERY

- Archivo visual: `src/features/products/product-detail/sections/ProductGallerySection.tsx`
- Contenido editable: `src/features/products/product-detail/data/productExperienceContent.ts`
- Controla: placeholders visuales, orden y narrativa de galería

## PRODUCT_CONFIGURATOR

- Archivo visual: `src/features/products/product-detail/sections/ProductConfiguratorSection.tsx`
- Contenido editable: `src/features/products/product-detail/data/productExperienceContent.ts`
- Controla: soporte contextual del configurador y CTA principal del producto

## PRODUCT_SPECS

- Archivo visual: `src/features/products/product-detail/sections/ProductSpecsSection.tsx`
- Contenido editable: `src/features/products/product-detail/data/productExperienceContent.ts`
- Controla: lectura rápida de compra, pricing y archivo

## PRODUCT_STORY

- Archivo visual: `src/features/products/product-detail/sections/ProductStorySection.tsx`
- Contenido editable: `src/features/products/product-detail/data/productExperienceContent.ts`
- Controla: bloques editoriales y storytelling del detalle

## PRODUCT_RECOMMENDATIONS

- Archivo visual: `src/features/products/product-detail/sections/ProductRecommendationsSection.tsx`
- Contenido editable: `src/features/products/product-detail/data/productExperienceContent.ts`
- Controla: cross-sell, bundle y recomendaciones premium

## PRODUCT_FAQ

- Archivo visual: `src/features/products/product-detail/sections/ProductFaqSection.tsx`
- Contenido editable: `src/features/products/product-detail/data/productExperienceContent.ts`
- Controla: FAQ, objeciones, guidance y confianza del detalle

## PRODUCT_FINAL_CTA

- Archivo visual: `src/features/products/product-detail/sections/ProductFinalCtaSection.tsx`
- Contenido editable: `src/features/products/product-detail/data/productExperienceContent.ts`
- Controla: bloque final de cierre del producto

## CART_DRAWER

- Archivo visual: `src/pages/Carrito.tsx`
- Contenido editable: `src/content/pricingContent.ts`
- Controla: copy del hero del carrito y labels base de continuidad comercial

## CHECKOUT_MOCK_FLOW

- Archivo visual: `src/pages/Checkout.tsx`
- Contenido editable: `src/content/pricingContent.ts`
- Controla: titulares, copy base y narrativa del flujo mock de revision, envio, pago y confirmacion

Ejemplos:

- `Cambia el titular de CHECKOUT_MOCK_FLOW`
- `Ajusta el copy del paso de pago mock`

## CART_RECOMMENDATIONS

- Archivo visual: `src/features/cart/data/cartRecommendations.ts`
- Contenido editable: `src/features/cart/data/cartRecommendations.ts`
- Controla: recomendaciones premium y cross-sell mostrados en el carrito

## ORDER_LIFECYCLE_MOCK

- Archivo visual: `src/features/orders/utils/orderLifecycle.ts`
- Contenido editable: `src/features/orders/utils/orderLifecycle.ts`
- Controla: etiquetas y orden del timeline mock de seguimiento del pedido

## ADMIN_DASHBOARD

- Archivo visual: `src/admin/pages/DashboardPage.tsx`
- Contenido editable: `src/content/adminMockContent.ts`
- Controla: acciones rapidas y textos mock del panel

## ADMIN_ORDERS

- Archivo visual: `src/content/adminMockContent.ts`
- Contenido editable: `src/content/adminMockContent.ts`
- Controla: overrides mock de pedidos

## ADMIN_CUSTOMERS

- Archivo visual: `src/content/adminMockContent.ts`
- Contenido editable: `src/content/adminMockContent.ts`
- Controla: soporte mock del panel de clientes

## ADMIN_UPLOADS

- Archivo visual: `src/content/adminMockContent.ts`
- Contenido editable: `src/content/adminMockContent.ts`
- Controla: overrides mock de revision de archivos

## Precios centralizados

- `src/config/pricing/dtfPricing.ts`: DTF por metro, urgencias, calidad y base por metro
- `src/config/pricing/printPricing.ts`: reserva para impresion directa
- `src/config/pricing/wrappingPricing.ts`: reserva para rotulacion y wrapping
- `src/config/pricing/productPricing.ts`: metadata global de precios

## Navegacion y contenido central

- `src/content/navigationContent.ts`: header
- `src/content/footerContent.ts`: footer
- `src/content/homeContent.ts`: home
- `src/content/catalogContent.ts`: catalogo
- `src/content/dtfContent.ts`: configurador DTF
- `src/content/faqContent.ts`: titulos FAQ
- `src/content/bannerContent.ts`: bloques promocionales
- `src/content/adminMockContent.ts`: panel interno mock
