# QA y certificación — no confundir mockup con producto

## Batería de pruebas funcionales

| Caso | Esperado |
|---|---|
| Cargar 4 artes y 6 fotos | Tipos confirmados y hashes guardados |
| PNG transparente / SVG complejo | Alpha correcto, sin recursos maliciosos externos |
| Arte derecho con texto | No se espeja al lado contrario |
| Zoom en logo capó | Letras legibles y no alteradas |
| Rotación 360° | Sin saltos de textura ni costuras críticas |
| Cambiar mate→brillo | Reflejos cambian, colores de arte preservados |
| Girar vehículo con hexágonos fijos | Desplazamiento visual realista de reflejos |
| Rechazar malla IA defectuosa | No puede publicarse |
| Regenerar malla | Placements anteriores no se aplican silenciosamente |
| Guardar + recargar | Persisten placements y revisión |
| Aprobar v1, publicar v2 | La aprobación histórica sigue asociada a v1 |
| Revocar link | Acceso denegado; sin fuga por manifest/asset |
| Viewer sin WebGL | Imágenes estáticas y acciones de feedback disponibles |
| Fallo API IA / reintento | Jobs idempotentes y gasto visible |
| Redeploy | DB y assets siguen disponibles |
| Restaurar backup | Recuperación íntegra en entorno seguro |

## Matriz de dispositivos

- iPhone real Safari (principal).
- Android Chrome (gama media) y móvil en 4G.
- Escritorio Chrome, Safari/WebKit y Firefox reciente.
- Sin soporte WebGL o WebGL fallido: fallback estático.
- Red lenta y memoria limitada; interacción táctil con scroll.

## Presupuesto preliminar a contrastar (NO promesa)

- Entrada usable de la página: aspirar a < 3 s en red normal con placeholder, medido.
- Viewer con primer frame: aspirar a < 5 s en móvil de prueba/4G bueno, adaptando al peso real.
- Giro: objetivo 30 fps estable en dispositivo de referencia; 60 si posible.
- Ningún freeze perceptible > 500 ms durante interacción normal.
- Definir tamaños máximos GLB/texturas según medición real; no seleccionar arbitrariamente 4K para todo.

## QA visual contra fotografía

Capturas de frontal 3/4, izquierdo, derecho, trasera 3/4, capó, macro de material; comparar: geometría, pintura, reflectancia, comportamiento de luces, color, logos, límites de máscaras. Documentar defectos y aprobación humana con capturas/versiones.

## QA seguridad

Access control en cada endpoint, CSRF, rate limit, token expiry/revocation, cross-client leakage, carga de SVG malicioso/PDF inválido, path traversal, MIME spoofing, env leak, secretos en logs, IDOR, anti duplicado, backups y retención.

## Calidad de entrega

lint, TypeScript, unit tests, integration tests, E2E Playwright, construcción reproducible, auditoría de dependencias, smoke staging, verificación de rollback y QA independiente. Guardar resumen de evidencia por fase; nunca declarar PASS con pasos no ejecutados.
