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

## ARTWORK_UPLOAD_FLOW

- Archivo visual: `src/features/artwork-upload/components/ArtworkUploadFlow.tsx`
- Reglas: `src/features/artwork-upload/product-rules/artworkProductRules.ts`
- Controla: pasos del flujo de subida, revisión automática mock, confirmación y puente a carrito

## ARTWORK_PREVIEW_CANVAS

- Archivo visual: `src/features/artwork-upload/preview/PrintPreviewCanvas.tsx`
- Reglas: `src/features/artwork-upload/product-rules/artworkProductRules.ts`
- Controla: vista local del arte con línea de corte, sangrado, zona segura y orientación

## ARTWORK_VALIDATION_RULES

- Archivo visual: `src/features/artwork-upload/validation/validateArtworkFile.ts`
- Reglas: `src/features/artwork-upload/product-rules/artworkProductRules.ts`
- Controla: checks mock de formato, peso, resolución, orientación, cutline y margen

## ARTWORK_PRODUCT_GUIDES

- Archivo visual: `src/features/artwork-upload/product-rules/artworkProductRules.ts`
- Contenido editable: `src/features/artwork-upload/product-rules/artworkProductRules.ts`
- Controla: guías específicas de tarjetas, pegatinas, DTF, vinilo, cartelería, textil y papelería

## ARTWORK_RECOMMENDATIONS

- Archivo visual: `src/features/artwork-upload/validation/validateArtworkFile.ts`
- Contenido editable: `src/features/artwork-upload/product-rules/artworkProductRules.ts`
- Controla: mensajes inteligentes para corrección y revisión del archivo

## PREPRESS_CHECKS

- Archivo visual: `src/features/prepress/checks/buildPrepressChecks.ts`
- Contenido editable: `src/features/prepress/rules/productPrepressRulesets.ts`
- Controla: checks avanzados mock de formato, DPI, sangrado, cutline, vector, color, capas y escala

## PREPRESS_SCORE

- Archivo visual: `src/features/prepress/scoring/scorePrepressChecks.ts`
- Contenido editable: `src/features/prepress/rules/productPrepressRulesets.ts`
- Controla: score 0-100, estado general y prioridad de correccion

## PREPRESS_RECOMMENDATIONS

- Archivo visual: `src/features/prepress/recommendations/buildPrepressRecommendations.ts`
- Contenido editable: `src/features/prepress/rules/productPrepressRulesets.ts`
- Controla: recomendaciones accionables para cliente y taller

## PREPRESS_ADMIN_REVIEW

- Archivo visual: `src/features/prepress/components/PrepressAdminReviewPanel.tsx`
- Contenido editable: `src/features/prepress/rules/productPrepressRulesets.ts`
- Controla: panel tecnico para admin uploads y detalle de pedido

## PREPRESS_PRODUCT_RULESETS

- Archivo visual: `src/features/prepress/rules/productPrepressRulesets.ts`
- Contenido editable: `src/features/prepress/rules/productPrepressRulesets.ts`
- Controla: checks requeridos, checks bloqueantes, thresholds y copy amigable por producto

## PRINT_TEMPLATE_DOWNLOADS

- Archivo visual: `src/features/print-templates/components/ProductTemplateDownloads.tsx`
- Contenido editable: `src/infrastructure/storage/mock/mockProductTemplateRepository.ts`
- Controla: CTA de descarga, estado mock de disponibilidad y bloque principal de plantillas

## PRINT_TEMPLATE_GUIDES

- Archivo visual: `src/features/print-templates/components/TemplateGuidePanel.tsx`
- Contenido editable: `src/infrastructure/storage/mock/mockProductTemplateRepository.ts`
- Controla: sangrado, corte, zona segura, orientacion y notas tecnicas por plantilla

## PRINT_TEMPLATE_CATALOG

- Archivo visual: `src/infrastructure/storage/mock/mockProductTemplateRepository.ts`
- Contenido editable: `src/infrastructure/storage/mock/mockProductTemplateRepository.ts`
- Controla: catalogo mock de plantillas, formatos, versiones y rutas esperadas

## PRINT_TEMPLATE_FORMATS

- Archivo visual: `src/features/print-templates/components/TemplateFormatSelector.tsx`
- Contenido editable: `src/infrastructure/storage/mock/mockProductTemplateRepository.ts`
- Controla: selector de formato, formato recomendado y fallback de descarga

## REPORTING_CENTER

- Archivo visual: `src/admin/pages/ReportingPage.tsx`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: catalogo central de reportes, historial mock y preview KPI

## REPORT_EXPORTS

- Archivo visual: `src/features/reporting/components/ReportPreviewPanel.tsx`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: selector de formato, export JSON/CSV, print view mock y puente al engine PDF futuro

## REPORT_ORDER_SUMMARY

- Archivo visual: `src/features/reporting/services/reportingService.ts`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: resumen exportable del pedido con cliente, produccion y entrega

## REPORT_PRODUCTION_SHEET

- Archivo visual: `src/features/reporting/services/reportingService.ts`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: hoja de produccion mock con cola, maquina, slot y notas

## REPORT_PREPRESS_CHECKS

- Archivo visual: `src/features/reporting/services/reportingService.ts`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: score, checks clave y recomendaciones del reporte tecnico de artwork

## REPORT_ADMIN_KPIS

- Archivo visual: `src/features/reporting/services/reportingService.ts`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: snapshot ejecutivo mock con KPIs de operaciones, service, dispatch y capacidad

## DOCUMENT_LAYOUTS

- Archivo visual: `src/features/documents/layouts/OperationalDocumentLayout.tsx`
- Contenido editable: `src/features/documents/mock/documentDefinitions.ts`
- Controla: layout comun de documentos operativos para preview, print view y futuro PDF

## DOCUMENT_PRINT_STYLES

- Archivo visual: `src/App.css`
- Contenido editable: `src/App.css`
- Controla: A4, page breaks, tipografia compacta y ocultacion de chrome en impresion

## DOCUMENT_ORDER_SUMMARY

- Archivo visual: `src/features/documents/services/documentMapper.ts`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: version documental del resumen de pedido

## DOCUMENT_PRODUCTION_SHEET

- Archivo visual: `src/features/documents/services/documentMapper.ts`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: version documental de hoja de produccion

## DOCUMENT_PREPRESS_REPORT

- Archivo visual: `src/features/documents/services/documentMapper.ts`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: version documental de score, checks y recomendaciones tecnicas

## DOCUMENT_DELIVERY_HANDOFF

- Archivo visual: `src/features/documents/services/documentMapper.ts`
- Contenido editable: `src/features/reporting/mock/reportDefinitions.ts`
- Controla: version documental de handoff, tracking y firma mock

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

## ADMIN_OPERATIONS_DASHBOARD

- Archivo visual: `src/admin/pages/DashboardPage.tsx`
- Contenido editable: `src/features/operations/mock/operationsMockData.ts`
- Controla: KPIs operativos, urgentes, artwork queue, activity feed y quick actions

Ejemplos:

- `Cambia las quick actions del ADMIN_OPERATIONS_DASHBOARD`
- `Ajusta el lenguaje del activity feed operativo`

## ADMIN_CAPACITY_DASHBOARD

- Archivo visual: `src/admin/pages/DashboardPage.tsx`
- Contenido editable: `src/features/operations/capacity/capacityMockData.ts`
- Controla: capacidad del dia, proximas entregas, alertas de sobrecarga y jobs sin asignar

## ADMIN_DISPATCH_DASHBOARD

- Archivo visual: `src/admin/pages/DashboardPage.tsx`
- Contenido editable: `src/features/operations/dispatch/dispatchMockData.ts`
- Controla: widgets de packing, handoff, entregas, recogidas e incidencias

## ADMIN_OPERATOR_WORKLOAD

- Archivo visual: `src/features/operations/capacity/CapacityDashboardWidgets.tsx`
- Contenido editable: `src/features/operations/capacity/capacityMockData.ts`
- Controla: reparto de carga, horas disponibles y urgentes por operador

## ADMIN_CONTENT_STUDIO

- Archivo visual: `src/admin/pages/ContentStudioPage.tsx`
- Mapa maestro: `src/config/siteMap.ts`
- Controla: simulacion de edicion mock/local de zonas, contenido, pricing, catalogo, motion y admin

Uso:

- `Abre ADMIN_CONTENT_STUDIO`
- `Edita HOME_HERO desde el CMS mock`
- `Resetea PRODUCT_CONFIGURATOR a defaults`

## ADMIN_ACCOUNTS

- Archivo visual: `src/admin/pages/AccountsPage.tsx`
- Contenido editable: `src/features/admin-accounts/mock/adminAccountsMockData.ts`
- Controla: usuarios internos mock, ownership y workload resumido

## ADMIN_ROLES

- Archivo visual: `src/features/admin-accounts/mock/adminAccountsMockData.ts`
- Contenido editable: `src/features/admin-accounts/mock/adminAccountsMockData.ts`
- Controla: definiciones de rol y lectura operativa por area

## ADMIN_PERMISSIONS

- Archivo visual: `src/features/admin-accounts/mock/adminAccountsMockData.ts`
- Contenido editable: `src/features/admin-accounts/mock/adminAccountsMockData.ts`
- Controla: permisos visuales mock previos a auth y ACL reales

## ADMIN_APPROVAL_CHAINS

- Archivo visual: `src/features/admin-accounts/approval-chains/approvalChainService.ts`
- Contenido editable: `src/features/admin-accounts/mock/adminAccountsMockData.ts`
- Controla: artwork approval, urgent change request, quality hold, delivery incident y content publish mock

Ejemplos:

- `Edita ADMIN_APPROVAL_CHAINS`
- `Cambia la cadena artwork_approval para que requiera production_lead antes de aprobar`

## ADMIN_AUDIT_TRAIL

- Archivo visual: `src/features/admin-accounts/audit/auditTrailService.ts`
- Persistencia mock: `src/admin/store/useAdminUiStore.ts`
- Controla: timeline administrativo de ownership, cambios de estado y acciones internas

## ADMIN_CLIENT_SERVICE

- Archivo visual: `src/admin/pages/ClientServicePage.tsx`
- Contenido editable: `src/features/operations/client-service/mock/clientServiceMockData.ts`
- Controla: tickets, approvals, SLA, escalados y vistas de service internas

## ADMIN_SLA_MONITOR

- Archivo visual: `src/features/operations/client-service/sla/slaSelectors.ts`
- Contenido editable: `src/features/operations/client-service/mock/clientServiceMockData.ts`
- Controla: estados SLA, riesgo, breached y recommendation interna

## ADMIN_ARTWORK_APPROVALS

- Archivo visual: `src/features/operations/client-service/approvals/approvalFlow.ts`
- Contenido editable: `src/features/operations/client-service/mock/clientServiceMockData.ts`
- Controla: flujo de approval del artwork, bloqueo a produccion y cambios solicitados

## ADMIN_RESPONSE_TEMPLATES

- Archivo visual: `src/features/operations/client-service/templates/responseTemplates.ts`
- Contenido editable: `src/features/operations/client-service/templates/responseTemplates.ts`
- Controla: previews de respuesta a cliente y tono de comunicacion mock

## ADMIN_CUSTOMER_ISSUES

- Archivo visual: `src/features/operations/client-service/mock/clientServiceMockData.ts`
- Contenido editable: `src/features/operations/client-service/mock/clientServiceMockData.ts`
- Controla: tipos de incidencia y labels del workflow de service

## ADMIN_ESCALATION_PANEL

- Archivo visual: `src/features/operations/client-service/escalation/escalationRules.ts`
- Contenido editable: `src/features/operations/client-service/mock/clientServiceMockData.ts`
- Controla: niveles de escalado y recomendaciones operativas mock

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

## ADMIN_PRODUCTION_PIPELINE

- Archivo visual: `src/admin/pages/ProductionPage.tsx`
- Contenido editable: `src/features/operations/mock/operationsMockData.ts`
- Controla: etapas del pipeline, resumen por fase y textos del flujo productivo

## ADMIN_SCHEDULING_BOARD

- Archivo visual: `src/admin/pages/ProductionPage.tsx`
- Contenido editable: `src/features/operations/scheduling/schedulingService.ts`
- Controla: vista semanal mock, entregas, conflictos de planning y relacion entre cola y due dates

## ADMIN_MACHINE_SLOTS

- Archivo visual: `src/features/operations/scheduling/SchedulingBoard.tsx`
- Contenido editable: `src/features/operations/capacity/capacityMockData.ts`
- Controla: maquinas, ventanas y capacidad por slot mock

## ADMIN_DELIVERY_BOARD

- Archivo visual: `src/admin/pages/ProductionPage.tsx`
- Contenido editable: `src/features/operations/delivery/deliveryMockData.ts`
- Controla: board de despacho con columnas por estado y acciones mock

## ADMIN_PICKUP_QUEUE

- Archivo visual: `src/features/operations/delivery/DispatchBoard.tsx`
- Contenido editable: `src/features/operations/dispatch/dispatchMockData.ts`
- Controla: pedidos listos para recoger y handoff local

## ADMIN_ORDER_DETAIL

- Archivo visual: `src/admin/pages/OrderDetailPage.tsx`
- Contenido editable: `src/features/operations/mock/operationsMockData.ts`
- Controla: metadata operativa, pipeline visual, timeline y tono del detalle interno

## ADMIN_UPLOAD_REVIEW

- Archivo visual: `src/admin/pages/UploadsPage.tsx`
- Contenido editable: `src/features/operations/mock/operationsMockData.ts`
- Controla: estados de review, labels de artwork review y lectura operativa de los archivos

## ADMIN_INTERNAL_NOTES

- Archivo visual: `src/admin/pages/OrderDetailPage.tsx`
- Persistencia mock: `src/admin/store/useAdminUiStore.ts`
- Controla: notas internas, QA y produccion visibles en el flujo del pedido

## ADMIN_DELIVERY_MESSAGES

- Archivo visual: `src/admin/pages/OrderDetailPage.tsx`
- Contenido editable: `src/features/operations/dispatch/dispatchMockData.ts`
- Controla: previews de mensajes mock de pickup, envio, retraso, incidencia y entrega

## ADMIN_ORDER_HANDOFF

- Archivo visual: `src/admin/pages/OrderDetailPage.tsx`
- Persistencia mock: `src/admin/store/useAdminUiStore.ts`
- Controla: metodo de entrega, tracking, carrier, ventana y timeline de handoff

## Operations mock system

- Arquitectura: `src/features/operations/`
- Dashboard: `dashboard/`
- Pedidos: `orders/`
- Produccion: `production/`
- Uploads: `uploads/`
- Notas: `notes/`
- Timeline: `timeline/`
- Filtros: `filters/`
- Client service: `client-service/`
- Servicios y hooks: `services/`, `hooks/`

Ejemplos:

- `Edita ADMIN_PRODUCTION_PIPELINE`
- `Cambia los operadores mock del sistema operations`
- `Ajusta los filtros del board de pedidos`

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

## CMS mock interno

- Ruta admin: `#/admin/content`
- Repositorio mock: `src/features/cms/services/mockContentRepository.ts`
- Contrato futuro: `src/features/cms/services/futureSupabaseContentRepository.ts`
- Definiciones por documento: `src/features/cms/data/cmsDefaultDocuments.ts`
- Preview bridge: `src/features/cms-preview/`

Ejemplos:

- `Busca HOME_HERO en el CMS mock`
- `Exporta el snapshot local del CMS`
- `Resetea CART_DRAWER al contenido por defecto`

## Zonas con preview activo

Estas zonas ya pueden leer overrides mock cuando el preview esta activo:

- `HOME_HERO`
- `HOME_FINAL_CTA`
- `NAV_MAIN`
- `FOOTER_MAIN`
- `DTF_CONFIGURATOR`
- `CATALOG_GRID`

Activacion:

- `?cmsPreview=1`
- o desde `#/admin/content`

Desactivacion:

- `?cmsPreview=0`
- o desde `#/admin/content`
