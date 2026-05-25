# RidaosPrint — Inventario Maestro de Assets

## 1. Resumen ejecutivo

Este documento consolida en una sola fuente los assets que necesita RidaosPrint para completar la web sin tocar la logica funcional actual. El proyecto ya tiene una arquitectura modular preparada para:

- home cinematografica con escenas GSAP y overlays editoriales
- fichas de producto premium con storytelling y configuradores
- flujo profesional de subida de artwork, preprensa y preview
- plantillas descargables por producto
- admin operativo, prepress, reporting y documentos print-safe
- SEO local, OpenGraph, hubs semanticos y discoverability
- futura migracion a storage real sin reescribir UI

Principios de este inventario:

- `DTI` es el naming visual/comercial principal.
- `DTF` se conserva como keyword SEO secundaria y tecnica cuando conviene.
- Todo asset aqui listado debe vivir bajo `public/assets/` o estar preparado para migrarse despues a storage real.
- Se distinguen assets `decorativos` de assets `funcionales`.
- Se prioriza `WebP` para visuales raster, `SVG` para overlays/guias y `PDF/AI/SVG/CDR` para plantillas.

Fuentes cruzadas para este inventario:

- `src/motion/cinematic/*`
- `src/sections/home/*`
- `src/features/artwork-upload/*`
- `src/features/prepress/*`
- `src/features/print-templates/*`
- `src/features/documents/*`
- `src/features/reporting/*`
- `src/features/products/*`
- `src/features/operations/*`
- `src/config/siteMap.ts`
- `docs/CINEMATIC_ASSET_REQUIREMENTS.md`
- `docs/PRINT_TEMPLATE_ASSETS.md`
- `docs/ARTWORK_UPLOAD_WORKFLOW.md`
- `docs/STORAGE_ARCHITECTURE.md`

## 2. Estructura recomendada de carpetas

```text
/public/assets/
  /brand/
  /cinematic/
    /home/
    /dti/
    /wrap/
  /previews/
    /textile/
    /dti/
    /stickers/
    /cards/
    /vinyl/
    /signage/
    /paper/
    /vehicles/
  /templates/
    /dti-meter/
    /stickers/
    /business-cards/
    /printed-vinyl/
    /signage/
    /textile/
    /paper/
    /vehicle-wrap/
  /overlays/
    /prepress/
    /cinematic/
  /seo/
  /admin/
  /documents/
  /fallbacks/
  /future-storage/
```

Notas:

- `cinematic/` agrupa assets decorativos o hero para escenas con transparencia.
- `previews/` agrupa mockups y vistas funcionales por familia de producto.
- `templates/` agrupa descargas para cliente y referencia tecnica.
- `overlays/prepress/` agrupa SVG funcionales con guias no imprimibles.
- `admin/` y `documents/` agrupan recursos internos para prepress, reporting y print-safe views.
- `future-storage/` no se usa aun en runtime, pero define placeholders de naming para migracion futura.

## 3. Home cinematografica

Analisis basado en:

- `src/motion/cinematic/cinematicScenes.ts`
- `src/motion/cinematic/cinematicAssets.ts`
- `src/sections/home/*`
- `docs/CINEMATIC_ASSET_REQUIREMENTS.md`

Recordatorio de producto principal:

- visual/comercial: `DTI`
- keyword SEO secundaria: `DTF`

### 3.1 Tabla de assets para escenas cinematicas

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Uso / escena | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home cinematografica | `asset-cine-home-dti-roll` | `dti-roll-transparent-v1.webp` | Rollo DTI sin fondo | Bobina o fragmento de DTI para profundidad hero | `HERO_CINEMATIC` | `CINEMATIC_SCROLL_SYSTEM`, `HOME_HERO` | `/public/assets/cinematic/home/dti-roll-transparent-v1.webp` | WebP | PNG | 2600x1600 px | 13:8 | 450 KB | si | no | decorativo | alta | requerido | bordes limpios, sin halo, transparencia real | rollo DTI editorial, brillo suave, sin fondo |
| Home cinematografica | `asset-cine-home-textile-hoodie` | `textile-hoodie-transparent-v1.webp` | Sudadera/camiseta textil sin fondo | Prenda protagonista para transicion textil-DTI | `TEXTILE_DTI_TRANSITION` | `CINEMATIC_SCROLL_SYSTEM`, `HOME_FOUNDATION` | `/public/assets/cinematic/home/textile-hoodie-transparent-v1.webp` | WebP | PNG | 2400x3000 px | 4:5 | 550 KB | si | no | decorativo | alta | requerido | mangas y costuras legibles, sin fondo | hoodie premium flotante, foto recortada sin fondo |
| Home cinematografica | `asset-cine-home-wrap-van-side` | `wrap-van-side-transparent-v1.webp` | Furgoneta lateral sin fondo | Hero de rotulacion comercial y flotas | `VEHICLE_WRAP_TRANSITION` | `CINEMATIC_SCROLL_SYSTEM`, `HOME_PROCESS` | `/public/assets/cinematic/home/wrap-van-side-transparent-v1.webp` | WebP | PNG | 3200x1800 px | 16:9 | 650 KB | si | no | decorativo | alta | requerido | dejar aire en techo y frontal para no invadir copy | furgoneta comercial lateral, limpia, recortada |
| Home cinematografica | `asset-cine-home-wrap-car-side` | `wrap-car-side-transparent-v1.webp` | Turismo lateral sin fondo | Variante secundaria para vehiculos particulares | `VEHICLE_WRAP_TRANSITION` | `CINEMATIC_SCROLL_SYSTEM`, `HOME_PROCESS` | `/public/assets/cinematic/home/wrap-car-side-transparent-v1.webp` | WebP | PNG | 3200x1800 px | 16:9 | 650 KB | si | no | decorativo | media | futuro | version secundaria para alternar con van | coche lateral elegante, wrapping parcial |
| Home cinematografica | `asset-cine-home-print-detail` | `print-detail-transparent-v1.webp` | Detalle de impresion sin fondo | Macro de tinta, maquina o mano de produccion | `PRODUCTION_DETAIL_TRANSITION` | `CINEMATIC_SCROLL_SYSTEM`, `HOME_EDITORIAL` | `/public/assets/cinematic/home/print-detail-transparent-v1.webp` | WebP | PNG | 2600x1600 px | 13:8 | 500 KB | si | no | decorativo | alta | requerido | textura rica, sin fondo artificial | macro de cabezal, tinta, material impreso |
| Home cinematografica | `asset-cine-home-brand-reveal` | `final-brand-object-v1.webp` | Objeto final de marca | Objeto premium de cierre junto al CTA final | `FINAL_BRAND_REVEAL` | `CINEMATIC_SCROLL_SYSTEM`, `HOME_FINAL_CTA` | `/public/assets/cinematic/home/final-brand-object-v1.webp` | WebP | PNG | 2200x2200 px | 1:1 | 450 KB | si | no | decorativo | alta | requerido | debe convivir con CTA y no tapar botones | packshot premium, objeto de marca, limpio |
| Home cinematografica | `asset-cine-home-smoke-overlay` | `smoke-editorial-overlay-v1.webp` | Overlay de humo editorial | Capa suave para dramatizar transiciones | escenas cinematicas home | `CINEMATIC_SCROLL_SYSTEM` | `/public/assets/overlays/cinematic/smoke-editorial-overlay-v1.webp` | WebP | PNG | 2400x2400 px | 1:1 | 300 KB | si | no | decorativo | media | futuro | muy sutil, sin manchas oscuras pesadas | humo ligero, editorial, translucid o |
| Home cinematografica | `asset-cine-home-light-gradient` | `light-gradient-overlay-v1.webp` | Overlay de gradiente de luz | Glow suave de acento para hero y final | hero y final reveal | `CINEMATIC_SCROLL_SYSTEM` | `/public/assets/overlays/cinematic/light-gradient-overlay-v1.webp` | WebP | PNG | 2400x2400 px | 1:1 | 250 KB | si | no | decorativo | media | futuro | usar degradados limpios, no marketing-style | flare suave, editorial light leak |
| Home cinematografica | `asset-cine-home-vinyl-reflection` | `vinyl-reflection-overlay-v1.webp` | Reflejo de vinilo | Overlay para rotulacion y materiales brillantes | wrap y materiales | `CINEMATIC_SCROLL_SYSTEM`, `PRODUCT_STORY` | `/public/assets/overlays/cinematic/vinyl-reflection-overlay-v1.webp` | WebP | PNG | 2600x1600 px | 13:8 | 300 KB | si | no | decorativo | media | futuro | evitar reflejos quemados y espejos duros | reflection lineal, vinilo premium, sutil |

## 4. Assets para DTI por metro

`DTI` debe dominar el naming visual. `DTF` se conserva como keyword de apoyo en copy SEO y metadatos.

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DTI | `asset-dti-roll-preview` | `dti-roll-preview-v1.webp` | Preview de rollo DTI | Vista principal de bobina o metro lineal | `DTF_CONFIGURATOR`, `PRODUCT_GALLERY`, `CATALOG_GRID` | `DTF_CONFIGURATOR`, `PRODUCT_GALLERY` | `/public/assets/previews/dti/dti-roll-preview-v1.webp` | WebP | JPG | 2200x1400 px | 11:7 | 350 KB | no | no | funcional | alta | requerido | mostrar ancho util claro y textura realista | rollo DTI limpio, estudio, premium |
| DTI | `asset-dti-meter-preview` | `dti-meter-preview-v1.webp` | Preview de metro lineal | Preview funcional del metro con rejilla ligera | `ARTWORK_PREVIEW_CANVAS`, `PRODUCT_CONFIGURATOR` | `ARTWORK_PREVIEW_CANVAS` | `/public/assets/previews/dti/dti-meter-preview-v1.webp` | WebP | PNG | 2000x3200 px | 5:8 | 400 KB | no | no | funcional | alta | requerido | debe poder admitir overlays encima | tramo vertical de metro DTI, neutro |
| DTI | `asset-dti-spacing-guide` | `dti-spacing-guide-v1.svg` | Guia de separacion DTI | Overlay tecnico con distancias entre disenos | prepress y preview | `ARTWORK_PRODUCT_GUIDES`, `PREPRESS_CHECKS` | `/public/assets/overlays/prepress/dti-spacing-guide-v1.svg` | SVG | PDF | 1200x2200 px mesa | 6:11 | 120 KB | si | si | funcional | alta | requerido | lineas finas, no imprimibles | guia lineal, modular, tecnica |
| DTI | `asset-dti-transfer-texture` | `dti-transfer-texture-v1.webp` | Textura de transfer | Macro de acabado DTI para storytelling | `PRODUCT_STORY`, `HOME_EDITORIAL` | `PRODUCT_STORY` | `/public/assets/previews/dti/dti-transfer-texture-v1.webp` | WebP | JPG | 1800x1800 px | 1:1 | 250 KB | no | no | decorativo | media | futuro | ideal para zoom editorial | macro de transfer textil con detalle |
| DTI | `asset-dti-textile-mockup-front` | `dti-textile-mockup-front-v1.webp` | Mockup textil frontal con DTI | Prenda aplicada con transfer DTI | `PRODUCT_GALLERY`, `PRODUCT_RECOMMENDATIONS` | `PRODUCT_GALLERY` | `/public/assets/previews/dti/dti-textile-mockup-front-v1.webp` | WebP | PNG | 2200x2800 px | 11:14 | 500 KB | si | no | funcional | alta | requerido | fondo transparente preferible | camiseta o sudadera con DTI aplicado |
| DTI | `asset-dti-width-overlay` | `dti-width-measure-overlay-v1.svg` | Overlay de ancho util | Medida visual 58-60 cm util | `ARTWORK_PREVIEW_CANVAS`, `PREPRESS_PRODUCT_RULESETS` | `ARTWORK_PRODUCT_GUIDES` | `/public/assets/overlays/prepress/dti-width-measure-overlay-v1.svg` | SVG | PNG | 1200x2200 px mesa | 6:11 | 120 KB | si | si | funcional | alta | requerido | incluir marca de ancho util | overlay tecnico de anchura de rollo |
| DTI | `asset-dti-template-preview` | `dti-meter-template-preview-v1.webp` | Preview de plantilla DTI | Imagen del PDF/AI descargable | `PRINT_TEMPLATE_DOWNLOADS`, `ARTWORK_UPLOAD_FLOW` | `PRINT_TEMPLATE_DOWNLOADS` | `/public/assets/templates/dti-meter/dti-meter-template-preview-v1.webp` | WebP | JPG | 1800x1200 px | 3:2 | 220 KB | no | no | funcional | alta | pendiente | imagen derivada del arte maestro | preview plantilla DTI con guias |
| DTI | `asset-dti-template-master` | `dti-meter-template-master-v1.pdf` | Plantilla maestra DTI | Plantilla cliente para preparar DTI por metro | descargas | `PRINT_TEMPLATE_CATALOG`, `PRINT_TEMPLATE_FORMATS` | `/public/assets/templates/dti-meter/dti-meter-template-master-v1.pdf` | PDF | AI | 1000x580 mm a 300 dpi | 50:29 | 8 MB | no | si | funcional | alta | pendiente | capas normalizadas, notas no imprimibles | plantilla tecnica limpia |

## 5. Assets para rotulacion de vehiculos

Prioridad comercial:

- rotulacion de furgonetas
- vehiculos de empresa
- vehiculos particulares
- Barcelona / Blanes / Girona / Costa Brava

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rotulacion | `asset-wrap-van-side` | `wrap-van-side-transparent-v1.webp` | Furgoneta lateral rotulada | Hero principal de rotulacion comercial | `PRODUCT_HERO`, `PRODUCT_GALLERY`, home cinematic | `PRODUCT_HERO`, `PRODUCT_GALLERY` | `/public/assets/previews/vehicles/wrap-van-side-transparent-v1.webp` | WebP | PNG | 3200x1800 px | 16:9 | 650 KB | si | no | funcional | alta | requerido | preferir version recortada sin fondo | van comercial lateral, branding limpio |
| Rotulacion | `asset-wrap-van-front` | `wrap-van-front-transparent-v1.webp` | Furgoneta frontal tres cuartos | Vista complementaria para galeria | `PRODUCT_GALLERY` | `PRODUCT_GALLERY` | `/public/assets/previews/vehicles/wrap-van-front-transparent-v1.webp` | WebP | PNG | 2800x2000 px | 7:5 | 650 KB | si | no | funcional | media | futuro | util para before/after y mobile | van comercial tres cuartos |
| Rotulacion | `asset-wrap-car-side` | `wrap-car-side-transparent-v1.webp` | Turismo lateral rotulado | Cobertura para vehiculos particulares | `PRODUCT_GALLERY`, SEO local | `PRODUCT_GALLERY`, `SEO_RELATED_PRODUCTS` | `/public/assets/previews/vehicles/wrap-car-side-transparent-v1.webp` | WebP | PNG | 3200x1800 px | 16:9 | 650 KB | si | no | funcional | media | futuro | mantener estilo premium, no stock barato | coche con vinilo comercial elegante |
| Rotulacion | `asset-wrap-before-after` | `vehicle-before-after-v1.webp` | Antes y despues de vehiculo | Comparativa visual de impacto | `PRODUCT_STORY`, `RELATED_GUIDES` | `PRODUCT_STORY` | `/public/assets/previews/vehicles/vehicle-before-after-v1.webp` | WebP | JPG | 2400x1400 px | 12:7 | 400 KB | no | no | funcional | alta | futuro | alinear encuadre y luz | split before-after wrapping |
| Rotulacion | `asset-wrap-installation-detail` | `vinyl-installation-detail-v1.webp` | Detalle de instalacion de vinilo | Macro de aplicacion, espatula o remate | `PRODUCT_STORY`, `HOME_EDITORIAL` | `PRODUCT_STORY` | `/public/assets/previews/vehicles/vinyl-installation-detail-v1.webp` | WebP | JPG | 2000x1400 px | 10:7 | 300 KB | no | no | decorativo | media | futuro | evitar manos desenfocadas excesivas | instalacion vinilo premium detalle |
| Rotulacion | `asset-wrap-reflection-overlay` | `vinyl-reflection-overlay-v1.webp` | Overlay de reflejo de vinilo | Refuerzo editorial de brillo | `PRODUCT_GALLERY`, cinematic wrap | `PRODUCT_GALLERY` | `/public/assets/overlays/cinematic/vinyl-reflection-overlay-v1.webp` | WebP | PNG | 2600x1600 px | 13:8 | 300 KB | si | no | decorativo | media | futuro | translucido y ligero | reflejo lineal sobre carroceria |
| Rotulacion | `asset-wrap-template-side` | `vehicle-template-side-v1.svg` | Plantilla lateral de vehiculo | Base tecnica para mockup y plantilla | `PRINT_TEMPLATE_DOWNLOADS`, prepress | `PRINT_TEMPLATE_GUIDES`, `PREPRESS_PRODUCT_RULESETS` | `/public/assets/templates/vehicle-wrap/vehicle-template-side-v1.svg` | SVG | PDF | lienzo 3200x1200 px | 8:3 | 180 KB | si | si | funcional | alta | pendiente | geometria limpia, capas editables | silueta lateral de furgoneta neutra |
| Rotulacion | `asset-wrap-safe-area` | `vehicle-safe-area-overlay-v1.svg` | Overlay de zona segura vehiculo | Guia de pliegues, manillas y areas a evitar | prepress / plantillas | `ARTWORK_PRODUCT_GUIDES`, `PREPRESS_CHECKS` | `/public/assets/overlays/prepress/vehicle-safe-area-overlay-v1.svg` | SVG | PDF | lienzo 3200x1200 px | 8:3 | 140 KB | si | si | funcional | alta | pendiente | marcar juntas, molduras y manillas | overlay tecnico para wrap |

## 6. Assets para textil

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Textil | `asset-textile-tee-front` | `tshirt-front-transparent-v1.webp` | Camiseta frontal sin fondo | Mockup base textil frontal | `PRODUCT_GALLERY`, `PRODUCT_CONFIGURATOR` | `PRODUCT_GALLERY` | `/public/assets/previews/textile/tshirt-front-transparent-v1.webp` | WebP | PNG | 2200x2800 px | 11:14 | 450 KB | si | no | funcional | alta | requerido | centrado y sin arrugas extremas | camiseta frontal studio cutout |
| Textil | `asset-textile-tee-back` | `tshirt-back-transparent-v1.webp` | Camiseta trasera sin fondo | Variante trasera | `PRODUCT_GALLERY` | `PRODUCT_GALLERY` | `/public/assets/previews/textile/tshirt-back-transparent-v1.webp` | WebP | PNG | 2200x2800 px | 11:14 | 450 KB | si | no | funcional | media | futuro | misma luz que frontal | camiseta trasera cutout |
| Textil | `asset-textile-hoodie-front` | `hoodie-front-transparent-v1.webp` | Sudadera frontal sin fondo | Producto hero premium | `PRODUCT_HERO`, home transition | `PRODUCT_HERO`, `PRODUCT_GALLERY` | `/public/assets/previews/textile/hoodie-front-transparent-v1.webp` | WebP | PNG | 2400x3000 px | 4:5 | 550 KB | si | no | funcional | alta | requerido | volumen y capucha definidos | hoodie frontal premium cutout |
| Textil | `asset-textile-hoodie-back` | `hoodie-back-transparent-v1.webp` | Sudadera trasera sin fondo | Variante trasera textil | `PRODUCT_GALLERY` | `PRODUCT_GALLERY` | `/public/assets/previews/textile/hoodie-back-transparent-v1.webp` | WebP | PNG | 2400x3000 px | 4:5 | 550 KB | si | no | funcional | media | futuro | consistente con frontal | hoodie trasero studio cutout |
| Textil | `asset-textile-oversized-front` | `oversized-tee-front-transparent-v1.webp` | Camiseta oversized frontal | Variante streetwear | `PRODUCT_RECOMMENDATIONS`, `PRODUCT_GALLERY` | `PRODUCT_RECOMMENDATIONS` | `/public/assets/previews/textile/oversized-tee-front-transparent-v1.webp` | WebP | PNG | 2300x3000 px | 23:30 | 500 KB | si | no | funcional | media | futuro | util para drops y moda | oversized tee frontal premium |
| Textil | `asset-textile-tote` | `tote-bag-front-transparent-v1.webp` | Tote bag frontal | Complemento textil cross-sell | `RELATED_PRODUCTS`, `FREQUENTLY_COMBINED` | `RELATED_PRODUCTS` | `/public/assets/previews/textile/tote-bag-front-transparent-v1.webp` | WebP | PNG | 1800x2200 px | 9:11 | 300 KB | si | no | funcional | baja | futuro | util para upselling textil | tote bag recortada limpia |
| Textil | `asset-textile-placement-guide` | `textile-placement-guide-v1.svg` | Guia de colocacion textil | Overlay de area de impresion y centrado | preview / plantillas | `ARTWORK_PRODUCT_GUIDES`, `PRINT_TEMPLATE_GUIDES` | `/public/assets/overlays/prepress/textile-placement-guide-v1.svg` | SVG | PDF | 1600x2000 px | 4:5 | 120 KB | si | si | funcional | alta | pendiente | marcar pecho, espalda y centrado | overlay tecnico textil |
| Textil | `asset-textile-template-master` | `textile-print-area-template-master-v1.pdf` | Plantilla de area de impresion textil | Descarga para cliente | descargas | `PRINT_TEMPLATE_CATALOG` | `/public/assets/templates/textile/textile-print-area-template-master-v1.pdf` | PDF | AI | A3 a 300 dpi | 1.414:1 | 6 MB | no | si | funcional | alta | pendiente | capas obligatorias normalizadas | plantilla textil limpia |

## 7. Assets para pegatinas

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pegatinas | `asset-sticker-sheet-preview` | `sticker-sheet-preview-v1.webp` | Hoja de pegatinas | Vista multiple para producto y guias | `PRODUCT_GALLERY`, `ARTWORK_PREVIEW_CANVAS` | `PRODUCT_GALLERY` | `/public/assets/previews/stickers/sticker-sheet-preview-v1.webp` | WebP | JPG | 2200x2200 px | 1:1 | 350 KB | no | no | funcional | alta | requerido | mostrar varios stickers y margen entre ellos | sticker sheet premium top view |
| Pegatinas | `asset-sticker-single-preview` | `sticker-single-preview-v1.webp` | Pegatina individual | Preview de pieza unica | `PRODUCT_GALLERY`, `RELATED_PRODUCTS` | `PRODUCT_GALLERY` | `/public/assets/previews/stickers/sticker-single-preview-v1.webp` | WebP | PNG | 1800x1800 px | 1:1 | 220 KB | si | no | funcional | media | futuro | ideal sin fondo | single sticker die cut cutout |
| Pegatinas | `asset-sticker-cutline-overlay` | `cutline-overlay-v1.svg` | Overlay de linea de corte | Guia principal de corte | preview/prepress | `ARTWORK_PREVIEW_CANVAS`, `PREPRESS_CHECKS` | `/public/assets/overlays/prepress/cutline-overlay-v1.svg` | SVG | PDF | 1600x1600 px | 1:1 | 100 KB | si | si | funcional | alta | requerido | magenta puro, no imprimible | trazado de corte tecnico |
| Pegatinas | `asset-sticker-kisscut-overlay` | `kiss-cut-overlay-v1.svg` | Overlay kiss-cut | Guia para media corte | preview/prepress | `ARTWORK_PRODUCT_GUIDES` | `/public/assets/overlays/prepress/kiss-cut-overlay-v1.svg` | SVG | PDF | 1600x1600 px | 1:1 | 100 KB | si | si | funcional | media | futuro | diferenciar del corte final | kiss-cut tecnico limpio |
| Pegatinas | `asset-sticker-contour-template` | `sticker-contour-template-v1.svg` | Plantilla de contorno | Base vectorial para sticker contour | plantillas | `PRINT_TEMPLATE_CATALOG` | `/public/assets/templates/stickers/sticker-contour-template-v1.svg` | SVG | AI | 100x100 mm base | 1:1 | 150 KB | si | si | funcional | alta | pendiente | capa de corte separada | contorno vectorial tecnico |
| Pegatinas | `asset-sticker-bleed-guide` | `sticker-bleed-guide-v1.svg` | Guia de sangrado pegatina | Overlay para bleed recomendado | preview/prepress | `ARTWORK_PRODUCT_GUIDES`, `PREPRESS_PRODUCT_RULESETS` | `/public/assets/overlays/prepress/sticker-bleed-guide-v1.svg` | SVG | PDF | 1600x1600 px | 1:1 | 100 KB | si | si | funcional | alta | pendiente | verde para bleed | guia de bleed sticker |

## 8. Assets para tarjetas y papeleria

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Papeleria | `asset-card-stack` | `business-card-stack-v1.webp` | Pila de tarjetas | Hero o galeria de tarjetas empresa | `PRODUCT_GALLERY`, `CATALOG_GRID` | `PRODUCT_GALLERY` | `/public/assets/previews/cards/business-card-stack-v1.webp` | WebP | JPG | 2200x1400 px | 11:7 | 300 KB | no | no | funcional | alta | requerido | iluminar cantos y grosor | stack de tarjetas premium |
| Papeleria | `asset-card-front-single` | `business-card-front-single-v1.webp` | Tarjeta frontal individual | Preview frontal de tarjeta | `ARTWORK_PREVIEW_CANVAS`, `PRODUCT_GALLERY` | `PRODUCT_GALLERY` | `/public/assets/previews/cards/business-card-front-single-v1.webp` | WebP | PNG | 1600x1000 px | 8:5 | 180 KB | si | no | funcional | alta | requerido | version limpia con sombra suave | tarjeta frontal aislada |
| Papeleria | `asset-card-back-single` | `business-card-back-single-v1.webp` | Tarjeta trasera individual | Preview reverso | `PRODUCT_GALLERY` | `PRODUCT_GALLERY` | `/public/assets/previews/cards/business-card-back-single-v1.webp` | WebP | PNG | 1600x1000 px | 8:5 | 180 KB | si | no | funcional | media | futuro | alineado con frontal | tarjeta trasera aislada |
| Papeleria | `asset-flyer-preview` | `flyer-preview-v1.webp` | Preview de flyer | Mockup editorial de flyer | `PRODUCT_GALLERY`, `RELATED_PRODUCTS` | `PRODUCT_GALLERY` | `/public/assets/previews/paper/flyer-preview-v1.webp` | WebP | JPG | 1800x2400 px | 3:4 | 240 KB | no | no | funcional | media | futuro | buen papel, no fondo distractor | flyer top view premium |
| Papeleria | `asset-paper-texture` | `paper-texture-overlay-v1.webp` | Textura de papel | Overlay editorial de gramaje | `PRODUCT_STORY` | `PRODUCT_STORY` | `/public/assets/overlays/cinematic/paper-texture-overlay-v1.webp` | WebP | JPG | 1800x1800 px | 1:1 | 180 KB | no | no | decorativo | baja | futuro | muy sutil para no parecer stock | paper grain premium macro |
| Papeleria | `asset-card-template-master` | `business-card-template-master-v1.pdf` | Plantilla maestra de tarjeta | Descarga principal para cliente | `PRINT_TEMPLATE_DOWNLOADS` | `PRINT_TEMPLATE_CATALOG` | `/public/assets/templates/business-cards/business-card-template-master-v1.pdf` | PDF | AI | 91x61 mm a 300 dpi | 91:61 | 4 MB | no | si | funcional | alta | pendiente | capas obligatorias y notas no imprimibles | plantilla tarjeta corporativa |

## 9. Assets para vinilo impreso y carteleria

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Vinilo/carteleria | `asset-vinyl-panel-preview` | `vinyl-panel-preview-v1.webp` | Panel de vinilo impreso | Preview principal de vinilo aplicado o panelado | `PRODUCT_GALLERY`, `ARTWORK_PREVIEW_CANVAS` | `PRODUCT_GALLERY` | `/public/assets/previews/vinyl/vinyl-panel-preview-v1.webp` | WebP | JPG | 2400x1500 px | 8:5 | 320 KB | no | no | funcional | alta | requerido | area visible clara, no stock genérico | panel de vinilo premium |
| Vinilo/carteleria | `asset-signage-board-preview` | `signage-board-preview-v1.webp` | Panel de carteleria | Preview de signage o panel rigido | `PRODUCT_GALLERY`, `RELATED_PRODUCTS` | `PRODUCT_GALLERY` | `/public/assets/previews/signage/signage-board-preview-v1.webp` | WebP | JPG | 2200x1600 px | 11:8 | 320 KB | no | no | funcional | alta | requerido | mostrar escala y presencia real | panneau signage premium |
| Vinilo/carteleria | `asset-wall-graphic-preview` | `wall-graphic-preview-v1.webp` | Grafica mural | Aplicacion de grafica en pared/escaparate | `PRODUCT_STORY`, `RELATED_SERVICES` | `PRODUCT_STORY` | `/public/assets/previews/signage/wall-graphic-preview-v1.webp` | WebP | JPG | 2400x1600 px | 3:2 | 350 KB | no | no | funcional | media | futuro | importante para escaparates y branding local | wall graphic branded space |
| Vinilo/carteleria | `asset-large-format-roll` | `large-format-roll-preview-v1.webp` | Rollo de gran formato | Bobina o material gran formato | `PRODUCT_STORY`, `HOME_EDITORIAL` | `PRODUCT_STORY` | `/public/assets/previews/signage/large-format-roll-preview-v1.webp` | WebP | JPG | 2200x1400 px | 11:7 | 280 KB | no | no | decorativo | media | futuro | buen detalle material | large format roll studio |
| Vinilo/carteleria | `asset-measurement-overlay` | `measurement-grid-v1.svg` | Rejilla de medidas | Overlay tecnico universal de medidas | preview/prepress | `ARTWORK_PREVIEW_CANVAS`, `PREPRESS_PRODUCT_RULESETS` | `/public/assets/overlays/prepress/measurement-grid-v1.svg` | SVG | PDF | 2000x1400 px | 10:7 | 120 KB | si | si | funcional | alta | requerido | modular, sin ruido visual | grid tecnico fino |
| Vinilo/carteleria | `asset-viewing-distance-guide` | `viewing-distance-guide-v1.svg` | Guia de distancia de lectura | Overlay para carteleria y gran formato | prepress / guias | `ARTWORK_PRODUCT_GUIDES`, `PREPRESS_RECOMMENDATIONS` | `/public/assets/overlays/prepress/viewing-distance-guide-v1.svg` | SVG | PDF | 1600x1200 px | 4:3 | 120 KB | si | si | funcional | media | futuro | usar iconos simples y texto minimo | diagrama distancia lectura |
| Vinilo/carteleria | `asset-vinyl-panel-template` | `printed-vinyl-template-master-v1.pdf` | Plantilla maestra de vinilo impreso | Descarga tecnica de area visible y panelado | descargas | `PRINT_TEMPLATE_CATALOG` | `/public/assets/templates/printed-vinyl/printed-vinyl-template-master-v1.pdf` | PDF | AI | escala 1:10 1000x700 mm base | 10:7 | 8 MB | no | si | funcional | alta | pendiente | contemplar solapes y panelado | plantilla vinilo impreso |
| Vinilo/carteleria | `asset-signage-template` | `signage-template-master-v1.pdf` | Plantilla maestra de carteleria | Descarga tecnica para cartel/lona/panel | descargas | `PRINT_TEMPLATE_CATALOG` | `/public/assets/templates/signage/signage-template-master-v1.pdf` | PDF | SVG | A2 / A1 segun version | variable | 8 MB | no | si | funcional | media | pendiente | definir variantes A2, A1 y lona | plantilla carteleria segura |

## 10. Plantillas descargables

Capas obligatorias en todos los maestros editables:

- `01_ARTWORK_AQUI`
- `02_ZONA_SEGURA`
- `03_LINEA_CORTE`
- `04_SANGRADO`
- `05_NOTAS_NO_IMPRIMIR`

Colores recomendados:

- sangrado: verde
- corte: magenta
- zona segura: azul
- notas: gris

### 10.1 Tabla de plantillas por producto

| Producto | Asset ID | Archivo recomendado | Formatos obligatorios | CDR opcional | Preview asociado | Dimensiones base | Sangrado | Zona segura | Linea de corte | Notas no imprimibles | Ruta exacta | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DTI por metro | `tpl-dti-meter-master` | `dti-meter-template-master-v1.pdf` | PDF, AI, SVG | no | `dti-meter-template-preview-v1.webp` | 1000x580 mm base / 300 dpi | 0 mm | 8 mm | no | si | `/public/assets/templates/dti-meter/` | pendiente |
| Pegatinas | `tpl-stickers-master` | `stickers-template-master-v1.ai` | PDF, AI, SVG | si | `stickers-template-preview-v1.webp` | 100x100 mm base / 300 dpi | 2 mm | 3 mm | si | si | `/public/assets/templates/stickers/` | pendiente |
| Tarjetas | `tpl-business-cards-master` | `business-card-template-master-v1.pdf` | PDF, AI, SVG | opcional | `business-card-template-preview-v1.webp` | 91x61 mm / 300 dpi | 3 mm | 4 mm | si | si | `/public/assets/templates/business-cards/` | pendiente |
| Vinilo impreso | `tpl-printed-vinyl-master` | `printed-vinyl-template-master-v1.pdf` | PDF, AI | no | `printed-vinyl-template-preview-v1.webp` | 1000x700 mm escala 1:10 | 5 mm | 8 mm | segun panelado | si | `/public/assets/templates/printed-vinyl/` | pendiente |
| Carteleria | `tpl-signage-master` | `signage-template-master-v1.pdf` | PDF, SVG | no | `signage-template-preview-v1.webp` | A2/A1 segun version | 3-5 mm | 8-10 mm | segun pieza | si | `/public/assets/templates/signage/` | pendiente |
| Textil | `tpl-textile-master` | `textile-print-area-template-master-v1.pdf` | PDF, AI | no | `textile-print-area-template-preview-v1.webp` | A3 / 300 dpi | 0 mm | 6 mm | no | si | `/public/assets/templates/textile/` | pendiente |
| Papeleria | `tpl-paper-master` | `paper-editorial-template-master-v1.pdf` | PDF, AI | si | `paper-editorial-template-preview-v1.webp` | A4 / 300 dpi | 3 mm | 5 mm | si | si | `/public/assets/templates/paper/` | pendiente |
| Rotulacion vehiculos | `tpl-vehicle-wrap-master` | `vehicle-wrap-template-master-v1.pdf` | PDF, AI, SVG | opcional | `vehicle-wrap-template-preview-v1.webp` | lienzo vehiculo segun vista | 0-5 mm | segun pliegues | si, guia tecnica | si | `/public/assets/templates/vehicle-wrap/` | futuro |

## 11. Overlays tecnicos de preprensa

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Preprensa | `asset-safe-area-overlay` | `safe-area-overlay-v1.svg` | Overlay de zona segura | Zona segura universal para previews | `ARTWORK_PREVIEW_CANVAS`, `PREPRESS_CHECKS` | `ARTWORK_PRODUCT_GUIDES`, `PREPRESS_CHECKS` | `/public/assets/overlays/prepress/safe-area-overlay-v1.svg` | SVG | PDF | 2000x1400 px | 10:7 | 100 KB | si | si | funcional | alta | requerido | azul, semitransparente | overlay tecnico limpio |
| Preprensa | `asset-bleed-overlay` | `bleed-overlay-v1.svg` | Overlay de sangrado | Capa universal de bleed | preview/prepress | `ARTWORK_PRODUCT_GUIDES` | `/public/assets/overlays/prepress/bleed-overlay-v1.svg` | SVG | PDF | 2000x1400 px | 10:7 | 100 KB | si | si | funcional | alta | requerido | verde, no imprimir | bleed frame tecnico |
| Preprensa | `asset-cutline-overlay` | `cutline-overlay-v1.svg` | Overlay de corte | Capa universal de linea de corte | preview/prepress | `ARTWORK_PRODUCT_GUIDES`, `PREPRESS_CHECKS` | `/public/assets/overlays/prepress/cutline-overlay-v1.svg` | SVG | PDF | 2000x1400 px | 10:7 | 100 KB | si | si | funcional | alta | requerido | magenta, no imprimir | cutline tecnico |
| Preprensa | `asset-warning-overlay` | `warning-overlay-v1.svg` | Overlay de warning | Iconografia de advertencia sobre preview | `PREPRESS_RECOMMENDATIONS`, admin uploads | `PREPRESS_RECOMMENDATIONS`, `ADMIN_UPLOAD_REVIEW` | `/public/assets/overlays/prepress/warning-overlay-v1.svg` | SVG | PNG | 800x800 px | 1:1 | 80 KB | si | si | funcional | media | futuro | minimo y legible | warning badge tecnico |
| Preprensa | `asset-measurement-grid` | `measurement-grid-v1.svg` | Rejilla de medida | Rejilla comun de proporcion | preview/prepress | `ARTWORK_PREVIEW_CANVAS` | `/public/assets/overlays/prepress/measurement-grid-v1.svg` | SVG | PDF | 2000x1400 px | 10:7 | 120 KB | si | si | funcional | alta | requerido | lineas finas | grid tecnico |
| Preprensa | `asset-dti-spacing-guide` | `dti-spacing-guide-v1.svg` | Guia de separacion DTI | Distancia entre bloques DTI | DTI | `ARTWORK_PRODUCT_GUIDES` | `/public/assets/overlays/prepress/dti-spacing-guide-v1.svg` | SVG | PDF | 1200x2200 px | 6:11 | 120 KB | si | si | funcional | alta | requerido | modular | spacing DTI |
| Preprensa | `asset-sticker-contour-guide` | `sticker-contour-guide-v1.svg` | Guia de contorno pegatina | Muestra contour/kiss cut | pegatinas | `ARTWORK_PRODUCT_GUIDES` | `/public/assets/overlays/prepress/sticker-contour-guide-v1.svg` | SVG | PDF | 1600x1600 px | 1:1 | 100 KB | si | si | funcional | alta | pendiente | debe diferenciar contorno y seguridad | contour sticker |
| Preprensa | `asset-card-trim-guide` | `card-trim-guide-v1.svg` | Guia de recorte tarjeta | Capa especifica para tarjetas | tarjetas | `ARTWORK_PRODUCT_GUIDES`, `PREPRESS_PRODUCT_RULESETS` | `/public/assets/overlays/prepress/card-trim-guide-v1.svg` | SVG | PDF | 1600x1000 px | 8:5 | 100 KB | si | si | funcional | alta | pendiente | basado en 91x61 mm | trim card guide |
| Preprensa | `asset-vinyl-panel-guide` | `vinyl-panel-guide-v1.svg` | Guia de panelado vinilo | Solapes y panelado de vinilo | vinilo/carteleria | `ARTWORK_PRODUCT_GUIDES`, `PREPRESS_CHECKS` | `/public/assets/overlays/prepress/vinyl-panel-guide-v1.svg` | SVG | PDF | 2200x1400 px | 11:7 | 140 KB | si | si | funcional | media | pendiente | marcar solapes y zonas criticas | panelado tecnico vinilo |

## 12. Assets SEO / OpenGraph / Social

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEO/social | `asset-og-home` | `og-home-v1.jpg` | OpenGraph home | Imagen social general de la marca | home / share | `HOME_HERO`, `NAV_MAIN` | `/public/assets/seo/og-home-v1.jpg` | JPG | WebP | 1200x630 px | 40:21 | 250 KB | no | no | funcional | alta | requerido | texto legible en thumbnail | home editorial con DTI y rotulacion |
| SEO/social | `asset-og-dti` | `og-dti-v1.jpg` | OpenGraph DTI | Imagen social de DTI por metro | share producto | `DTF_CONFIGURATOR`, `PRODUCT_HERO` | `/public/assets/seo/og-dti-v1.jpg` | JPG | WebP | 1200x630 px | 40:21 | 250 KB | no | no | funcional | alta | requerido | naming visible DTI | DTI por metro hero social |
| SEO/social | `asset-og-wrap-bcn` | `og-rotulacion-furgonetas-barcelona-v1.jpg` | OpenGraph rotulacion Barcelona | Share local para rotulacion BCN | SEO local | `SEO_LOCAL_QUESTIONS`, `PRODUCT_HERO` | `/public/assets/seo/og-rotulacion-furgonetas-barcelona-v1.jpg` | JPG | WebP | 1200x630 px | 40:21 | 250 KB | no | no | funcional | alta | futuro | incluir van y Barcelona sin saturar copy | van wrap Barcelona social |
| SEO/social | `asset-og-blanes` | `og-rotulacion-blanes-v1.jpg` | OpenGraph Blanes | Share local para Blanes | SEO local | `SEO_LOCAL_QUESTIONS` | `/public/assets/seo/og-rotulacion-blanes-v1.jpg` | JPG | WebP | 1200x630 px | 40:21 | 250 KB | no | no | funcional | media | futuro | util para contenido local | rotulacion Blanes social |
| SEO/social | `asset-og-stickers` | `og-pegatinas-v1.jpg` | OpenGraph pegatinas | Social para pegatinas | producto / related | `PRODUCT_HERO` | `/public/assets/seo/og-pegatinas-v1.jpg` | JPG | WebP | 1200x630 px | 40:21 | 250 KB | no | no | funcional | media | futuro | mostrar sticker sheet | stickers social card |
| SEO/social | `asset-og-cards` | `og-tarjetas-v1.jpg` | OpenGraph tarjetas | Social para tarjetas y papeleria | producto | `PRODUCT_HERO` | `/public/assets/seo/og-tarjetas-v1.jpg` | JPG | WebP | 1200x630 px | 40:21 | 250 KB | no | no | funcional | media | futuro | stack o card elegante | business cards social |
| SEO/social | `asset-favicon` | `favicon-32.png` | Favicon raster | Favicon complementario al SVG actual | navegador | `NAV_MAIN` | `/public/assets/brand/favicon-32.png` | PNG | ICO | 32x32 px | 1:1 | 20 KB | si | no | funcional | media | futuro | mantener tambien `public/favicon.svg` | icono simple marca |
| SEO/social | `asset-apple-touch-icon` | `apple-touch-icon-180.png` | Icono Apple touch | Icono iOS home screen | dispositivos Apple | `NAV_MAIN` | `/public/assets/brand/apple-touch-icon-180.png` | PNG | JPG | 180x180 px | 1:1 | 60 KB | no | no | funcional | media | futuro | fondo estable y legible | marca centrada sobre fondo limpio |
| SEO/social | `asset-schema-logo` | `schema-logo-512.png` | Logo para schema | Imagen para Organization/LocalBusiness | structured data | `NAV_MAIN`, `FOOTER_MAIN` | `/public/assets/brand/schema-logo-512.png` | PNG | SVG | 512x512 px | 1:1 | 120 KB | si | preferible | funcional | alta | futuro | minimo 512x512 | logotipo marca limpio |

## 13. Assets para admin, prepress y reporting

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Admin/docs | `asset-admin-upload-placeholder` | `upload-placeholder-v1.webp` | Placeholder de archivo subido | Thumbnail base para admin uploads | `ADMIN_UPLOAD_REVIEW` | `ADMIN_UPLOAD_REVIEW` | `/public/assets/admin/upload-placeholder-v1.webp` | WebP | PNG | 1200x900 px | 4:3 | 120 KB | no | no | funcional | media | requerido | neutro, tecnico | mock file preview neutral |
| Admin/docs | `asset-admin-validation-icons` | `validation-icons-v1.svg` | Iconos de validacion | Set pass/warning/fail/info | prepress admin | `PREPRESS_ADMIN_REVIEW`, `ADMIN_UPLOAD_REVIEW` | `/public/assets/admin/validation-icons-v1.svg` | SVG | PNG | 512x128 px sheet | 4:1 | 60 KB | si | si | funcional | alta | futuro | mantener iconografia simple | status icons technical |
| Admin/docs | `asset-admin-technical-preview` | `technical-preview-frame-v1.webp` | Preview tecnico | Marco visual para resumen tecnico | uploads/order detail | `PREPRESS_ADMIN_REVIEW`, `ADMIN_ORDER_DETAIL` | `/public/assets/admin/technical-preview-frame-v1.webp` | WebP | PNG | 1600x1200 px | 4:3 | 180 KB | si | no | funcional | media | futuro | util para estados vacios y fallback | frame tecnico neutral |
| Admin/docs | `asset-doc-header-logo` | `document-header-logo-v1.svg` | Logo cabecera documental | Logo limpio para print view | reportes/documentos | `DOCUMENT_LAYOUTS`, `REPORTING_CENTER` | `/public/assets/documents/document-header-logo-v1.svg` | SVG | PNG | 800x200 px | 4:1 | 50 KB | si | si | funcional | alta | futuro | alto contraste y print-safe | logo horizontal limpio |
| Admin/docs | `asset-doc-watermark` | `document-watermark-v1.png` | Marca de agua documental | Watermark suave para print view | docs/reporting | `DOCUMENT_PRINT_STYLES` | `/public/assets/documents/document-watermark-v1.png` | PNG | SVG | 1200x1200 px | 1:1 | 120 KB | si | no | decorativo | baja | futuro | opacidad muy baja | marca de agua muy sutil |
| Admin/docs | `asset-doc-stamp` | `approval-stamp-mock-v1.png` | Sello mock de aprobacion | Sello interno aprobado/revision | admin/prepress | `ADMIN_ARTWORK_APPROVALS`, `PREPRESS_ADMIN_REVIEW` | `/public/assets/admin/approval-stamp-mock-v1.png` | PNG | SVG | 800x800 px | 1:1 | 100 KB | si | no | funcional | baja | futuro | sin parecer legal real | sello mock approved |
| Admin/docs | `asset-doc-signature` | `signature-block-mock-v1.png` | Firma o sello mock | Firma visual para handoff | `DOCUMENT_DELIVERY_HANDOFF`, reporting | `DOCUMENT_DELIVERY_HANDOFF`, `ADMIN_ORDER_HANDOFF` | `/public/assets/documents/signature-block-mock-v1.png` | PNG | SVG | 1200x400 px | 3:1 | 80 KB | si | no | funcional | baja | futuro | dejar claro que es mock | scribble signature mock |
| Admin/docs | `asset-doc-printsafe-logo` | `print-safe-logo-v1.svg` | Logo print-safe | Variante monocolor para A4 | documentos | `DOCUMENT_PRINT_STYLES` | `/public/assets/documents/print-safe-logo-v1.svg` | SVG | PNG | 600x200 px | 3:1 | 40 KB | si | si | funcional | media | futuro | tinta negra o gris oscuro | logotipo monocolor |

## 14. Assets mobile y fallback

| Categoria | Asset ID | Archivo | Nombre en castellano | Descripcion | Donde se usa | Zona editable | Ruta exacta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Tipo | Prioridad | Estado | Notas de produccion | Prompt / referencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fallbacks | `asset-mobile-home-dti` | `home-dti-mobile-light-v1.webp` | Home DTI mobile ligera | Hero simplificado para mobile/baja red | home mobile | `HOME_HERO` | `/public/assets/fallbacks/home-dti-mobile-light-v1.webp` | WebP | JPG | 1080x1440 px | 3:4 | 180 KB | no | no | funcional | alta | futuro | reemplazo liviano del cinematic | home mobile DTI simple |
| Fallbacks | `asset-mobile-wrap` | `wrap-mobile-light-v1.webp` | Wrap mobile ligero | Preview wrap simplificado mobile | producto/servicio mobile | `PRODUCT_GALLERY` | `/public/assets/fallbacks/wrap-mobile-light-v1.webp` | WebP | JPG | 1080x1440 px | 3:4 | 180 KB | no | no | funcional | media | futuro | para grids y hero mobile | wrap vertical mobile |
| Fallbacks | `asset-reduced-motion-overlay` | `reduced-motion-overlay-v1.svg` | Overlay reducido | Reemplazo estatico de guias cinematicas | reduced motion | `CINEMATIC_SCROLL_SYSTEM` | `/public/assets/fallbacks/reduced-motion-overlay-v1.svg` | SVG | PNG | 1600x900 px | 16:9 | 80 KB | si | si | funcional | media | futuro | sin animacion | composición estatic a limpia |
| Fallbacks | `asset-low-bandwidth-preview` | `low-bandwidth-preview-v1.webp` | Preview simplificado | Placeholder ligero para previews funcionales | upload/product | `ARTWORK_PREVIEW_CANVAS`, `PRODUCT_GALLERY` | `/public/assets/fallbacks/low-bandwidth-preview-v1.webp` | WebP | JPG | 1200x900 px | 4:3 | 100 KB | no | no | funcional | media | futuro | version para conexiones lentas | generic lightweight preview |
| Fallbacks | `asset-simplified-cinematic-pack` | `simplified-cinematic-pack-v1.webp` | Pack cinematico simplificado | Imagen unica para sustituir varias escenas | home low-end | `CINEMATIC_SCROLL_SYSTEM` | `/public/assets/fallbacks/simplified-cinematic-pack-v1.webp` | WebP | JPG | 1600x1200 px | 4:3 | 160 KB | no | no | decorativo | baja | futuro | usar solo si se decide simplificacion automatica | collage editorial simple |

## 15. Naming convention

Reglas obligatorias:

- `lowercase`
- `kebab-case`
- sin acentos
- sin espacios
- prefijo por categoria cuando aporte claridad
- sufijo por version si aplica
- usar `-transparent` para recortes con alpha
- usar `-overlay` para capas tecnicas o cinematograficas
- usar `-preview` para mockups raster
- usar `-template` o `-master` para descargables maestros
- usar `-mobile-light`, `-fallback` o `-print-safe` para variantes de degradacion

Ejemplos:

- `dti-roll-transparent-v1.webp`
- `wrap-van-side-transparent-v1.webp`
- `business-card-template-master-v1.pdf`
- `safe-area-overlay-v1.svg`
- `document-header-logo-v1.svg`

## 16. Tabla maestra final

La tabla siguiente resume el inventario completo por categoria y uso exacto.

| Categoria | Asset ID | Archivo | Descripcion | Ruta | Formato principal | Formato alternativo | Tamano recomendado | Relacion | Peso maximo | Transparencia | Vectorial | Prioridad | Estado | Uso exacto |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home cinematografica | `asset-cine-home-dti-roll` | `dti-roll-transparent-v1.webp` | Bobina DTI hero | `/public/assets/cinematic/home/` | WebP | PNG | 2600x1600 | 13:8 | 450 KB | si | no | alta | requerido | Hero cinematico |
| Home cinematografica | `asset-cine-home-textile-hoodie` | `textile-hoodie-transparent-v1.webp` | Prenda textil hero | `/public/assets/cinematic/home/` | WebP | PNG | 2400x3000 | 4:5 | 550 KB | si | no | alta | requerido | Transicion textil-DTI |
| Home cinematografica | `asset-cine-home-wrap-van-side` | `wrap-van-side-transparent-v1.webp` | Furgoneta hero | `/public/assets/cinematic/home/` | WebP | PNG | 3200x1800 | 16:9 | 650 KB | si | no | alta | requerido | Escena wrap |
| Home cinematografica | `asset-cine-home-wrap-car-side` | `wrap-car-side-transparent-v1.webp` | Coche hero | `/public/assets/cinematic/home/` | WebP | PNG | 3200x1800 | 16:9 | 650 KB | si | no | media | futuro | Escena wrap secundaria |
| Home cinematografica | `asset-cine-home-print-detail` | `print-detail-transparent-v1.webp` | Macro de produccion | `/public/assets/cinematic/home/` | WebP | PNG | 2600x1600 | 13:8 | 500 KB | si | no | alta | requerido | Escena detalle produccion |
| Home cinematografica | `asset-cine-home-brand-reveal` | `final-brand-object-v1.webp` | Objeto final | `/public/assets/cinematic/home/` | WebP | PNG | 2200x2200 | 1:1 | 450 KB | si | no | alta | requerido | CTA final |
| Overlays cinematicos | `asset-cine-home-smoke-overlay` | `smoke-editorial-overlay-v1.webp` | Overlay humo | `/public/assets/overlays/cinematic/` | WebP | PNG | 2400x2400 | 1:1 | 300 KB | si | no | media | futuro | atmósfera home |
| Overlays cinematicos | `asset-cine-home-light-gradient` | `light-gradient-overlay-v1.webp` | Overlay luz | `/public/assets/overlays/cinematic/` | WebP | PNG | 2400x2400 | 1:1 | 250 KB | si | no | media | futuro | glow editorial |
| Overlays cinematicos | `asset-cine-home-vinyl-reflection` | `vinyl-reflection-overlay-v1.webp` | Reflejo vinilo | `/public/assets/overlays/cinematic/` | WebP | PNG | 2600x1600 | 13:8 | 300 KB | si | no | media | futuro | brillo wrap/materiales |
| DTI | `asset-dti-roll-preview` | `dti-roll-preview-v1.webp` | Preview rollo DTI | `/public/assets/previews/dti/` | WebP | JPG | 2200x1400 | 11:7 | 350 KB | no | no | alta | requerido | producto principal |
| DTI | `asset-dti-meter-preview` | `dti-meter-preview-v1.webp` | Preview metro DTI | `/public/assets/previews/dti/` | WebP | PNG | 2000x3200 | 5:8 | 400 KB | no | no | alta | requerido | preview upload |
| DTI | `asset-dti-spacing-guide` | `dti-spacing-guide-v1.svg` | Guia separacion DTI | `/public/assets/overlays/prepress/` | SVG | PDF | 1200x2200 | 6:11 | 120 KB | si | si | alta | requerido | preprensa DTI |
| DTI | `asset-dti-transfer-texture` | `dti-transfer-texture-v1.webp` | Textura transfer | `/public/assets/previews/dti/` | WebP | JPG | 1800x1800 | 1:1 | 250 KB | no | no | media | futuro | storytelling |
| DTI | `asset-dti-textile-mockup-front` | `dti-textile-mockup-front-v1.webp` | Prenda aplicada | `/public/assets/previews/dti/` | WebP | PNG | 2200x2800 | 11:14 | 500 KB | si | no | alta | requerido | galeria DTI |
| DTI | `asset-dti-width-overlay` | `dti-width-measure-overlay-v1.svg` | Overlay ancho util | `/public/assets/overlays/prepress/` | SVG | PNG | 1200x2200 | 6:11 | 120 KB | si | si | alta | requerido | guia tecnica |
| DTI | `asset-dti-template-preview` | `dti-meter-template-preview-v1.webp` | Preview plantilla DTI | `/public/assets/templates/dti-meter/` | WebP | JPG | 1800x1200 | 3:2 | 220 KB | no | no | alta | pendiente | card de descarga |
| DTI | `asset-dti-template-master` | `dti-meter-template-master-v1.pdf` | Plantilla maestra DTI | `/public/assets/templates/dti-meter/` | PDF | AI | 1000x580 mm | 50:29 | 8 MB | no | si | alta | pendiente | descarga cliente |
| Rotulacion | `asset-wrap-van-side` | `wrap-van-side-transparent-v1.webp` | Furgoneta lateral | `/public/assets/previews/vehicles/` | WebP | PNG | 3200x1800 | 16:9 | 650 KB | si | no | alta | requerido | hero rotulacion |
| Rotulacion | `asset-wrap-van-front` | `wrap-van-front-transparent-v1.webp` | Furgoneta frontal | `/public/assets/previews/vehicles/` | WebP | PNG | 2800x2000 | 7:5 | 650 KB | si | no | media | futuro | galeria |
| Rotulacion | `asset-wrap-car-side` | `wrap-car-side-transparent-v1.webp` | Turismo lateral | `/public/assets/previews/vehicles/` | WebP | PNG | 3200x1800 | 16:9 | 650 KB | si | no | media | futuro | vehiculo particular |
| Rotulacion | `asset-wrap-before-after` | `vehicle-before-after-v1.webp` | Before/after vehiculo | `/public/assets/previews/vehicles/` | WebP | JPG | 2400x1400 | 12:7 | 400 KB | no | no | alta | futuro | storytelling |
| Rotulacion | `asset-wrap-installation-detail` | `vinyl-installation-detail-v1.webp` | Detalle instalacion | `/public/assets/previews/vehicles/` | WebP | JPG | 2000x1400 | 10:7 | 300 KB | no | no | media | futuro | macro montaje |
| Rotulacion | `asset-wrap-reflection-overlay` | `vinyl-reflection-overlay-v1.webp` | Overlay reflejo | `/public/assets/overlays/cinematic/` | WebP | PNG | 2600x1600 | 13:8 | 300 KB | si | no | media | futuro | brillo carroceria |
| Rotulacion | `asset-wrap-template-side` | `vehicle-template-side-v1.svg` | Plantilla lateral vehiculo | `/public/assets/templates/vehicle-wrap/` | SVG | PDF | 3200x1200 | 8:3 | 180 KB | si | si | alta | pendiente | plantilla tecnica |
| Rotulacion | `asset-wrap-safe-area` | `vehicle-safe-area-overlay-v1.svg` | Zona segura vehiculo | `/public/assets/overlays/prepress/` | SVG | PDF | 3200x1200 | 8:3 | 140 KB | si | si | alta | pendiente | guia tecnica wrap |
| Textil | `asset-textile-tee-front` | `tshirt-front-transparent-v1.webp` | Camiseta frontal | `/public/assets/previews/textile/` | WebP | PNG | 2200x2800 | 11:14 | 450 KB | si | no | alta | requerido | mockup base |
| Textil | `asset-textile-tee-back` | `tshirt-back-transparent-v1.webp` | Camiseta trasera | `/public/assets/previews/textile/` | WebP | PNG | 2200x2800 | 11:14 | 450 KB | si | no | media | futuro | reverso |
| Textil | `asset-textile-hoodie-front` | `hoodie-front-transparent-v1.webp` | Sudadera frontal | `/public/assets/previews/textile/` | WebP | PNG | 2400x3000 | 4:5 | 550 KB | si | no | alta | requerido | hero textil |
| Textil | `asset-textile-hoodie-back` | `hoodie-back-transparent-v1.webp` | Sudadera trasera | `/public/assets/previews/textile/` | WebP | PNG | 2400x3000 | 4:5 | 550 KB | si | no | media | futuro | reverso |
| Textil | `asset-textile-oversized-front` | `oversized-tee-front-transparent-v1.webp` | Oversized frontal | `/public/assets/previews/textile/` | WebP | PNG | 2300x3000 | 23:30 | 500 KB | si | no | media | futuro | variante |
| Textil | `asset-textile-tote` | `tote-bag-front-transparent-v1.webp` | Tote bag | `/public/assets/previews/textile/` | WebP | PNG | 1800x2200 | 9:11 | 300 KB | si | no | baja | futuro | upsell |
| Textil | `asset-textile-placement-guide` | `textile-placement-guide-v1.svg` | Guia colocacion | `/public/assets/overlays/prepress/` | SVG | PDF | 1600x2000 | 4:5 | 120 KB | si | si | alta | pendiente | guia tecnica |
| Textil | `asset-textile-template-master` | `textile-print-area-template-master-v1.pdf` | Plantilla textil | `/public/assets/templates/textile/` | PDF | AI | A3 | 1.414:1 | 6 MB | no | si | alta | pendiente | descarga |
| Pegatinas | `asset-sticker-sheet-preview` | `sticker-sheet-preview-v1.webp` | Hoja de pegatinas | `/public/assets/previews/stickers/` | WebP | JPG | 2200x2200 | 1:1 | 350 KB | no | no | alta | requerido | preview |
| Pegatinas | `asset-sticker-single-preview` | `sticker-single-preview-v1.webp` | Pegatina individual | `/public/assets/previews/stickers/` | WebP | PNG | 1800x1800 | 1:1 | 220 KB | si | no | media | futuro | preview single |
| Pegatinas | `asset-sticker-cutline-overlay` | `cutline-overlay-v1.svg` | Overlay corte | `/public/assets/overlays/prepress/` | SVG | PDF | 1600x1600 | 1:1 | 100 KB | si | si | alta | requerido | linea corte |
| Pegatinas | `asset-sticker-kisscut-overlay` | `kiss-cut-overlay-v1.svg` | Overlay kiss cut | `/public/assets/overlays/prepress/` | SVG | PDF | 1600x1600 | 1:1 | 100 KB | si | si | media | futuro | media corte |
| Pegatinas | `asset-sticker-contour-template` | `sticker-contour-template-v1.svg` | Plantilla contorno | `/public/assets/templates/stickers/` | SVG | AI | 100x100 mm | 1:1 | 150 KB | si | si | alta | pendiente | plantilla |
| Pegatinas | `asset-sticker-bleed-guide` | `sticker-bleed-guide-v1.svg` | Guia bleed | `/public/assets/overlays/prepress/` | SVG | PDF | 1600x1600 | 1:1 | 100 KB | si | si | alta | pendiente | bleed |
| Papeleria | `asset-card-stack` | `business-card-stack-v1.webp` | Pila tarjetas | `/public/assets/previews/cards/` | WebP | JPG | 2200x1400 | 11:7 | 300 KB | no | no | alta | requerido | hero tarjetas |
| Papeleria | `asset-card-front-single` | `business-card-front-single-v1.webp` | Tarjeta frontal | `/public/assets/previews/cards/` | WebP | PNG | 1600x1000 | 8:5 | 180 KB | si | no | alta | requerido | preview frontal |
| Papeleria | `asset-card-back-single` | `business-card-back-single-v1.webp` | Tarjeta trasera | `/public/assets/previews/cards/` | WebP | PNG | 1600x1000 | 8:5 | 180 KB | si | no | media | futuro | reverso |
| Papeleria | `asset-flyer-preview` | `flyer-preview-v1.webp` | Flyer preview | `/public/assets/previews/paper/` | WebP | JPG | 1800x2400 | 3:4 | 240 KB | no | no | media | futuro | flyer |
| Papeleria | `asset-paper-texture` | `paper-texture-overlay-v1.webp` | Textura papel | `/public/assets/overlays/cinematic/` | WebP | JPG | 1800x1800 | 1:1 | 180 KB | no | no | baja | futuro | storytelling |
| Papeleria | `asset-card-template-master` | `business-card-template-master-v1.pdf` | Plantilla tarjeta | `/public/assets/templates/business-cards/` | PDF | AI | 91x61 mm | 91:61 | 4 MB | no | si | alta | pendiente | descarga |
| Vinilo/carteleria | `asset-vinyl-panel-preview` | `vinyl-panel-preview-v1.webp` | Panel vinilo | `/public/assets/previews/vinyl/` | WebP | JPG | 2400x1500 | 8:5 | 320 KB | no | no | alta | requerido | preview |
| Vinilo/carteleria | `asset-signage-board-preview` | `signage-board-preview-v1.webp` | Panel signage | `/public/assets/previews/signage/` | WebP | JPG | 2200x1600 | 11:8 | 320 KB | no | no | alta | requerido | preview |
| Vinilo/carteleria | `asset-wall-graphic-preview` | `wall-graphic-preview-v1.webp` | Grafica mural | `/public/assets/previews/signage/` | WebP | JPG | 2400x1600 | 3:2 | 350 KB | no | no | media | futuro | escaparate/pared |
| Vinilo/carteleria | `asset-large-format-roll` | `large-format-roll-preview-v1.webp` | Rollo gran formato | `/public/assets/previews/signage/` | WebP | JPG | 2200x1400 | 11:7 | 280 KB | no | no | media | futuro | storytelling |
| Vinilo/carteleria | `asset-measurement-overlay` | `measurement-grid-v1.svg` | Rejilla medidas | `/public/assets/overlays/prepress/` | SVG | PDF | 2000x1400 | 10:7 | 120 KB | si | si | alta | requerido | guia tecnica |
| Vinilo/carteleria | `asset-viewing-distance-guide` | `viewing-distance-guide-v1.svg` | Guia distancia | `/public/assets/overlays/prepress/` | SVG | PDF | 1600x1200 | 4:3 | 120 KB | si | si | media | futuro | lectura |
| Vinilo/carteleria | `asset-vinyl-panel-template` | `printed-vinyl-template-master-v1.pdf` | Plantilla vinilo | `/public/assets/templates/printed-vinyl/` | PDF | AI | 1000x700 mm | 10:7 | 8 MB | no | si | alta | pendiente | descarga |
| Vinilo/carteleria | `asset-signage-template` | `signage-template-master-v1.pdf` | Plantilla carteleria | `/public/assets/templates/signage/` | PDF | SVG | A2/A1 | variable | 8 MB | no | si | media | pendiente | descarga |
| Preprensa | `asset-safe-area-overlay` | `safe-area-overlay-v1.svg` | Zona segura | `/public/assets/overlays/prepress/` | SVG | PDF | 2000x1400 | 10:7 | 100 KB | si | si | alta | requerido | overlay general |
| Preprensa | `asset-bleed-overlay` | `bleed-overlay-v1.svg` | Sangrado | `/public/assets/overlays/prepress/` | SVG | PDF | 2000x1400 | 10:7 | 100 KB | si | si | alta | requerido | overlay general |
| Preprensa | `asset-cutline-overlay` | `cutline-overlay-v1.svg` | Corte | `/public/assets/overlays/prepress/` | SVG | PDF | 2000x1400 | 10:7 | 100 KB | si | si | alta | requerido | overlay general |
| Preprensa | `asset-warning-overlay` | `warning-overlay-v1.svg` | Warnings | `/public/assets/overlays/prepress/` | SVG | PNG | 800x800 | 1:1 | 80 KB | si | si | media | futuro | warning |
| Preprensa | `asset-measurement-grid` | `measurement-grid-v1.svg` | Grid medidas | `/public/assets/overlays/prepress/` | SVG | PDF | 2000x1400 | 10:7 | 120 KB | si | si | alta | requerido | grid |
| Preprensa | `asset-sticker-contour-guide` | `sticker-contour-guide-v1.svg` | Contour guide | `/public/assets/overlays/prepress/` | SVG | PDF | 1600x1600 | 1:1 | 100 KB | si | si | alta | pendiente | pegatinas |
| Preprensa | `asset-card-trim-guide` | `card-trim-guide-v1.svg` | Trim guide | `/public/assets/overlays/prepress/` | SVG | PDF | 1600x1000 | 8:5 | 100 KB | si | si | alta | pendiente | tarjetas |
| Preprensa | `asset-vinyl-panel-guide` | `vinyl-panel-guide-v1.svg` | Panel guide | `/public/assets/overlays/prepress/` | SVG | PDF | 2200x1400 | 11:7 | 140 KB | si | si | media | pendiente | vinilo |
| SEO/social | `asset-og-home` | `og-home-v1.jpg` | OG home | `/public/assets/seo/` | JPG | WebP | 1200x630 | 40:21 | 250 KB | no | no | alta | requerido | share home |
| SEO/social | `asset-og-dti` | `og-dti-v1.jpg` | OG DTI | `/public/assets/seo/` | JPG | WebP | 1200x630 | 40:21 | 250 KB | no | no | alta | requerido | share DTI |
| SEO/social | `asset-og-wrap-bcn` | `og-rotulacion-furgonetas-barcelona-v1.jpg` | OG rotulacion BCN | `/public/assets/seo/` | JPG | WebP | 1200x630 | 40:21 | 250 KB | no | no | alta | futuro | local share |
| SEO/social | `asset-og-blanes` | `og-rotulacion-blanes-v1.jpg` | OG Blanes | `/public/assets/seo/` | JPG | WebP | 1200x630 | 40:21 | 250 KB | no | no | media | futuro | local share |
| SEO/social | `asset-og-stickers` | `og-pegatinas-v1.jpg` | OG pegatinas | `/public/assets/seo/` | JPG | WebP | 1200x630 | 40:21 | 250 KB | no | no | media | futuro | social |
| SEO/social | `asset-og-cards` | `og-tarjetas-v1.jpg` | OG tarjetas | `/public/assets/seo/` | JPG | WebP | 1200x630 | 40:21 | 250 KB | no | no | media | futuro | social |
| SEO/social | `asset-favicon` | `favicon-32.png` | Favicon raster | `/public/assets/brand/` | PNG | ICO | 32x32 | 1:1 | 20 KB | si | no | media | futuro | browser icon |
| SEO/social | `asset-apple-touch-icon` | `apple-touch-icon-180.png` | Apple touch | `/public/assets/brand/` | PNG | JPG | 180x180 | 1:1 | 60 KB | no | no | media | futuro | iOS icon |
| SEO/social | `asset-schema-logo` | `schema-logo-512.png` | Logo schema | `/public/assets/brand/` | PNG | SVG | 512x512 | 1:1 | 120 KB | si | preferible | alta | futuro | schema image |
| Admin/docs | `asset-admin-upload-placeholder` | `upload-placeholder-v1.webp` | Placeholder upload | `/public/assets/admin/` | WebP | PNG | 1200x900 | 4:3 | 120 KB | no | no | media | requerido | empty state |
| Admin/docs | `asset-admin-validation-icons` | `validation-icons-v1.svg` | Iconos estado | `/public/assets/admin/` | SVG | PNG | 512x128 | 4:1 | 60 KB | si | si | alta | futuro | checks admin |
| Admin/docs | `asset-admin-technical-preview` | `technical-preview-frame-v1.webp` | Marco tecnico | `/public/assets/admin/` | WebP | PNG | 1600x1200 | 4:3 | 180 KB | si | no | media | futuro | summary prepress |
| Admin/docs | `asset-doc-header-logo` | `document-header-logo-v1.svg` | Logo docs | `/public/assets/documents/` | SVG | PNG | 800x200 | 4:1 | 50 KB | si | si | alta | futuro | reportes |
| Admin/docs | `asset-doc-watermark` | `document-watermark-v1.png` | Watermark | `/public/assets/documents/` | PNG | SVG | 1200x1200 | 1:1 | 120 KB | si | no | baja | futuro | print view |
| Admin/docs | `asset-doc-stamp` | `approval-stamp-mock-v1.png` | Sello mock | `/public/assets/admin/` | PNG | SVG | 800x800 | 1:1 | 100 KB | si | no | baja | futuro | approvals |
| Admin/docs | `asset-doc-signature` | `signature-block-mock-v1.png` | Firma mock | `/public/assets/documents/` | PNG | SVG | 1200x400 | 3:1 | 80 KB | si | no | baja | futuro | handoff |
| Admin/docs | `asset-doc-printsafe-logo` | `print-safe-logo-v1.svg` | Logo print-safe | `/public/assets/documents/` | SVG | PNG | 600x200 | 3:1 | 40 KB | si | si | media | futuro | A4 |
| Fallbacks | `asset-mobile-home-dti` | `home-dti-mobile-light-v1.webp` | Home mobile ligera | `/public/assets/fallbacks/` | WebP | JPG | 1080x1440 | 3:4 | 180 KB | no | no | alta | futuro | fallback mobile |
| Fallbacks | `asset-mobile-wrap` | `wrap-mobile-light-v1.webp` | Wrap mobile ligero | `/public/assets/fallbacks/` | WebP | JPG | 1080x1440 | 3:4 | 180 KB | no | no | media | futuro | fallback mobile |
| Fallbacks | `asset-reduced-motion-overlay` | `reduced-motion-overlay-v1.svg` | Overlay reducido | `/public/assets/fallbacks/` | SVG | PNG | 1600x900 | 16:9 | 80 KB | si | si | media | futuro | reduced motion |
| Fallbacks | `asset-low-bandwidth-preview` | `low-bandwidth-preview-v1.webp` | Preview ligero | `/public/assets/fallbacks/` | WebP | JPG | 1200x900 | 4:3 | 100 KB | no | no | media | futuro | baja red |
| Fallbacks | `asset-simplified-cinematic-pack` | `simplified-cinematic-pack-v1.webp` | Pack cinematico simplificado | `/public/assets/fallbacks/` | WebP | JPG | 1600x1200 | 4:3 | 160 KB | no | no | baja | futuro | low-end |

## 17. Checklist de produccion

### Prioridad 1

Assets imprescindibles para home + DTI + rotulacion:

- `dti-roll-transparent-v1.webp`
- `textile-hoodie-transparent-v1.webp`
- `wrap-van-side-transparent-v1.webp`
- `print-detail-transparent-v1.webp`
- `final-brand-object-v1.webp`
- `dti-roll-preview-v1.webp`
- `dti-meter-preview-v1.webp`
- `dti-spacing-guide-v1.svg`
- `dti-width-measure-overlay-v1.svg`
- `wrap-van-side-transparent-v1.webp`
- `vehicle-template-side-v1.svg`
- `vehicle-safe-area-overlay-v1.svg`
- `vinyl-panel-preview-v1.webp`
- `signage-board-preview-v1.webp`
- `safe-area-overlay-v1.svg`
- `bleed-overlay-v1.svg`
- `cutline-overlay-v1.svg`
- `og-home-v1.jpg`
- `og-dti-v1.jpg`

### Prioridad 2

Previews de producto + plantillas principales:

- `tshirt-front-transparent-v1.webp`
- `hoodie-front-transparent-v1.webp`
- `sticker-sheet-preview-v1.webp`
- `business-card-stack-v1.webp`
- `business-card-front-single-v1.webp`
- `dti-meter-template-master-v1.pdf`
- `stickers-template-master-v1.ai`
- `business-card-template-master-v1.pdf`
- `printed-vinyl-template-master-v1.pdf`
- `textile-print-area-template-master-v1.pdf`
- `dti-meter-template-preview-v1.webp`

### Prioridad 3

Overlays avanzados + social + reporting:

- `smoke-editorial-overlay-v1.webp`
- `light-gradient-overlay-v1.webp`
- `vinyl-reflection-overlay-v1.webp`
- `warning-overlay-v1.svg`
- `viewing-distance-guide-v1.svg`
- `document-header-logo-v1.svg`
- `print-safe-logo-v1.svg`
- `approval-stamp-mock-v1.png`
- `signature-block-mock-v1.png`
- `og-rotulacion-furgonetas-barcelona-v1.jpg`
- `og-rotulacion-blanes-v1.jpg`
- `og-pegatinas-v1.jpg`
- `og-tarjetas-v1.jpg`
- `apple-touch-icon-180.png`
- `schema-logo-512.png`

## 18. Proximos pasos

### Que assets crear primero

1. Home cinematografica base:
   - `dti-roll-transparent-v1.webp`
   - `textile-hoodie-transparent-v1.webp`
   - `wrap-van-side-transparent-v1.webp`
   - `print-detail-transparent-v1.webp`
   - `final-brand-object-v1.webp`
2. DTI por metro:
   - `dti-roll-preview-v1.webp`
   - `dti-meter-preview-v1.webp`
   - `dti-spacing-guide-v1.svg`
   - `dti-meter-template-master-v1.pdf`
3. Rotulacion:
   - `wrap-van-side-transparent-v1.webp`
   - `vehicle-template-side-v1.svg`
   - `vehicle-safe-area-overlay-v1.svg`
4. Preprensa base:
   - `safe-area-overlay-v1.svg`
   - `bleed-overlay-v1.svg`
   - `cutline-overlay-v1.svg`

### Que puede esperar

- overlays atmosfericos secundarios
- variantes traseras o alternas de producto
- social cards locales secundarias
- assets internos de reporting y firma mock
- fallbacks avanzados low bandwidth

### Que conviene generar con Midjourney / Photoshop

- recortes cinematicos transparentes de home
- mockups editoriales de textil, DTI y vehiculos
- overlays atmosfericos (`smoke`, `light`, `reflection`)
- before/after de vehiculo si no hay fotografia real todavia
- OG social cards base con composicion visual

### Que conviene disenar en CorelDRAW / Illustrator

- overlays tecnicos SVG
- todas las plantillas descargables maestras
- cutlines, bleed, safe area y panel guides
- plantilla lateral de vehiculo
- guias de colocacion textil
- iconografia tecnica y validation icons

### Que debe salir de fotografia real

- vehiculos rotulados reales
- detalle de instalacion de vinilo
- macro de produccion / maquina / tinta
- mockups aplicados reales de DTI sobre prenda
- texturas reales de material, papel y vinilo
- casos locales premium para Barcelona / Blanes / Girona / Costa Brava

### Assets futuros para Supabase Storage

Cuando exista storage real, estos grupos deben migrarse primero:

- `templates/*` como assets versionados descargables
- `previews/*` que deban cambiar por producto o version
- `admin/*` y `documents/*` si se generan variantes de branding
- derivados de `uploads` y `prepress` si pasan a persistencia real

Naming recomendado para storage futuro:

- `brand/{asset-file}`
- `cinematic/home/{asset-file}`
- `previews/{family}/{asset-file}`
- `templates/{family}/{asset-file}`
- `overlays/prepress/{asset-file}`
- `seo/{asset-file}`
- `documents/{asset-file}`

Estado final esperado del proyecto cuando el inventario se complete:

- home cinematografica terminada con DTI como protagonista visual
- fichas de producto con previews reales
- plantillas descargables completas por familia
- prepress visual coherente con reglas y score
- SEO social y local listo para indexacion y comparticion
- admin/reporting con branding documental consistente

## Addendum — Product options, pricing y heroes visuales

Assets nuevos que pasan a prioridad inmediata en producto:

### Pegatinas

- `sticker-square-preview.webp`
- `sticker-circle-preview.webp`
- `sticker-custom-shape-preview.webp`
- `sticker-sheet-preview.webp`
- `sticker-cutline-overlay.svg`
- `sticker-kisscut-overlay.svg`

### Tarjetas de visita

- `business-card-standard-preview.webp`
- `business-card-square-preview.webp`
- `business-card-rounded-preview.webp`
- `business-card-gold-foil-preview.webp`
- `business-card-silver-foil-preview.webp`
- `business-card-3d-varnish-preview.webp`
- `business-card-soft-touch-preview.webp`
- `business-card-stack-premium.webp`

### Flyers y folletos

- `flyer-a6-preview.webp`
- `flyer-a5-preview.webp`
- `flyer-a4-preview.webp`
- `flyer-stack-preview.webp`
- `flyer-double-sided-preview.webp`
- `flyer-soft-touch-preview.webp`

### DTI por metro

- `dti-roll-transparent.webp`
- `dti-meter-preview.webp`
- `dti-spacing-guide.svg`
- `dti-transfer-texture.webp`

### Rotulacion de vehiculos

- `wrap-van-side-transparent.webp`
- `wrap-van-front-transparent.webp`
- `wrap-car-side-transparent.webp`
- `wrap-before-after-preview.webp`
- `vinyl-installation-detail.webp`

### Criterios de salida

- heroes visuales: `WebP`, fondo limpio, lectura editorial y peso contenido
- overlays tecnicos: `SVG`, no imprimibles, colores de guia normalizados
- previews premium: fotografia o mockup realista, no render generico
- naming visible: `DTI` en producto, `DTF` solo como soporte SEO secundario
