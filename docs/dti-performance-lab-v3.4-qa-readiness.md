# RIDAOS DTI Performance Lab V3.4 — QA y preparación

Fecha de revisión: 27 de noviembre de 2026  
Rama de trabajo: `feat/dti-performance-lab-v1-6`  
Proyecto Supabase autorizado para QA: `uzldkpnenmfjfwqfkhre`  
Preview protegida: `https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app`

Este documento registra el estado observado en este cambio. Las métricas Lighthouse históricas de V3.3 no se presentan como mediciones de este SHA.

## Matriz de entrega

| Fase | Estado | Evidencia / bloqueo |
|---|---|---|
| Navegación DTI Only | IMPLEMENTED | La política se aplica al host exacto de la Preview QA y al dominio público previsto. Oculta catálogo, servicios y rutas no publicadas incluso al abrir enlaces directos. Conserva compra DTI, soporte, seguimiento y el panel DTI protegido por Auth. QA mantiene `dti_only_mode=true`, producto publicado `dti-innuro`. |
| Navegación DTI Only | TESTED | `tests/publicationPolicy.test.mjs` cubre la Preview exacta, cierre ante rutas no publicadas, carrito, checkout, ayuda, seguimiento y acceso administrativo acotado. Suite completa: 56 pruebas aprobadas en este cambio. No sustituye una prueba visual de Safari/iPhone. |
| CORS Supabase QA | TESTED | Proyecto confirmado como `Ridaos DTI QA` (`uzldkpnenmfjfwqfkhre`, `eu-west-3`, ACTIVE_HEALTHY). Preflight remoto: los seis endpoints DTI (`dti-orders`, `dti-artwork`, `dti-accept-artwork`, `dti-payment-intent`, `dti-adaptation-quotes`, `dti-staff-operations`) devuelven 200 y ACAO exacto para la Preview; un origen ajeno recibe 403 sin ACAO. El helper añade el host únicamente cuando `SUPABASE_URL` pertenece al ref QA y conserva la allowlist configurada. Versiones actualizadas solo en QA: payment-intent v8, adaptation-quotes v8, staff-operations v12. No se tocó Production ni se configuró un wildcard. |
| Stitch | PREPARED | Existe un proyecto Stitch con propuesta móvil editable como HTML. Se retiraron del HTML descargable afirmaciones técnicas y comerciales inventadas. El recurso de captura/screenshot que Stitch devuelve sigue siendo una versión anterior, así que no se usa como evidencia visual aprobada ni se afirma que el render actualizado esté verificado. No hay fotografía auténtica de producto en los assets actuales del repositorio. |
| Figma | BLOCKED | Archivo de destino: [Figma Ridaos](https://www.figma.com/design/eZcswUsaW19LnQQXKgtRBn). La integración devolvió el límite de llamadas MCP del plan Starter incluso con sesión nueva. No se han actualizado pantallas editables. Se requiere restablecimiento de cuota o un plan con llamadas de edición disponibles. |
| Landing, configurador y operación DTI | IMPLEMENTED | Se conserva el configurador y las integraciones DTI existentes; se añade una FAQ específica que usa solo datos comerciales proporcionados. El modo DTI no muestra datos de pedido de demostración como reales y el panel visible queda separado del dashboard simulado legado. |
| Rendimiento | NOT MEASURED | `npm run build` genera el bundle correctamente. El JavaScript de entrada es 254,65 kB sin comprimir / 77,18 kB gzip; GSAP aparece en chunks separados de 69,78 kB / 27,39 kB gzip y ScrollTrigger 42,71 kB / 17,53 kB gzip. No se volvió a ejecutar Lighthouse antes/después en el deployment de este SHA. Las mediciones V3.3 no deben atribuirse a este cambio. RUM/Core Web Vitals de campo no están disponibles. |
| Notificaciones | PREPARED / BLOCKED | Outbox/worker QA existentes con transporte desactivado; no se creó cuenta, clave, remitente, DNS, horario ni correo. La recomendación requiere revisar y aceptar DPA, transferencias, retención, subencargados, política de rebotes y costes con el titular antes de habilitar. |
| Preparación Production | NOT READY | Checklist por completar bajo esta sección. No se ha cambiado Production, DNS, Stripe Live ni se ha publicado el subdominio. |

## Revisión de proveedor de correo (27-11-2026)

Comparación informativa; no constituye asesoramiento legal ni aprobación de proveedor. Los importes publicados pueden cambiar y deben confirmarse antes de contratar.

| Proveedor | Evidencia pública consultada | Consideración para DTI |
|---|---|---|
| Resend | Plan gratuito: 3.000 mensajes/mes con límite diario de 100; Pro publicado a 20 USD/mes por 50.000 mensajes. DPA disponible. La empresa declara que datos guardados —incluidos contenido, logs, webhooks y cuentas— permanecen en EE. UU.; elegir región EU controla envío, no residencia del almacenamiento. | Ya existe un adaptador en la arquitectura QA y su idempotencia simplifica reintentos. Requiere aceptación empresarial del DPA y evaluación de transferencia internacional/retención. [Precios](https://resend.com/pricing), [GDPR y residencia](https://resend.com/security/gdpr), [DPA](https://resend.com/legal/dpa). |
| Postmark | Plan gratuito de 100 mensajes/mes; Basic publicado a 15 USD/mes y 10.000 mensajes, extras a 1,80 USD/1.000 en el precio consultado. Publica DPA, FAQ GDPR y controles de retención de mensajes. | Alternativa transaccional con flujos separados. Validar subencargados, retención y transferencias con la cuenta y documentación contractual. El adaptador actual está orientado a Resend y no debe reemplazarse sin prueba de idempotencia y conciliación. [Precios](https://www.postmarkapp.com/pricing), [DPA](https://postmarkapp.com/dpa), [FAQ GDPR](https://postmarkapp.com/support/article/1218-gdpr-faq). |
| Amazon SES | Precio por región, tráfico y capacidades seleccionadas; AWS publica planes nuevos además de precios de uso. La región de envío puede seleccionarse, pero se debe evaluar la configuración de identidad, eventos y monitorización. | Puede ser eficiente a escala y ofrece regiones europeas, pero requiere más operación técnica y reconciliación de aceptación/reintentos. Obtener una cotización de la región elegida y revisar DPA/subencargados antes de recomendar. [Precios oficiales](https://aws.amazon.com/ses/pricing/). |

**Recomendación de implementación, pendiente de aceptación:** conservar Resend como adaptador de QA existente, con transporte desactivado. La razón es continuidad técnica e idempotencia, no una afirmación de residencia UE. No conectar proveedor ni emitir mensajes hasta una autorización específica y la revisión contractual.

## Checklist de lanzamiento (no ejecutada)

| Área | Estado | Evidencia que falta antes de aprobar |
|---|---|---|
| Vercel Production | NOT VERIFIED | Confirmar proyecto, variables Production, dominio asignado, protección, build SHA, checks y rollback en una revisión separada; no copiar secretos de QA. |
| Supabase Production | NOT VERIFIED | Inventario de migraciones faltantes, backup probado, RLS/storage privado, permisos Auth/ops, funciones y secretos por proyecto; plan de reversión y evidencia de recuperación. No aplicar migraciones. |
| Stripe Live y webhooks | NOT VERIFIED | Revisión de claves de entorno, endpoint/secretos de webhook, importe/moneda, idempotencia, devoluciones y conciliación. Solo modo test en esta etapa; sin crear cobros. |
| Apple Pay | NOT VERIFIED | Elegibilidad por dispositivo, navegador, cuenta, dominio y Stripe; validación del dominio y prueba test tras autorización. |
| Legal/comercial | NOT VERIFIED | Aprobación empresarial de condiciones, privacidad, cookies, desistimiento/devoluciones, datos del vendedor, IVA, transporte y plazos publicados. |
| SEO/consentimiento | NOT VERIFIED | URL canónica `dti.ridaosprint.com`, indexación controlada, sitemap/robots, metadatos DTI/DTF y analítica solo tras consentimiento aplicable. No cambiar DNS. |
| Correo/monitorización | BLOCKED | Selección contractual, DPA/transferencia aprobada, remitente, SPF/DKIM/DMARC y autorización explícita para DNS y envío controlado. |
| Backups/rollback | NOT VERIFIED | Ensayo documentado de recuperación de Supabase y rollback de deployment, responsables y alertas. |
| Safari/iPhone | BLOCKED | Prueba manual con dispositivo iOS físico, VoiceOver, teclado móvil, carga de archivo, reduced motion y viewport seguro. Lighthouse de laboratorio no sustituye esto. |

La publicación pública requiere autorizaciones independientes para DNS, migraciones de Production, Stripe Live y apertura pública. Ninguna se considera otorgada por esta preparación.

## Límites de esta revisión

- En Supabase QA solo se desplegaron las funciones CORS indicadas en la matriz. No se cambiaron datos de pedidos, flags, permisos, secretos, Auth, Stripe ni DNS. No se cambió Vercel Production.
- Para mantener la allowlist de secretos intacta, el alias exacto se añadió mediante `dtiCorsOriginsForProject`, que solo lo suma para el proyecto QA conocido; las seis funciones reflejan ese origen únicamente cuando coincide exactamente. Se desplegaron las tres funciones pendientes a QA y el preflight quedó verificado. No se modificó el valor de `DTI_ALLOWED_ORIGIN`.
- No se ejecutó E2E desde la Preview para el SHA actual ni se volvió a probar Stripe. Los pagos continúan en test, y esta fase no inicia cobros.
- El E2E previo documentado en V3.3 es una evidencia histórica de ese SHA y debe tratarse según su propio alcance y estado de QA, no como una transacción de Production.
