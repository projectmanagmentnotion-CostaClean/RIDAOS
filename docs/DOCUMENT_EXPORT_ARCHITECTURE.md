# Document Export Architecture

## Objetivo

Preparar la arquitectura de documentos operativos y print views antes de conectar un motor PDF real.

No hay todavia:

- PDF engine real
- libreria pesada de render
- persistencia externa
- emails o envios

## Capas

Ruta: `src/features/documents/`

- `components/`
- `layouts/`
- `services/`
- `types/`
- `mock/`
- `utils/`
- `print/` reservado para la siguiente fase si hace falta separar CSS y serializers

## Contratos

Tipos principales:

- `DocumentDefinition`
- `DocumentSection`
- `DocumentBlock`
- `DocumentBranding`
- `DocumentMetadata`
- `DocumentExportTarget`
- `DocumentRenderMode`

Render modes:

- `screen_preview`
- `print_view`
- `future_pdf`

## Conexion con reporting

La capa de reporting sigue generando `ReportDocument`.

La capa de documentos:

1. recibe `ReportDocument`
2. lo transforma con `mapReportToDocument`
3. renderiza preview con `OperationalDocumentLayout`
4. abre print-safe view con `openDocumentPrintView`

## Print-safe

El CSS de impresion vive en `src/App.css` bajo el bloque `Document Export System`.

Hace:

- tamano A4
- margenes
- page breaks seguros
- tablas compactas
- ocultar header/footer/cursor/cinematic/admin chrome

## Futuro PDF real

Cuando llegue la fase real, las opciones razonables son:

- `@react-pdf/renderer` si se prioriza composicion React pura
- `pdf-lib` si se quiere control programatico fino
- headless browser/Puppeteer solo si hace falta fidelidad HTML alta en backend

Recomendacion pragmatica:

1. mantener `DocumentDefinition`
2. crear `FuturePdfDocumentRepository` o `PdfRenderService`
3. mapear `DocumentDefinition -> PDF engine`
4. no tocar reporting ni los builders de reportes
