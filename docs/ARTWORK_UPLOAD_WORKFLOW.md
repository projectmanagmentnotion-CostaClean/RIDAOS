# Artwork Upload Workflow

## Objetivo

Crear un flujo local/mock para que el cliente:

1. seleccione producto o formato
2. suba el archivo
3. reciba una revisión automática mock
4. vea una previsualización con guías de impresión
5. lea recomendaciones concretas
6. confirme el archivo
7. continúe al carrito

No hay storage real, Supabase, auth ni APIs externas en esta fase.

## Arquitectura

- Flujo principal: `src/features/artwork-upload/components/ArtworkUploadFlow.tsx`
- Hook: `src/features/artwork-upload/hooks/useArtworkUploadFlow.ts`
- Preview: `src/features/artwork-upload/preview/PrintPreviewCanvas.tsx`
- Reglas por producto: `src/features/artwork-upload/product-rules/artworkProductRules.ts`
- Validaciones mock: `src/features/artwork-upload/validation/validateArtworkFile.ts`
- Mapeo de reglas: `src/features/artwork-upload/utils/resolveArtworkRule.ts`

## Reglas por producto

### Tarjetas
- sangrado 3 mm
- zona segura 4 mm
- orientación preferida horizontal

### Pegatinas
- cutline recomendada
- sangrado y margen de seguridad
- aviso si no se puede verificar línea de corte

### DTF por metro
- ancho útil de rollo
- separación entre diseños
- aviso por resolución baja

### Vinilo impreso
- sangrado de montaje
- área visible y orientación

### Cartelería
- resolución condicionada por formato
- margen seguro y sangrado

### Textil / papelería
- lectura de tamaño final y seguridad del arte

## Qué valida el sistema mock

- formato permitido
- peso máximo orientativo
- resolución aproximada
- orientación
- sangrado / zona segura
- RGB/CMYK como aviso informativo mock
- cutline si aplica
- separación entre diseños en DTF

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

## Cómo añadir un nuevo producto

1. añadir o ajustar una regla en `artworkProductRules.ts`
2. mapear el producto en `resolveArtworkRule.ts`
3. si el configurador usa archivo, conectar `ArtworkUploadFlow`
4. si debe llegar al admin, dejar `previewSummary` dentro de `artwork`

## Migración futura a storage real / Supabase

La capa ya separa:

- metadata del archivo
- validación
- preview visual
- resumen serializable para admin

Cuando llegue la fase real:

1. sustituir `File` local por upload real
2. almacenar preview/metadata en storage
3. persistir validaciones y comentarios en repositorio real
4. reutilizar `previewSummary` como snapshot de revisión técnica
