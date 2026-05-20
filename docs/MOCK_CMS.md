# MOCK CMS INTERNO DE RIDAOSPRINT

Este CMS interno existe para **simular la edicion de contenido, pricing, catalogo, motion y panel admin** antes de activar datos reales.

## Ruta

- `#/admin/content`

## Preview bridge

El storefront puede leer overrides mock de forma opcional desde localStorage.

- Activar con query: `?cmsPreview=1`
- Desactivar con query: `?cmsPreview=0`
- Flag persistente: `ridaosprint-cms-preview-enabled`

La lectura del snapshot mock sigue usando:

- `ridaosprint-mock-cms:v1`

## Como funciona

El studio trabaja contra un repositorio desacoplado:

- Contrato: `src/features/cms/services/contentRepository.ts`
- Implementacion activa: `src/features/cms/services/mockContentRepository.ts`
- Placeholder futuro: `src/features/cms/services/futureSupabaseContentRepository.ts`

La fuente de verdad inicial sale de:

- `src/config/siteMap.ts`
- `src/content/*`
- `src/catalog/*`
- `src/config/pricing/*`
- `src/features/products/product-detail/data/productExperienceContent.ts`
- `src/motion/cinematic/*`

El panel **no modifica archivos fuente**.
Solo hace esto:

1. Lee defaults desde el codigo actual.
2. Crea overrides mock en `localStorage`.
3. Permite exportar/importar snapshots JSON.
4. Permite resetear un documento o todo el snapshot mock.

## Que edita ahora

- Zonas editables (`siteMap`)
- Home content
- Navigation
- Footer
- Catalog content y catalog mock
- DTF content
- Pricing mock
- Product experience content
- FAQ
- Banners
- Admin mock content
- Escenas cinematicas y assets esperados

## Que zonas ya leen preview

Primera fase integrada:

- `HOME_HERO`
- `HOME_FINAL_CTA`
- `NAV_MAIN`
- `FOOTER_MAIN`
- `DTF_CONFIGURATOR`
- `CATALOG_GRID`

El resto sigue leyendo contenido estatico hasta la siguiente fase.

## Que NO edita todavia

- No escribe en disco
- No actualiza la web publica en vivo desde el browser
- No conecta Supabase
- No activa auth
- No activa Stripe
- No crea uploads reales
- No sincroniza cambios entre usuarios

## Guardado mock

Se guarda en:

- `localStorage`
- clave: `ridaosprint-mock-cms:v1`

## Como activar preview

Opciones:

1. Abrir la web con `?cmsPreview=1`
2. Desde `#/admin/content`, usar `Activar preview`

## Como desactivar preview

Opciones:

1. Abrir la web con `?cmsPreview=0`
2. Desde `#/admin/content`, usar `Desactivar preview`

## Exportar

Desde el panel:

- `Exportar snapshot`

Genera un JSON con:

- `version`
- `exportedAt`
- `records[]`

## Importar

Desde el panel:

- `Importar snapshot`

Acepta un JSON exportado previamente.
Solo importa documentos conocidos por el repositorio mock.

## Reset

- `Reset documento`: elimina solo el override del documento activo
- `Reset total`: elimina todos los overrides mock y vuelve a defaults

## Migracion futura a Supabase

La idea es mantener el mismo contrato de repositorio:

- `getZones()`
- `getDocuments()`
- `getDocumentBySourcePath()`
- `saveDocument()`
- `resetDocument()`
- `resetAll()`
- `exportSnapshot()`
- `importSnapshot()`

Cuando llegue la fase real:

1. Se crea `FutureSupabaseContentRepository` real.
2. Se conecta a tablas por documento o por zona.
3. El `ContentStudioPage` deja de depender de `localStorage`.
4. El storefront puede empezar a leer contenido dinámico desde un loader/repository.

En esta fase ya existe el puente, pero solo para unas pocas zonas y siempre con fallback al contenido fuente.

## Ejemplos de peticiones

- `Edita HOME_HERO`
- `Busca PRODUCT_CONFIGURATOR en el CMS mock`
- `Exporta el snapshot del CMS`
- `Resetea DTF_CONFIGURATOR`
- `Modifica PRODUCT_HERO`
- `Cambia el pricing mock de DTF`
