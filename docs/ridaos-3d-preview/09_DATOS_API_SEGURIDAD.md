# Datos, API y seguridad

## Modelo relacional v0 (propuesto)

| Entidad | Campos esenciales |
|---|---|
| users | id, email, role, created_at |
| clients | id, display_name, contact_email, consent_meta |
| vehicles | id, brand, model, year, variant, body_length, body_height |
| projects | id, client_id, vehicle_id, owner_id, status, default_finish |
| source_assets | id, project_id, kind(photo/artwork/logo), zone, private_uri, sha256, mime, dimensions |
| generation_jobs | id, project_id, provider, provider_model, status, attempts, estimated_cost, actual_cost, error_code |
| mesh_revisions | id, project_id, generation_job_id, private_glb_uri, sha256, metrics, review_status |
| zone_definitions | id, mesh_revision_id, zone_name, mask_uri, calibration_json |
| artwork_placements | id, revision_id, asset_id, zone_id, transform_json, mask_id |
| project_revisions | id, project_id, mesh_revision_id, content_hash, status, created_at |
| publications | id, revision_id, viewer_bundle_ref, token_hash, expires_at, revoked_at, published_at |
| feedback_events | id, publication_id, kind, message, stated_identity, verification_state, created_at |
| audit_events | id, actor_id, resource_type/id, action, request_id, timestamp |

Añadir claves foráneas, índices por estado/proyecto, unicidad para idempotencia, y migraciones versionadas. Evitar guardar contraseñas de cliente en claro o tokens de acceso en DB en forma reutilizable.

## API conceptual (no implementada)

- POST /api/projects, GET /api/projects/:id, PATCH /api/projects/:id
- POST /api/projects/:id/assets/upload-intent; POST /api/projects/:id/assets/complete
- POST /api/projects/:id/generations (idempotency key y límite de presupuesto)
- GET /api/generations/:jobId; POST /api/generations/:jobId/retry
- POST /api/meshes/:revisionId/review
- PUT /api/revisions/:revisionId/placements
- POST /api/revisions/:revisionId/publish
- GET /api/p/:token/viewer-manifest (contenido limitado)
- POST /api/p/:token/feedback; POST /api/p/:token/approve con confirmación/verificación
- POST /api/publications/:id/revoke

## Protección

- Admin con sesión segura, 2FA cuando esté disponible, roles por mínimo privilegio.
- API key de Tripo únicamente en servidor/secret manager; bloquear leaks en builds y logs.
- Assets originales de clientes **privados**. El viewer recibe solo versiones optimizadas necesarias y URLs firmadas/cortas; advertir que todo 3D renderizado en navegador puede ser extraído por un visitante autorizado. No prometer DRM.
- Enlace privado con token aleatorio fuerte, rate limit, revocación y caducidad. No exponer slug de nombre de cliente como único secreto.
- Sanitizar SVG, PDF/EPS y metadatos EXIF, controlar tipos MIME y desactivar scripts/external references; archivos pesados sujetos a cuotas.
- HTTPS, CORS mínimo, CSP, headers, CSRF/anti-replay, validación server-side y logs estructurados sin datos sensibles.
- Evitar PII y matrículas en manifest, logs y URLs; incluir protección de datos GDPR y plazos de retención (decidir antes de lanzar).
- Backups de DB + artefactos con **restore real probado**, no solo copia. Privacidad y permisos de modelos verificables.

## Trabajo asíncrono e idempotencia

Cada job tiene job_id único y presupuesto/cancelación; polling con backoff y estado persistente, sin cargos duplicados tras refresh; webhooks del proveedor se validan si están disponibles. Trabajos «stale» requieren reconciliación al reiniciar.

## Política de publicación

No se publican revisiones no verificadas; approvals quedan ligados a hashes. Prueba obligatoria de cross-client isolation, tokens revocados y reuso de enlaces.
