# Storage Architecture

## Objetivo

Preparar la arquitectura definitiva de uploads, storage y assets antes de conectar Supabase Storage real.

No hay:

- Supabase real
- buckets reales
- uploads externos
- auth real

## Capas

### Domain

Ruta: `src/domain/storage/`

Contiene:

- entidades consolidadas
- contratos de repositorio
- DTOs
- validacion / normalizacion
- mappers

Entidades principales:

- `ArtworkUploadRecord`
- `UploadAsset`
- `PreviewAsset`
- `ProductTemplateAsset`
- `MockStorageFile`
- `ArtworkReview`
- `ArtworkValidationResult`
- `ArtworkGuide`
- `ArtworkPreview`

### Infrastructure

Ruta: `src/infrastructure/storage/`

Subcapas:

- `mock/`
- `future-supabase/`
- `adapters/`

Objetivo:

- mock actual como implementacion viva
- placeholders futuros para Supabase Storage
- adaptador legacy para que la app siga usando `uploadRepository` sin romper nada

## Repositories

- `UploadStorageRepository`
  - archivos locales mock / records de storage
- `ArtworkRepository`
  - lista y guarda uploads de artwork
- `PreviewAssetRepository`
  - previews derivados
- `ProductTemplateRepository`
  - overlays, plantillas descargables, assets de preview
- `ArtworkReviewRepository`
  - revisiones y checklist de preprensa

## DTOs

Ruta: `src/domain/storage/dto/`

- `UploadStorageDto`
- `ArtworkPreviewDto`
- `ArtworkValidationDto`

## Validation

Ruta: `src/domain/storage/validation/`

Hace:

- parseo defensivo
- normalizacion minima
- fallback limpio si el shape llega incompleto o corrupto

No usa `zod` en esta fase para no meter peso ni dependencia nueva. La validacion es manual y tipada.

## Mappers

Ruta: `src/domain/storage/mappers/`

Responsabilidades:

- convertir upload domain -> DTO
- derivar `MockStorageFile`
- derivar `PreviewAsset`
- derivar `ArtworkReview`

## Upload lifecycle

1. cliente selecciona archivo local
2. se extrae metadata local
3. se valida contra reglas del producto
4. se genera `ArtworkPreviewSummary`
5. el carrito/pedido guarda snapshot del upload
6. admin uploads lee el mismo snapshot
7. futura capa real sustituira solo repositorios e infraestructura

## Preview lifecycle

1. `File` local produce metadata
2. metadata -> preview visual
3. preview -> `PreviewAsset` derivado
4. review/admin usan el mismo resumen serializable
5. `features/prepress` consume el mismo contrato para score, checks avanzados y admin review

## Transicion futura a Supabase Storage

Paso previsto:

1. implementar repositorios `future-supabase/*`
2. sustituir `createLocalFileRecord` por upload real a bucket
3. persistir `ArtworkReview` y `PreviewAsset`
4. mantener intactas UI, hooks y componentes
5. conectar un motor real de preflight sin cambiar el contrato `ArtworkValidationResult`

## Compatibilidad legacy

La app todavia usa `src/repositories/uploadRepository.ts` y `src/services/uploadService.ts`.

Eso sigue funcionando porque:

- `domain/uploads/*` reexporta la nueva capa
- `legacyUploadRepositoryAdapter` adapta `ArtworkRepository` al contrato antiguo
