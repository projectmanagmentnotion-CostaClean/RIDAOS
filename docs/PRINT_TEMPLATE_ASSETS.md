# Print Template Assets

## Objetivo

Inventario base para preparar previews profesionales, overlays de guias y assets cinematicos sin conectar storage real todavia.

## Naming convention

- prefijo por dominio: `print-`, `guide-`, `cinematic-`, `template-`
- kebab-case
- sufijos utiles:
  - `-overlay`
  - `-preview`
  - `-transparent`
  - `-template`
  - `-safe-zone`

Ejemplos:

- `guide-business-card-front-overlay.webp`
- `print-dtf-roll-preview-overlay.webp`
- `cinematic-wrap-car-transparent.webp`
- `template-printed-vinyl-visible-area.pdf`

## Assets para previews de impresion

| Asset | Uso | Formato | Fondo | Tamano recomendado | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `guide-business-card-front-overlay.webp` | sangrado + corte tarjeta | WebP | transparente | 2400x1400 | alta |
| `guide-business-card-back-overlay.webp` | reverso tarjeta | WebP | transparente | 2400x1400 | media |
| `guide-stickers-cutline-overlay.webp` | pegatinas con linea de corte | WebP | transparente | 2200x2200 | alta |
| `print-dtf-roll-preview-overlay.webp` | preview de rollo DTF | WebP | transparente | 2600x1600 | alta |
| `guide-printed-vinyl-visible-area-overlay.webp` | area visible vinilo impreso | WebP | transparente | 2600x1600 | alta |
| `guide-signage-safe-zone-overlay.webp` | seguridad carteleria | WebP | transparente | 2600x1800 | media |
| `template-business-card-print-file.pdf` | plantilla descargable tarjeta | PDF | no | A4 / 300 dpi | media |
| `template-printed-vinyl-visible-area.pdf` | plantilla descargable vinilo | PDF | no | A3 / 300 dpi | media |

## Catalogo de plantillas mock

Rutas esperadas en `public/assets/templates/`:

- `dtf-meter/`
- `stickers/`
- `business-cards/`
- `printed-vinyl/`
- `signage/`
- `textile/`
- `paper/`

Estado actual:

- la UI ya muestra catalogo, formatos y rutas mock
- si el archivo no existe, la experiencia debe quedar en `Plantilla pendiente`
- no hay fetch obligatorio ni dependencia de storage real todavia

## Assets para storytelling home cinematica

| Asset | Escena | Formato | Fondo | Tamano recomendado | Prioridad |
| --- | --- | --- | --- | --- | --- |
| `cinematic-textile-hoodie-transparent.webp` | `TEXTILE_DTF_TRANSITION` | WebP | transparente | 2400x3000 | alta |
| `cinematic-dtf-roll-transparent.webp` | `HERO_CINEMATIC` | WebP | transparente | 2600x1600 | media |
| `cinematic-wrap-car-transparent.webp` | `VEHICLE_WRAP_TRANSITION` | WebP | transparente | 3200x1800 | alta |
| `cinematic-print-detail-transparent.webp` | `PRODUCTION_DETAIL_TRANSITION` | WebP | transparente | 2600x1600 | media |
| `cinematic-final-brand-object.webp` | `FINAL_BRAND_REVEAL` | WebP | transparente | 2200x2200 | alta |

## Overlays y requerimientos visuales

- guias de corte: transparent PNG o WebP sin fondo
- safe zones: color unico semitransparente, no raster borroso
- bleed overlays: trazos limpios, no sombra
- assets cinematicos: preferir WebP con transparencia real
- overlays descargables: PDF para plantillas y SVG solo si la geometria lo exige

## Prioridad de produccion

1. overlays de preview por producto
2. plantillas descargables principales
3. assets cinematicos de home
4. variantes secundarias por orientacion o reverso

## Addendum — Product options premium

Nuevos assets priorizados por esta fase:

### Pegatinas

- `sticker-square-preview.webp`
- `sticker-circle-preview.webp`
- `sticker-custom-shape-preview.webp`
- `sticker-sheet-preview.webp`
- `sticker-cutline-overlay.svg`
- `sticker-kisscut-overlay.svg`

### Tarjetas

- `business-card-standard-preview.webp`
- `business-card-square-preview.webp`
- `business-card-rounded-preview.webp`
- `business-card-gold-foil-preview.webp`
- `business-card-silver-foil-preview.webp`
- `business-card-3d-varnish-preview.webp`
- `business-card-soft-touch-preview.webp`
- `business-card-stack-premium.webp`

### Flyers

- `flyer-a6-preview.webp`
- `flyer-a5-preview.webp`
- `flyer-a4-preview.webp`
- `flyer-stack-preview.webp`
- `flyer-double-sided-preview.webp`
- `flyer-soft-touch-preview.webp`

### DTI

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

Notas:

- `DTI` debe ser el naming visible de plantillas y previews.
- `DTF` se conserva solo como apoyo SEO o referencia tecnica secundaria.
- Los heroes visuales deben resolverse como `WebP` ligeros y las guias tecnicas como `SVG`.
