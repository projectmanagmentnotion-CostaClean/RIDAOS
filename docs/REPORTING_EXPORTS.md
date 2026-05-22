# Reporting Exports

## Objetivo

Preparar una capa mock de reportes y exportaciones operativas antes de conectar almacenamiento, PDF real o integraciones externas.

No hay:

- Supabase real
- auth real
- APIs reales
- PDF legal final
- emails reales

## Arquitectura

Ruta principal: `src/features/reporting/`

Ruta documental preparada: `src/features/documents/`

Capas:

- `components/`
- `hooks/`
- `services/`
- `mock/`
- `types/`
- `utils/`
- `exporters/`

## Tipos de reporte

- `ORDER_SUMMARY`
- `PRODUCTION_SHEET`
- `ARTWORK_REVIEW_REPORT`
- `PREPRESS_CHECK_REPORT`
- `DISPATCH_REPORT`
- `DELIVERY_HANDOFF_REPORT`
- `CLIENT_SERVICE_REPORT`
- `CAPACITY_REPORT`
- `ADMIN_KPI_REPORT`

## Formatos disponibles

- `JSON`
- `CSV`
- `PRINT_VIEW`
- `PDF` via engine placeholder

`PDF` ya pasa por una interfaz unica de engine, pero de momento resuelve en `browser_print` y abre la vista imprimible. No genera un PDF real todavia.

## Integraciones actuales

- `#/admin/reporting`
- `#/admin`
- `#/admin/orders/:id`
- `#/admin/production`
- `#/admin/uploads`
- `#/admin/service`

## Capa documental

- `OperationalDocumentLayout`
- `DocumentHeader`
- `DocumentFooter`
- `DocumentSectionBlock`
- `DocumentMetricGrid`
- `DocumentTimelineBlock`
- `DocumentChecklistBlock`
- `DocumentSignatureBlock`
- `pdf/` con engine, adapters y factory

El `PRINT_VIEW` ya no depende de HTML inline improvisado. Ahora usa un contrato documental mock y estilos print-safe preparados para una futura capa PDF.

## Exportacion mock

- JSON: descarga serializada del reporte
- CSV: flatten de secciones a filas
- PRINT_VIEW: ventana imprimible mock en navegador

## Migracion futura

Cuando llegue la fase real:

1. mantener `ReportDocument` como shape intermedio
2. sustituir exportadores locales por generadores PDF/asset reales
3. conectar repositorios de reportes si hace falta persistencia
4. mantener las mismas integraciones UI
5. sustituir `future_pdf` por un renderer real sin reescribir reporting
6. mantener `browser_print` como fallback aunque exista el motor PDF real
