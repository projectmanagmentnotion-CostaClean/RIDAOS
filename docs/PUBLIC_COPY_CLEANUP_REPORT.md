# PUBLIC COPY CLEANUP REPORT

## Objetivo

Eliminar de la UI publica cualquier copy con tono de desarrollo, staging o documentacion interna, manteniendo intacta la logica mock/local del proyecto.

## Zonas revisadas

- HOME_HERO
- HOME_METRICS
- HOME_FOUNDATION
- HOME_PROCESS
- HOME_EDITORIAL
- HOME_PREPARATION
- HOME_TRUST
- HOME_FAQ
- HOME_FINAL_CTA
- NAV_MAIN
- FOOTER_MAIN
- CATALOG_GRID
- PRODUCT_HERO
- PRODUCT_GALLERY
- PRODUCT_CONFIGURATOR
- PRODUCT_STORY
- PRODUCT_RECOMMENDATIONS
- PRODUCT_FAQ
- PRODUCT_FINAL_CTA
- DTI_OPTIONS
- STICKER_OPTIONS
- BUSINESS_CARD_OPTIONS
- FLYER_OPTIONS
- VEHICLE_WRAP_OPTIONS
- ARTWORK_UPLOAD_FLOW
- ARTWORK_PREVIEW_CANVAS
- ARTWORK_PRODUCT_GUIDES
- ARTWORK_RECOMMENDATIONS
- PRINT_TEMPLATE_DOWNLOADS
- PRINT_TEMPLATE_GUIDES
- RELATED_SERVICES
- RELATED_PRODUCTS
- RELATED_GUIDES
- UPSELLING_RULES
- FREQUENTLY_COMBINED
- LOCAL_SERVICE_HUBS
- SEO_HOME
- SEO_LOCAL
- SEO_META
- SEO_INTENT
- SEO_CLUSTERS
- CHECKOUT_MOCK_FLOW
- CART_DRAWER

## Textos eliminados o reescritos

- `mock`
  - Sustituido por copy comercial o tecnico orientado al cliente en checkout, DTI, templates, upload y fichas.
- `placeholder`
  - Sustituido por `visual editorial`, `vista principal` o `composicion principal`.
- `plantilla pendiente`
  - Sustituido por `Solicitar plantilla` o `Te guiamos desde el configurador`.
- `precio mock`
  - Sustituido por `precio estimado`.
- `Envio mock` / `Pago mock`
  - Sustituido por `Entrega` / `Pago`.
- `flujo comercial mock`
  - Sustituido por `propuesta personalizada` o copy comercial equivalente.
- `persistencia local activa`
  - Eliminado de la UI publica.
- referencias a `Stripe`, `auth real`, `datos remotos`
  - Eliminadas de la UI publica del checkout.

## Archivos modificados

- `src/content/pricingContent.ts`
- `src/features/cart/data/checkoutMock.ts`
- `src/pages/Carrito.tsx`
- `src/pages/Checkout.tsx`
- `src/features/artwork-upload/hooks/useArtworkUploadFlow.ts`
- `src/features/artwork-upload/components/ArtworkUploadFlow.tsx`
- `src/features/prepress/checks/buildPrepressChecks.ts`
- `src/features/print-templates/components/ProductTemplateDownloads.tsx`
- `src/features/print-templates/components/TemplateDownloadCard.tsx`
- `src/features/print-templates/mock/templateStatusCopy.ts`
- `src/features/products/product-detail/ProductExperiencePage.tsx`
- `src/features/products/product-detail/hooks/useProductDetailState.ts`
- `src/features/products/product-detail/data/productExperienceContent.ts`
- `src/features/products/product-gallery/ProductGalleryFrame.tsx`
- `src/features/product-options/components/ProductOptionAssetPanel.tsx`
- `src/features/product-options/components/ProductVisualHero.tsx`
- `src/features/product-options/data/productOptionDefinitions.ts`
- `src/features/product-options/pricing/productOptionPricing.ts`
- `src/catalog/adapters/catalogCartAdapter.ts`
- `src/catalog/adapters/catalogPricingAdapter.ts`
- `src/catalog/products/dtf.ts`
- `src/catalog/content/entries/dtf.content.ts`
- `src/catalog/content/entries/materiales.content.ts`
- `src/catalog/conversion/conversionRegistry.ts`
- `src/pages/DTFPage.tsx`
- `src/pages/GuiaArchivos.tsx`
- `src/pages/HistorialArchivos.tsx`
- `src/pages/SolicitarPresupuesto.tsx`
- `src/pages/CursorTestPage.tsx`

## Terminos prohibidos encontrados

Encontrados en UI publica antes de la limpieza:

- `mock`
- `placeholder`
- `pendiente`
- `precio mock`
- `Envio mock`
- `Pago mock`
- `checkout mock`
- `flujo comercial mock`
- `plantilla pendiente`
- `asset requerido`
- `ruta mock`

## Terminos que siguen permitidos solo en docs o admin

- `mock`
- `future`
- `internal`
- `runtime`
- `pre-real-data`
- `preview interno`
- `PDF placeholder`

Estos terminos se conservan solo en:

- documentacion tecnica de `docs/`
- capas internas de admin
- nombres de tipos, repositorios o servicios no visibles al cliente

## Notas pendientes

- Siguen faltando assets reales en varias rutas de `/public/assets/`, pero ya no se muestran como deuda tecnica al cliente.
- La capa mock/local sigue activa por debajo sin exponer ese lenguaje en storefront.
- `CursorTestPage` se mantiene como ruta de prueba tecnica, con placeholders suavizados para no arrastrar copy de desarrollo.
