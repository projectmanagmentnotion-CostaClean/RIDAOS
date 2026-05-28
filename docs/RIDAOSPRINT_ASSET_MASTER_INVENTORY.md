# RidaosPrint - Inventario Maestro de Assets

## 1. Resumen ejecutivo

Este documento fija el inventario de assets de RidaosPrint segun la arquitectura storefront actual:

- `#/` home comercial
- `#/catalogo` escaparate visual
- `#/catalogo/[familia]` landings cortas por categoria
- `#/producto/[slug]` PDPs canonicas con configurador unico
- `#/carrito`, `#/checkout`, `#/upload`, `#/admin`

Objetivo del inventario:

- dar una guia unica a diseno, fotografia, mockups y produccion visual
- separar assets decorativos de assets funcionales
- dejar claro que archivo usa cada pagina y en que data/componente se referencia
- preparar una futura migracion a storage real sin rehacer JSX ni rutas

Reglas base:

- `DTI` es el naming comercial visible principal
- `DTF` solo se conserva como apoyo SEO o referencia tecnica secundaria
- los fallbacks deben parecer intencionales, nunca placeholders
- los configuradores usan assets ligeros y tecnicos; los heroes usan assets editoriales
- no se activan Supabase, Auth ni Stripe en esta fase

## 2. Estructura actual de paginas

### Home

- `#/`

### Catalogo

- `#/catalogo`

### Categorias

- `#/catalogo/dti`
- `#/catalogo/rotulacion`
- `#/catalogo/textil`
- `#/catalogo/pegatinas`
- `#/catalogo/tarjetas`
- `#/catalogo/flyers`
- `#/catalogo/vinilo-impreso`

### PDPs canonicas

- `#/producto/dti-por-metro`
- `#/producto/pegatinas-personalizadas`
- `#/producto/tarjetas-visita`
- `#/producto/flyers-personalizados`
- `#/producto/vinilo-impreso`
- `#/producto/rotulacion-furgonetas`
- `#/producto/textil-personalizado`

### Flujos

- `#/carrito`
- `#/checkout`
- `#/upload`
- `#/admin`

## 3. Estructura recomendada de carpetas

```text
public/assets/
  brand/
  storefront/
    home/
    catalog/
    categories/
  products/
    dti/
    stickers/
    cards/
    flyers/
    vinyl/
    wrap/
    textile/
  templates/
    dti-meter/
    stickers/
    business-cards/
    flyers/
    printed-vinyl/
    signage/
    textile/
    vehicle-wrap/
  overlays/
    prepress/
    cinematic/
  admin/
  documents/
  seo/
  fallbacks/
  future-storage/
```

### Uso de cada carpeta

- `brand/`: logos, favicon, apple icon, schema logo
- `storefront/home/`: hero y escenas visuales de portada
- `storefront/catalog/`: hero del catalogo, families y spotlight
- `storefront/categories/`: heroes y visuales por landing de categoria
- `products/`: assets especificos de PDP por familia
- `templates/`: plantillas descargables para cliente
- `overlays/prepress/`: guias SVG funcionales
- `overlays/cinematic/`: overlays decorativos, glows y texturas
- `admin/`: visuales de estados, validaciones y marcos internos
- `documents/`: logos, marcas de agua y recursos de PDF
- `seo/`: OpenGraph, social previews, schema images
- `fallbacks/`: fallbacks dark garage y variantes low bandwidth
- `future-storage/`: naming de referencia para migracion futura

## 4. Assets globales de marca

Estado actual implementado en storefront:

- cabecera real: `/public/assets/brand/ridaos-logo-main.png`
- favicon runtime: `/public/favicon-32.png` y `/public/favicon-48.png`
- icono iOS: `/public/apple-touch-icon.png`
- marca cuadrada para schema y accesos: `/public/assets/brand/ridaos-mark-square-512.png`

Assets maestros y derivados recomendados:

| Asset ID | Archivo sugerido | Ruta | Uso | Formato principal | Alternativo | Tamano recomendado | Prioridad |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `brand-logo-main-runtime` | `ridaos-logo-main.png` | `/public/assets/brand/ridaos-logo-main.png` | logo real de cabecera y fallback visual principal | PNG | WebP | 2048 px lado largo aprox. | alta |
| `brand-logo-main-master` | `ridaos-logo-main.svg` | `/public/assets/brand/ridaos-logo-main.svg` | master vector futuro para storefront y documentos | SVG | PDF | vector | alta |
| `brand-logo-horizontal` | `ridaos-logo-horizontal.svg` | `/public/assets/brand/ridaos-logo-horizontal.svg` | versiones limpias para documentos o layouts horizontales | SVG | PNG | vector | media |
| `brand-logo-white` | `ridaos-logo-white.svg` | `/public/assets/brand/ridaos-logo-white.svg` | fondos oscuros con bajo contraste de imagen | SVG | PNG | vector | media |
| `brand-logo-dark` | `ridaos-logo-dark.svg` | `/public/assets/brand/ridaos-logo-dark.svg` | documentos o fondos claros | SVG | PNG | vector | media |
| `brand-mark-square` | `ridaos-mark-square-512.png` | `/public/assets/brand/ridaos-mark-square-512.png` | schema logo, atajo cuadrado, thumbnail corporativo | PNG | SVG | 512x512 | alta |
| `brand-favicon-32` | `favicon-32.png` | `/public/favicon-32.png` | favicon principal runtime | PNG | ICO | 32x32 | alta |
| `brand-favicon-48` | `favicon-48.png` | `/public/favicon-48.png` | favicon ampliado y fallback browser | PNG | ICO | 48x48 | media |
| `brand-apple-touch` | `apple-touch-icon.png` | `/public/apple-touch-icon.png` | iOS shortcut y bookmark icon | PNG | JPG | 180x180 | media |
| `brand-schema-logo` | `schema-logo-512.png` | `/public/assets/brand/schema-logo-512.png` | alternativa limpia para `Organization` / `LocalBusiness` | PNG | SVG | 512x512 | media |
| `brand-document-watermark` | `document-watermark-v1.png` | `/public/assets/documents/document-watermark-v1.png` | marcas de agua en PDF | PNG | SVG | 1200x1200 | media |
| `brand-print-safe` | `print-safe-logo-v1.svg` | `/public/assets/documents/print-safe-logo-v1.svg` | reportes tecnicos, plantillas y documentos | SVG | PNG | vector | media |

## 4.1. Color y direccion visual para assets

Todos los assets nuevos del storefront deben respetar esta direccion:

- fondo base: negro profundo, charcoal, grafito o ladrillo oscuro
- luz/acento: verde fluor de marca, fucsia y cyan solo como apoyo controlado
- contraste: producto o mensaje siempre por encima del efecto atmosferico
- look general: garage urbano exclusivo, no gaming, no SaaS neutro

Reglas visuales para diseno:

- no usar fondos blancos en home, catalogo, categorias ni PDPs
- no rellenar el asset con neones; los acentos deben ocupar una parte pequena de la composicion
- el verde es el acento principal de accion y presencia
- el fucsia se reserva a detalles premium, energia editorial o piezas especiales
- el cyan apoya informacion tecnica, materiales, prepress y contraste frio
- las texturas deben ser sutiles: asfalto, metal, ladrillo oscuro, reflejo de vinilo, luz de taller
- los heroes deben conservar lectura clara para overlay de copy
- los fallbacks deben parecer composiciones intencionales, nunca “imagen faltante”

Reglas para print-safe y documentos:

- documentos, reportes y plantillas no deben heredar fondos oscuros del storefront
- prioridad absoluta a legibilidad, blanco de papel y contrastes limpios
- si se usa color de marca en documento, que sea muy contenido y nunca dominante

## 5. Assets de Home

Home usa assets editoriales y atmosfericos, no assets de configurador.

| Asset ID | Archivo | Ruta | Uso | Formato | Tamano recomendado | Peso maximo | Tipo | Prioridad |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `home-hero-garage` | `home-garage-hero-v1.webp` | `/public/assets/storefront/home/home-garage-hero-v1.webp` | hero principal | WebP | 2400x1600 | 450 KB | decorativo | alta |
| `home-hero-dti` | `home-dti-textile-hero-v1.webp` | `/public/assets/storefront/home/home-dti-textile-hero-v1.webp` | bloque protagonista DTI | WebP | 2400x1600 | 450 KB | decorativo | alta |
| `home-hero-wrap` | `home-wrap-vehicle-hero-v1.webp` | `/public/assets/storefront/home/home-wrap-vehicle-hero-v1.webp` | bloque rotulacion | WebP | 2400x1600 | 450 KB | decorativo | alta |
| `home-texture-brick` | `dark-brick-texture-v1.webp` | `/public/assets/storefront/home/dark-brick-texture-v1.webp` | textura sutil de fondo | WebP | 1600x1600 | 180 KB | decorativo | media |
| `home-glow-green` | `green-neon-glow-overlay-v1.webp` | `/public/assets/overlays/cinematic/green-neon-glow-overlay-v1.webp` | acento glow verde | WebP | 2000x2000 | 180 KB | decorativo | baja |
| `home-glow-pink-cyan` | `pink-cyan-glow-overlay-v1.webp` | `/public/assets/overlays/cinematic/pink-cyan-glow-overlay-v1.webp` | acento glow fucsia/cyan | WebP | 2000x2000 | 180 KB | decorativo | baja |
| `home-production-detail` | `home-production-detail-v1.webp` | `/public/assets/storefront/home/home-production-detail-v1.webp` | bloque proceso / confianza | WebP | 1800x1200 | 280 KB | decorativo | media |
| `home-final-scene` | `home-final-brand-scene-v1.webp` | `/public/assets/storefront/home/home-final-brand-scene-v1.webp` | CTA final | WebP | 2200x1400 | 320 KB | decorativo | media |

### Referencia en codigo

- `src/content/homeContent.ts`
- `src/sections/home/*`
- `src/lib/seo.ts` para OG home

## 6. Assets de Catalogo

Catalogo es escaparate visual. No debe depender de assets tecnicos ni de plantillas.

| Asset ID | Archivo | Ruta | Uso | Referencia en codigo | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `catalog-hero-garage` | `catalog-hero-garage-v1.webp` | `/public/assets/storefront/catalog/catalog-hero-garage-v1.webp` | hero catalogo | `src/content/catalogContent.ts` | alta |
| `catalog-family-dti` | `catalog-family-dti-v1.webp` | `/public/assets/storefront/catalog/catalog-family-dti-v1.webp` | family card DTI | `src/features/catalog/catalogFamilies.ts` | alta |
| `catalog-family-wrap` | `catalog-family-wrap-v1.webp` | `/public/assets/storefront/catalog/catalog-family-wrap-v1.webp` | family card rotulacion | `src/features/catalog/catalogFamilies.ts` | alta |
| `catalog-family-textile` | `catalog-family-textile-v1.webp` | `/public/assets/storefront/catalog/catalog-family-textile-v1.webp` | family card textil | `src/features/catalog/catalogFamilies.ts` | media |
| `catalog-family-stickers` | `catalog-family-stickers-v1.webp` | `/public/assets/storefront/catalog/catalog-family-stickers-v1.webp` | family card pegatinas | `src/features/catalog/catalogFamilies.ts` | media |
| `catalog-family-cards` | `catalog-family-cards-v1.webp` | `/public/assets/storefront/catalog/catalog-family-cards-v1.webp` | family card tarjetas | `src/features/catalog/catalogFamilies.ts` | media |
| `catalog-family-flyers` | `catalog-family-flyers-v1.webp` | `/public/assets/storefront/catalog/catalog-family-flyers-v1.webp` | family card flyers | `src/features/catalog/catalogFamilies.ts` | media |
| `catalog-family-vinyl` | `catalog-family-vinyl-v1.webp` | `/public/assets/storefront/catalog/catalog-family-vinyl-v1.webp` | family card vinilo | `src/features/catalog/catalogFamilies.ts` | media |
| `catalog-spotlight-dti` | `catalog-spotlight-dti-v1.webp` | `/public/assets/storefront/catalog/catalog-spotlight-dti-v1.webp` | bloque destacado DTI | `src/pages/Catalogo.tsx` | alta |
| `catalog-spotlight-wrap` | `catalog-spotlight-wrap-v1.webp` | `/public/assets/storefront/catalog/catalog-spotlight-wrap-v1.webp` | bloque destacado rotulacion | `src/pages/Catalogo.tsx` | alta |
| `catalog-process-check` | `catalog-process-file-check-v1.webp` | `/public/assets/storefront/catalog/catalog-process-file-check-v1.webp` | bloque proceso | `src/content/catalogContent.ts` | media |

### Fallback de catalogo

Si no existe imagen real:

- usar `StorefrontFamilyVisual`
- fallback previsto: `/public/assets/fallbacks/fallback-catalog-family-v1.webp`

## 7. Assets de Categorias

Las landings de categoria usan hero, visual secundario y fallback. Referencia principal: `src/features/catalog/categoryContent.ts`.

| Categoria | Hero principal | Visual secundario | Visual terciario | Ruta base | Prioridad |
| --- | --- | --- | --- | --- | --- |
| DTI | `category-dti-hero-v1.webp` | `category-dti-roll-detail-v1.webp` | `category-dti-textile-application-v1.webp` | `/public/assets/storefront/categories/` | alta |
| Rotulacion | `category-wrap-hero-van-v1.webp` | `category-wrap-garage-detail-v1.webp` | `category-wrap-installation-v1.webp` | `/public/assets/storefront/categories/` | alta |
| Textil | `category-textile-hero-v1.webp` | `category-textile-hoodie-v1.webp` | `category-textile-closeup-v1.webp` | `/public/assets/storefront/categories/` | media |
| Pegatinas | `category-stickers-hero-v1.webp` | `category-stickers-sheet-v1.webp` | `category-stickers-detail-v1.webp` | `/public/assets/storefront/categories/` | media |
| Tarjetas | `category-cards-hero-v1.webp` | `category-cards-stack-v1.webp` | `category-cards-premium-finish-v1.webp` | `/public/assets/storefront/categories/` | media |
| Flyers | `category-flyers-hero-v1.webp` | `category-flyers-stack-v1.webp` | `category-flyers-detail-v1.webp` | `/public/assets/storefront/categories/` | media |
| Vinilo impreso | `category-vinyl-hero-v1.webp` | `category-vinyl-panel-v1.webp` | `category-vinyl-wall-v1.webp` | `/public/assets/storefront/categories/` | media |

### Fallback de categorias

- `/public/assets/fallbacks/fallback-category-hero-v1.webp`
- implementacion: `src/features/catalog/CategoryLandingPage.tsx`

## 8. Assets de PDPs por producto

### DTI por metro

Ruta base: `/public/assets/products/dti/`

| Tipo | Archivo | Uso | Prioridad |

### Tarjetas de visita

Ruta base: `/public/assets/previews/cards/`

Assets esperados para el configurador premium:

- `business-card-standard-preview.webp`
- `business-card-square-preview.webp`
- `business-card-rounded-preview.webp`
- `business-card-gold-foil-preview.webp`
- `business-card-silver-foil-preview.webp`
- `business-card-3d-varnish-preview.webp`
- `business-card-soft-touch-preview.webp`
- `business-card-stack-premium.webp`

Regla:

- si falta una variante concreta, usar `business-card-stack-premium.webp` como fallback editorial
- no mostrar estados tipo placeholder ni “imagen pendiente” en UI publica

### Flyers y folletos

Ruta base: `/public/assets/previews/paper/`

Assets esperados para el configurador premium:

- `flyer-a3-preview.webp`
- `flyer-a4-preview.webp`
- `flyer-a5-preview.webp`
- `flyer-a6-preview.webp`
- `flyer-stack-preview.webp`
- `flyer-double-sided-preview.webp`
- `flyer-soft-touch-preview.webp`

Regla:

- si falta un formato puntual, usar `flyer-stack-preview.webp` como fallback premium
- el fallback debe seguir pareciendo una pieza editorial, no un recurso tecnico vacio
| --- | --- | --- | --- |
| Hero | `dti-product-hero-roll-v1.webp` | hero PDP | alta |
| Galeria | `dti-meter-preview-v1.webp` | preview principal | alta |
| Galeria | `dti-transfer-texture-v1.webp` | detalle textura | media |
| Galeria | `dti-textile-application-v1.webp` | aplicacion textil | media |
| Overlay | `dti-spacing-guide-v1.svg` | guia separacion | alta |
| Overlay | `dti-width-measure-overlay-v1.svg` | ancho util | alta |
| Preview plantilla | `dti-template-preview-v1.webp` | card de descarga | media |
| Plantilla | `dti-meter-template-master-v1.pdf` | plantilla cliente | alta |

Referencias:

- `src/pages/DTFPage.tsx`
- `src/features/products/product-detail/data/productExperienceContent.ts`
- `src/features/product-options/data/productOptionDefinitions.ts`

### Pegatinas personalizadas

Ruta base: `/public/assets/products/stickers/`

| Tipo | Archivo | Uso | Prioridad |
| --- | --- | --- | --- |
| Hero | `stickers-product-hero-v1.webp` | hero PDP | alta |
| Galeria | `sticker-sheet-preview-v1.webp` | hoja principal | alta |
| Opcion | `sticker-square-preview-v1.webp` | forma cuadrada | media |
| Opcion | `sticker-circle-preview-v1.webp` | forma circular | media |
| Opcion | `sticker-custom-shape-preview-v1.webp` | forma personalizada | media |
| Overlay | `sticker-cutline-overlay-v1.svg` | corte completo | alta |
| Overlay | `sticker-kisscut-overlay-v1.svg` | kiss cut | media |
| Overlay | `sticker-bleed-guide-v1.svg` | sangrado | alta |
| Plantilla | `stickers-template-master-v1.pdf` | plantilla principal | alta |

### Tarjetas de visita

Ruta base: `/public/assets/products/cards/`

| Tipo | Archivo | Uso | Prioridad |
| --- | --- | --- | --- |
| Hero | `cards-product-hero-v1.webp` | hero PDP | alta |
| Galeria | `business-card-stack-v1.webp` | stack principal | alta |
| Opcion | `business-card-standard-preview-v1.webp` | formato estandar | alta |
| Opcion | `business-card-square-preview-v1.webp` | formato cuadrado | media |
| Opcion | `business-card-rounded-preview-v1.webp` | esquinas redondeadas | media |
| Opcion | `business-card-gold-foil-preview-v1.webp` | foil oro | media |
| Opcion | `business-card-silver-foil-preview-v1.webp` | foil plata | media |
| Opcion | `business-card-3d-varnish-preview-v1.webp` | barniz 3D | media |
| Opcion | `business-card-soft-touch-preview-v1.webp` | soft touch | media |
| Plantilla | `business-card-template-master-v1.pdf` | plantilla principal | alta |

### Flyers personalizados

Ruta base: `/public/assets/products/flyers/`

| Tipo | Archivo | Uso | Prioridad |
| --- | --- | --- | --- |
| Hero | `flyers-product-hero-v1.webp` | hero PDP | media |
| Opcion | `flyer-a6-preview-v1.webp` | formato A6 | media |
| Opcion | `flyer-a5-preview-v1.webp` | formato A5 | media |
| Opcion | `flyer-a4-preview-v1.webp` | formato A4 | media |
| Galeria | `flyer-stack-preview-v1.webp` | stack principal | media |
| Opcion | `flyer-double-sided-preview-v1.webp` | doble cara | media |
| Opcion | `flyer-soft-touch-preview-v1.webp` | acabado premium | baja |
| Plantilla | `flyer-template-master-v1.pdf` | plantilla principal | media |

### Vinilo impreso

Ruta base: `/public/assets/products/vinyl/`

| Tipo | Archivo | Uso | Prioridad |
| --- | --- | --- | --- |
| Hero | `vinyl-product-hero-v1.webp` | hero PDP | media |
| Galeria | `vinyl-panel-preview-v1.webp` | panel principal | media |
| Galeria | `vinyl-wall-graphic-preview-v1.webp` | pared / escaparate | media |
| Galeria | `vinyl-large-format-roll-v1.webp` | rollo gran formato | baja |
| Overlay | `vinyl-panel-guide-v1.svg` | guia panel | media |
| Plantilla | `printed-vinyl-template-master-v1.pdf` | plantilla principal | media |

### Rotulacion de furgonetas

Ruta base: `/public/assets/products/wrap/`

| Tipo | Archivo | Uso | Prioridad |
| --- | --- | --- | --- |
| Hero | `wrap-product-hero-van-v1.webp` | hero PDP | alta |
| Galeria | `wrap-van-side-transparent-v1.webp` | lateral principal | alta |
| Galeria | `wrap-van-front-transparent-v1.webp` | tres cuartos | media |
| Galeria | `wrap-car-side-transparent-v1.webp` | turismo secundario | baja |
| Galeria | `wrap-before-after-preview-v1.webp` | comparativa | media |
| Detalle | `vinyl-installation-detail-v1.webp` | instalacion | media |
| Overlay | `vehicle-template-side-v1.svg` | silueta tecnica | alta |
| Overlay | `vehicle-safe-area-overlay-v1.svg` | zonas a evitar | alta |
| Plantilla | `vehicle-wrap-template-master-v1.pdf` | plantilla lateral | media |

### Textil personalizado

Ruta base: `/public/assets/products/textile/`

| Tipo | Archivo | Uso | Prioridad |
| --- | --- | --- | --- |
| Hero | `textile-product-hero-v1.webp` | hero PDP | media |
| Opcion | `tshirt-front-transparent-v1.webp` | camiseta frontal | media |
| Opcion | `tshirt-back-transparent-v1.webp` | camiseta trasera | baja |
| Opcion | `hoodie-front-transparent-v1.webp` | sudadera frontal | media |
| Opcion | `hoodie-back-transparent-v1.webp` | sudadera trasera | baja |
| Opcion | `oversized-tee-front-transparent-v1.webp` | oversized tee | baja |
| Opcion | `tote-bag-front-transparent-v1.webp` | tote bag | baja |
| Overlay | `textile-placement-guide-v1.svg` | area de impresion | alta |
| Plantilla | `textile-print-area-template-master-v1.pdf` | plantilla textil | media |

## 9. Assets de configuradores

Los configuradores no deben depender del hero pesado. Necesitan assets ligeros, legibles y tecnicos.

| Producto | Asset funcional | Tipo | Referencia en codigo | Prioridad |
| --- | --- | --- | --- | --- |
| DTI | `dti-meter-preview-v1.webp` | preview card | `productOptionDefinitions.ts` / `DTFPage.tsx` | alta |
| DTI | `dti-spacing-guide-v1.svg` | overlay tecnico | `productOptionDefinitions.ts` | alta |
| Pegatinas | `sticker-square-preview-v1.webp` | opcion seleccionable | `productOptionDefinitions.ts` | media |
| Pegatinas | `sticker-cutline-overlay-v1.svg` | overlay tecnico | `productOptionDefinitions.ts` | alta |
| Tarjetas | `business-card-soft-touch-preview-v1.webp` | preview de acabado | `productOptionDefinitions.ts` | media |
| Flyers | `flyer-double-sided-preview-v1.webp` | preview doble cara | `productOptionDefinitions.ts` | media |
| Vinilo | `vinyl-panel-guide-v1.svg` | guia tecnica | `productOptionDefinitions.ts` | media |
| Rotulacion | `vehicle-template-side-v1.svg` | briefing visual | `productOptionDefinitions.ts` | alta |
| Textil | `textile-placement-guide-v1.svg` | guia de posicion | `productOptionDefinitions.ts` | alta |

### Regla

- preview funcional: WebP o PNG ligero
- guia tecnica: SVG
- fallback: usar los paneles dark garage ya implementados en `ProductOptionAssetPanel.tsx`

## 10. Assets de Upload / Prepress

Rutas base:

- `/public/assets/overlays/prepress/`
- `/public/assets/fallbacks/`
- `/public/assets/admin/`

| Asset ID | Archivo | Tipo | Uso principal | Prioridad |
| --- | --- | --- | --- | --- |
| `prepress-safe-area` | `safe-area-overlay-v1.svg` | funcional | zona segura general | alta |
| `prepress-bleed` | `bleed-overlay-v1.svg` | funcional | sangrado general | alta |
| `prepress-cutline` | `cutline-overlay-v1.svg` | funcional | linea de corte | alta |
| `prepress-measurement-grid` | `measurement-grid-v1.svg` | funcional | grid tecnico | media |
| `prepress-warning` | `warning-overlay-v1.svg` | funcional | warnings visuales | baja |
| `prepress-dti-spacing` | `dti-spacing-guide-v1.svg` | funcional | separacion DTI | alta |
| `prepress-dti-width` | `dti-width-measure-overlay-v1.svg` | funcional | ancho util DTI | alta |
| `prepress-sticker-contour` | `sticker-contour-guide-v1.svg` | funcional | contorno pegatina | media |
| `prepress-card-trim` | `card-trim-guide-v1.svg` | funcional | corte tarjeta | media |
| `prepress-vinyl-panel` | `vinyl-panel-guide-v1.svg` | funcional | panel vinilo | media |
| `prepress-vehicle-safe-area` | `vehicle-safe-area-overlay-v1.svg` | funcional | wrap vehiculo | alta |
| `prepress-textile-placement` | `textile-placement-guide-v1.svg` | funcional | area textil | alta |
| `upload-placeholder` | `upload-placeholder-v1.webp` | decorativo/UX | empty state upload | media |
| `technical-preview-frame` | `technical-preview-frame-v1.webp` | decorativo/UX | marco de vista previa | media |

## 11. Assets de Carrito / Checkout

Rutas base:

- `/public/assets/storefront/checkout/`

| Archivo | Uso | Formato | Tamano recomendado | Prioridad |
| --- | --- | --- | --- | --- |
| `cart-empty-visual-v1.webp` | carrito vacio | WebP | 1600x1200 | media |
| `checkout-confirmation-visual-v1.webp` | confirmacion de solicitud | WebP | 1600x1200 | media |
| `request-received-visual-v1.webp` | success modal o confirmacion | WebP | 1600x1200 | media |
| `technical-review-visual-v1.webp` | cierre con revision tecnica | WebP | 1600x1200 | baja |

Regla: no prometer pago real. Son visuales de cierre de solicitud o revision.

## 12. Assets de Admin / documentos

Rutas base:

- `/public/assets/admin/`
- `/public/assets/documents/`

| Archivo | Uso | Formato | Prioridad |
| --- | --- | --- | --- |
| `upload-placeholder-v1.webp` | empty state uploads | WebP | media |
| `validation-icons-v1.svg` | checks, warning, ok | SVG | media |
| `technical-preview-frame-v1.webp` | marcos de revision | WebP | media |
| `document-header-logo-v1.svg` | encabezados PDF | SVG | alta |
| `document-watermark-v1.png` | marca de agua | PNG | media |
| `approval-stamp-v1.png` | sello visual de aprobacion | PNG | baja |
| `signature-block-v1.png` | firma/sello visual | PNG | baja |
| `print-safe-logo-v1.svg` | logo print-safe | SVG | media |

## 13. Assets SEO / OpenGraph

Ruta base: `/public/assets/seo/`

Todos los OG principales:

- 1200x630 px
- JPG principal
- WebP alternativo
- menos de 250 KB cuando sea posible

| Archivo | Uso | Referencia |
| --- | --- | --- |
| `og-home-v1.jpg` | home | `seo.ts` |
| `og-catalogo-v1.jpg` | catalogo | `seo.ts` |
| `og-dti-v1.jpg` | categoria o PDP DTI | `seo.ts` |
| `og-rotulacion-v1.jpg` | categoria o PDP rotulacion | `seo.ts` |
| `og-textil-v1.jpg` | categoria textil | `seo.ts` |
| `og-pegatinas-v1.jpg` | categoria pegatinas | `seo.ts` |
| `og-tarjetas-v1.jpg` | categoria tarjetas | `seo.ts` |
| `og-flyers-v1.jpg` | categoria flyers | `seo.ts` |
| `og-vinilo-v1.jpg` | categoria vinilo | `seo.ts` |
| `og-product-dti-v1.jpg` | PDP DTI | `seo.ts` |
| `og-product-wrap-v1.jpg` | PDP rotulacion | `seo.ts` |

## 14. Fallbacks visuales

Ruta base: `/public/assets/fallbacks/`

| Archivo | Uso | Prioridad |
| --- | --- | --- |
| `fallback-dark-garage-card-v1.webp` | fallback generico de card | alta |
| `fallback-product-hero-v1.webp` | fallback de hero PDP | alta |
| `fallback-category-hero-v1.webp` | fallback de hero categoria | alta |
| `fallback-catalog-family-v1.webp` | fallback de family card | alta |
| `fallback-low-bandwidth-v1.webp` | variante ligera | baja |
| `fallback-reduced-motion-v1.svg` | reduced motion | baja |

Regla:

- no mostrar texto tipo `imagen pendiente`
- no mostrar nombre de archivo
- el fallback debe sentirse parte del sistema dark garage

## 15. Plantillas descargables

| Familia | Ruta | Archivo maestro | Formatos esperados | Capas obligatorias |
| --- | --- | --- | --- | --- |
| DTI | `/public/assets/templates/dti-meter/` | `dti-meter-template-master-v1.pdf` | PDF, AI, SVG | `01_ARTWORK_AQUI`, `02_ZONA_SEGURA`, `03_LINEA_CORTE`, `04_SANGRADO`, `05_NOTAS_NO_IMPRIMIR` |
| Pegatinas | `/public/assets/templates/stickers/` | `stickers-template-master-v1.pdf` | PDF, AI, SVG | mismas capas |
| Tarjetas | `/public/assets/templates/business-cards/` | `business-card-template-master-v1.pdf` | PDF, AI, SVG | mismas capas |
| Flyers | `/public/assets/templates/flyers/` | `flyer-template-master-v1.pdf` | PDF, AI, SVG | mismas capas |
| Vinilo impreso | `/public/assets/templates/printed-vinyl/` | `printed-vinyl-template-master-v1.pdf` | PDF, AI, SVG | mismas capas |
| Carteleria | `/public/assets/templates/signage/` | `signage-template-master-v1.pdf` | PDF, AI, SVG | mismas capas |
| Textil | `/public/assets/templates/textile/` | `textile-print-area-template-master-v1.pdf` | PDF, AI, SVG | mismas capas |
| Rotulacion vehiculos | `/public/assets/templates/vehicle-wrap/` | `vehicle-wrap-template-master-v1.pdf` | PDF, AI, SVG | mismas capas |

Colores recomendados:

- sangrado: verde
- corte: magenta
- zona segura: azul
- notas: gris

## 16. Naming convention

- lowercase
- kebab-case
- sin espacios
- sin acentos
- sufijo de version: `-v1`
- agrupar por dominio visual

Ejemplos:

- `home-garage-hero-v1.webp`
- `catalog-family-wrap-v1.webp`
- `wrap-product-hero-van-v1.webp`
- `business-card-template-master-v1.pdf`
- `vehicle-safe-area-overlay-v1.svg`

## 17. Prioridades de produccion

### Prioridad 1

- logos y variantes base
- `home-garage-hero-v1.webp`
- `catalog-family-dti-v1.webp`
- `catalog-family-wrap-v1.webp`
- `dti-product-hero-roll-v1.webp`
- `wrap-product-hero-van-v1.webp`
- `og-home-v1.jpg`
- `og-catalogo-v1.jpg`
- `og-dti-v1.jpg`
- `og-rotulacion-v1.jpg`
- overlays prepress basicos
- plantillas DTI, pegatinas y tarjetas

### Prioridad 2

- categorias restantes
- PDPs de pegatinas, tarjetas, flyers, vinilo y textil
- visuales de carrito y checkout
- assets admin y documents
- plantillas completas del resto de familias

### Prioridad 3

- overlays atmosfericos
- variantes secundarias
- before/after
- assets locales de Blanes, Girona y Costa Brava
- fallback low bandwidth
- extras sociales

## 18. Mapa de implementacion en codigo

| Grupo de asset | Archivo data/componente | Como se cambia |
| --- | --- | --- |
| Home hero | `src/content/homeContent.ts` | actualizar campos de visual o hero |
| Catalog family cards | `src/features/catalog/catalogFamilies.ts` | cambiar `image` por familia |
| Category hero | `src/features/catalog/categoryContent.ts` | cambiar `heroImage` |
| Catalog spotlight | `src/content/catalogContent.ts` / `src/pages/Catalogo.tsx` | actualizar assets de bloque |
| PDP hero | `src/features/products/product-detail/data/productExperienceContent.ts` | hero y galeria por producto |
| PDP hero visual | `src/features/product-options/components/ProductVisualHero.tsx` | lee `hero.asset.expectedPath` |
| PDP gallery | `src/features/products/product-gallery/ProductGalleryFrame.tsx` | lee `assetPath` |
| Option preview | `src/features/product-options/data/productOptionDefinitions.ts` | `option.asset` |
| Fallback catalogo | `src/features/catalog/components/StorefrontFamilyVisual.tsx` | fallback interno dark garage |
| Fallback categoria | `src/features/catalog/CategoryLandingPage.tsx` | hero visual y fallback |
| Fallback PDP | `src/features/product-options/components/ProductVisualHero.tsx` y `ProductGalleryFrame.tsx` | fondos dark garage |
| SEO OG | `src/lib/seo.ts` | `ogImage` por ruta |

## 19. Checklist para disenadora

Para cada asset entregar:

- WebP optimizado si es raster
- PNG transparente si requiere alpha
- SVG si es overlay o guia
- PDF/AI/SVG si es plantilla
- tamano correcto
- nombre exacto
- carpeta exacta
- version `v1`
- sin espacios ni acentos
- sin exportar imagenes gigantes
- sin texto pequeno ilegible
- sin fondos blancos salvo peticion expresa
- mantener estetica dark garage premium
- usar verde, fucsia y cyan con control

## 20. Checklist para integracion futura

Antes de integrar un asset real:

- verificar que el archivo existe
- verificar peso y dimensiones
- actualizar la data correspondiente
- probar la ruta en local
- revisar mobile
- correr `npm run build`
- no tocar JSX si solo cambia imagen
- mantener fallback activo

## 21. Preparacion para Supabase Storage futuro

Estructura sugerida para migracion:

```text
brand/
storefront/home/
storefront/catalog/
storefront/categories/
products/{family}/
templates/{family}/
overlays/prepress/
documents/
seo/
uploads/
prepress-derived/
```

Notas:

- no activar storage real todavia
- conservar naming del filesystem actual para que la migracion sea mecanica
- `templates/*`, `seo/*` y `products/*` son los primeros candidatos a versionado
- `uploads/` y `prepress-derived/` quedan reservados para derivados de usuario cuando exista backend real

## 22. Assets obsoletos o a retirar del inventario legacy

Detectados en documentacion anterior:

- carpetas `public/assets/cinematic/*` como centro principal del storefront
- carpeta `public/assets/previews/*` como unica taxonomia de producto
- nombres visibles con `mock`:
  - `approval-stamp-mock-v1.png`
  - `signature-block-mock-v1.png`
- naming antiguo centrado en `dtf-*` en lugar de `dti-*`
- referencias a `paper/` como familia principal cuando hoy la separacion real es `tarjetas` y `flyers`

No hace falta borrar documentacion legacy de inmediato, pero estos nombres ya no deben usarse como referencia principal.
