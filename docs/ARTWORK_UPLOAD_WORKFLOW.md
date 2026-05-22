# Artwork Upload Workflow

## Objetivo

Crear un flujo local/mock para que el cliente:

1. seleccione producto o formato
2. suba el archivo
3. reciba una revision automatica mock
4. vea una previsualizacion con guias de impresion
5. lea recomendaciones concretas
6. confirme el archivo
7. continue al carrito

No hay storage real, Supabase, auth ni APIs externas en esta fase.

## Arquitectura

- Flujo principal: `src/features/artwork-upload/components/ArtworkUploadFlow.tsx`
- Hook: `src/features/artwork-upload/hooks/useArtworkUploadFlow.ts`
- Preview: `src/features/artwork-upload/preview/PrintPreviewCanvas.tsx`
- Reglas por producto: `src/features/artwork-upload/product-rules/artworkProductRules.ts`
- Validaciones mock: `src/features/artwork-upload/validation/validateArtworkFile.ts`
- Mapeo de reglas: `src/features/artwork-upload/utils/resolveArtworkRule.ts`
- Capa storage preparada: `src/domain/storage/*`
- Repos mock/future storage: `src/infrastructure/storage/*`

## Reglas por producto

### Tarjetas
- sangrado 3 mm
- zona segura 4 mm
- orientacion preferida horizontal

### Pegatinas
- cutline recomendada
- sangrado y margen de seguridad
- aviso si no se puede verificar linea de corte

### DTF por metro
- ancho util de rollo
- separacion entre disenos
- aviso por resolucion baja

### Vinilo impreso
- sangrado de montaje
- area visible y orientacion

### Carteleria
- resolucion condicionada por formato
- margen seguro y sangrado

### Textil / papeleria
- lectura de tamano final y seguridad del arte

## Que valida el sistema mock

- formato permitido
- peso maximo orientativo
- resolucion aproximada
- orientacion
- sangrado / zona segura
- RGB/CMYK como aviso informativo mock
- cutline si aplica
- separacion entre disenos en DTF

Estados:

- `ready`
- `warning`
- `needs_review`
- `blocked`

## Integraciones actuales

- `DTF_CONFIGURATOR`
- `PRODUCT_CONFIGURATOR`
- `PRODUCT_DETAIL`
- `CART_DRAWER`
- `ADMIN_UPLOAD_REVIEW`

## Como anadir un nuevo producto

1. anadir o ajustar una regla en `artworkProductRules.ts`
2. mapear el producto en `resolveArtworkRule.ts`
3. si el configurador usa archivo, conectar `ArtworkUploadFlow`
4. si debe llegar al admin, dejar `previewSummary` dentro de `artwork`

## Migracion futura a storage real / Supabase

La capa ya separa:

- metadata del archivo
- validacion
- preview visual
- resumen serializable para admin
- contratos de storage
- DTOs de upload/preview
- adaptadores legacy mientras el runtime sigue mock

Cuando llegue la fase real:

1. sustituir `File` local por upload real
2. almacenar preview/metadata en storage
3. persistir validaciones y comentarios en repositorio real
4. reutilizar `previewSummary` como snapshot de revision tecnica
5. cambiar implementaciones de `src/infrastructure/storage/future-supabase/*`
