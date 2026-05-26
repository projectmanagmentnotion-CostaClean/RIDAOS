# Print Template Assets

## Objetivo

Referencia rapida para plantillas descargables, overlays tecnicos y previews funcionales de producto dentro de la arquitectura storefront actual.

Este documento complementa:

- `docs/RIDAOSPRINT_ASSET_MASTER_INVENTORY.md`
- `docs/ARTWORK_UPLOAD_WORKFLOW.md`
- `docs/STORAGE_ARCHITECTURE.md`

## Estructura recomendada

```text
public/assets/templates/
  dti-meter/
  stickers/
  business-cards/
  flyers/
  printed-vinyl/
  signage/
  textile/
  vehicle-wrap/

public/assets/overlays/prepress/
```

## Naming convention

- lowercase
- kebab-case
- sin espacios
- sin acentos
- sufijo `-v1`

Ejemplos:

- `dti-meter-template-master-v1.pdf`
- `stickers-template-master-v1.ai`
- `business-card-template-master-v1.svg`
- `vehicle-safe-area-overlay-v1.svg`

## Plantillas maestras por familia

| Familia | Ruta | Archivo maestro | Formatos esperados | Prioridad |
| --- | --- | --- | --- | --- |
| DTI por metro | `/public/assets/templates/dti-meter/` | `dti-meter-template-master-v1.pdf` | PDF, AI, SVG | alta |
| Pegatinas | `/public/assets/templates/stickers/` | `stickers-template-master-v1.pdf` | PDF, AI, SVG | alta |
| Tarjetas | `/public/assets/templates/business-cards/` | `business-card-template-master-v1.pdf` | PDF, AI, SVG | alta |
| Flyers | `/public/assets/templates/flyers/` | `flyer-template-master-v1.pdf` | PDF, AI, SVG | media |
| Vinilo impreso | `/public/assets/templates/printed-vinyl/` | `printed-vinyl-template-master-v1.pdf` | PDF, AI, SVG | media |
| Carteleria | `/public/assets/templates/signage/` | `signage-template-master-v1.pdf` | PDF, AI, SVG | media |
| Textil | `/public/assets/templates/textile/` | `textile-print-area-template-master-v1.pdf` | PDF, AI, SVG | media |
| Rotulacion vehiculos | `/public/assets/templates/vehicle-wrap/` | `vehicle-wrap-template-master-v1.pdf` | PDF, AI, SVG | media |

## Capas obligatorias

Todas las plantillas maestras deben incluir:

- `01_ARTWORK_AQUI`
- `02_ZONA_SEGURA`
- `03_LINEA_CORTE`
- `04_SANGRADO`
- `05_NOTAS_NO_IMPRIMIR`

## Colores recomendados

- sangrado: verde
- corte: magenta
- zona segura: azul
- notas: gris

## Overlays tecnicos asociados

| Archivo | Ruta | Uso | Formato |
| --- | --- | --- | --- |
| `safe-area-overlay-v1.svg` | `/public/assets/overlays/prepress/` | zona segura general | SVG |
| `bleed-overlay-v1.svg` | `/public/assets/overlays/prepress/` | sangrado general | SVG |
| `cutline-overlay-v1.svg` | `/public/assets/overlays/prepress/` | linea de corte | SVG |
| `measurement-grid-v1.svg` | `/public/assets/overlays/prepress/` | medicion general | SVG |
| `dti-spacing-guide-v1.svg` | `/public/assets/overlays/prepress/` | separacion entre artes DTI | SVG |
| `dti-width-measure-overlay-v1.svg` | `/public/assets/overlays/prepress/` | ancho util DTI | SVG |
| `sticker-cutline-overlay-v1.svg` | `/public/assets/overlays/prepress/` | corte pegatina | SVG |
| `sticker-kisscut-overlay-v1.svg` | `/public/assets/overlays/prepress/` | kiss cut | SVG |
| `sticker-contour-guide-v1.svg` | `/public/assets/overlays/prepress/` | contorno pegatina | SVG |
| `card-trim-guide-v1.svg` | `/public/assets/overlays/prepress/` | corte tarjeta | SVG |
| `vinyl-panel-guide-v1.svg` | `/public/assets/overlays/prepress/` | panel vinilo | SVG |
| `vehicle-safe-area-overlay-v1.svg` | `/public/assets/overlays/prepress/` | zonas conflictivas vehiculo | SVG |
| `textile-placement-guide-v1.svg` | `/public/assets/overlays/prepress/` | area textil | SVG |

## Previews funcionales por familia

Estos previews no sustituyen al hero visual. Sirven para cards de descarga, configuradores y guias.

| Familia | Preview principal | Ruta sugerida |
| --- | --- | --- |
| DTI | `dti-template-preview-v1.webp` | `/public/assets/products/dti/` |
| Pegatinas | `stickers-template-preview-v1.webp` | `/public/assets/products/stickers/` |
| Tarjetas | `business-card-template-preview-v1.webp` | `/public/assets/products/cards/` |
| Flyers | `flyer-template-preview-v1.webp` | `/public/assets/products/flyers/` |
| Vinilo | `printed-vinyl-template-preview-v1.webp` | `/public/assets/products/vinyl/` |
| Textil | `textile-template-preview-v1.webp` | `/public/assets/products/textile/` |
| Rotulacion | `vehicle-wrap-template-preview-v1.webp` | `/public/assets/products/wrap/` |

## Relacion con el storefront actual

- DTI principal: `#/producto/dti-por-metro`
- Pegatinas: `#/producto/pegatinas-personalizadas`
- Tarjetas: `#/producto/tarjetas-visita`
- Flyers: `#/producto/flyers-personalizados`
- Vinilo impreso: `#/producto/vinilo-impreso`
- Rotulacion: `#/producto/rotulacion-furgonetas`
- Textil: `#/producto/textil-personalizado`

## Integracion en codigo

| Superficie | Archivo |
| --- | --- |
| tarjetas de descarga | `src/features/print-templates/components/*` |
| upload guidance | `src/features/artwork-upload/components/ArtworkUploadFlow.tsx` |
| PDP hero y galerias | `src/features/products/product-detail/data/productExperienceContent.ts` |
| option assets | `src/features/product-options/data/productOptionDefinitions.ts` |

## Prioridad de produccion

### Alta

- `dti-meter-template-master-v1.pdf`
- `stickers-template-master-v1.pdf`
- `business-card-template-master-v1.pdf`
- `safe-area-overlay-v1.svg`
- `bleed-overlay-v1.svg`
- `cutline-overlay-v1.svg`
- `dti-spacing-guide-v1.svg`
- `vehicle-safe-area-overlay-v1.svg`

### Media

- `flyer-template-master-v1.pdf`
- `printed-vinyl-template-master-v1.pdf`
- `textile-print-area-template-master-v1.pdf`
- `vehicle-wrap-template-master-v1.pdf`
- previews de plantilla por familia

### Baja

- variantes secundarias
- previews atmosfericos
- extras de carteleria avanzada

## Notas de transicion

Naming y estructura antiguos que ya no deben tomarse como base principal:

- `dtf-meter/` como carpeta visible de plantilla
- prefijos `cinematic-` para plantillas tecnicas
- nomenclatura con `mock` en archivos visibles

La referencia principal del proyecto ya es la separacion:

- `storefront`
- `products`
- `templates`
- `overlays/prepress`
