# RIDAOS DTI Performance Lab V3.5 — SEO host routing and QA access

Fecha: 27 de noviembre de 2026

Rama: `feat/dti-performance-lab-v1-6`

Base revisada: `8e60a1c764b7642b55fb5cb19141b2e6ae57e4b1`

Supabase: Ridaos DTI QA `uzldkpnenmfjfwqfkhre`

Preview prevista: `https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app`

## Estado por requisito

| Estado | Área | Evidencia y alcance |
|---|---|---|
| IMPLEMENTED | SEO DTI y catálogo | El origen canónico se selecciona por hostname exacto. El dominio DTI y la Preview estable usan `https://dti.ridaosprint.com`; el resto de hosts conserva `https://ridaos.vercel.app`. `robots.txt` y `sitemap.xml` se generan en una función Vercel según el host: DTI recibe solo Inicio y DTI Innuro; los demás hosts conservan todas las URLs del sitemap original. Las rutas del sitemap se reescriben a `index.html` y la SPA reconoce el pathname al entrar directamente. No se modificó DNS. |
| IMPLEMENTED | Navegación móvil | El viewport incluye `viewport-fit=cover`; header, contenido y área inferior respetan las safe areas. El hero DTI ahora identifica su render como una ilustración y no como fotografía del producto. |
| PASS | QA CORS | Se comprobó el proyecto `uzldkpnenmfjfwqfkhre`. Las seis funciones de navegador DTI devuelven preflight `200` con `Access-Control-Allow-Origin` igual al host Preview exacto. El control con un origen ajeno devuelve `403` y no refleja `Access-Control-Allow-Origin`. No se sobrescribió `DTI_ALLOWED_ORIGIN`: el helper QA existente añade el host solo si `SUPABASE_URL` coincide con el proyecto QA, preservando su allowlist. |
| PASS / LIMITED | Acceso del usuario invitado | La tabla de permisos QA mostraba `review_artwork` y `manage_production` en la cuenta invitada pese a la instrucción previa de mantenerla sin permisos. Se revocaron exclusivamente esas dos filas y se verificó `staff_permission_count=0`. La función `dti-staff-operations` sin sesión devuelve `401 authentication_required`. No se obtuvo una sesión JWT válida para confirmar el `403 insufficient_staff_permission` de extremo a extremo; no se generó otra invitación ni se concedieron permisos. |
| PASS | DTI Only | Consulta a Supabase QA: `dti_only_mode=true`; `published_product_codes=["dti-innuro"]`. No se modificó esta bandera. El resto del e-commerce permanece en el repositorio y el sitemap original se conserva para hosts no DTI. |
| PASS | Pruebas locales | `npm.cmd test`: 70 pruebas aprobadas, incluyendo host SEO, assets dinámicos, rutas directas, CORS, reglas comerciales y pagos. `npm.cmd run lint`, `npm.cmd run build` y `git diff --check` pasan. Build Vite: JS de entrada 245,18 kB bruto / 74,47 kB gzip; CSS global 132,82 kB / 25,58 kB gzip. |
| BLOCKED | Figma editable | La integración Figma devolvió límite de llamadas MCP del plan Starter. No se afirma que el archivo Figma se haya actualizado. Se requiere restablecimiento de cuota o capacidad de edición disponible. |
| PREPARED | Stitch y recursos visuales | La pantalla móvil de Stitch se corrigió para usar solo datos comerciales aprobados y rotular el visual como ilustrativo. Aún falta fotografía o vídeo real del producto; los assets del repositorio no la contienen. |
| NOT MEASURED | Rendimiento real | No hay Lighthouse antes/después sobre el deployment de este SHA, medición de campo ni prueba en dispositivo. Los chunks GSAP/ScrollTrigger siguen separados por la carga existente. Un build correcto no demuestra LCP, CLS o INP reales. |
| BLOCKED | Safari, iPhone y accesibilidad física | No se dispone de Safari/iPhone físico ni VoiceOver en este entorno. El CSS reduced-motion existente se conserva, pero estas comprobaciones requieren dispositivo real. |
| PREPARED / BLOCKED | Notificaciones | El adaptador/outbox QA existente mantiene el envío desactivado. No se creó cuenta, remitente, clave, registro DNS ni se envió correo. La evaluación de proveedores está en `docs/dti-performance-lab-v3.4-qa-readiness.md`; hace falta decisión contractual y aprobación antes de habilitar transporte. |
| NOT READY | Producción | No se modificaron `main`, Production, DNS, Stripe Live ni servicios de pago. El checklist de la revisión V3.4 permanece abierto. |

## Verificación de publicación Preview

Vercel confirma el deployment `dpl_AWaLTtzpKtACQPCGkZ1aXuv7jhPg` en estado `READY`, con SHA `f9632da2b021e0ed306cb35ae33fd5f3d308fd60`. El alias QA estable apunta a ese deployment.

La Preview protegida devolvió `200` en `/robots.txt` y `/sitemap.xml`. Robots apunta al sitemap DTI; el XML solo enumera Inicio y `/producto/dti-por-metro`. La ruta de producto directa devuelve `200` y el `index.html` de la SPA. La prueba de render React en navegador no pudo hacerse porque Chrome no estaba disponible para automatización en esta sesión. Las reglas Vercel para host y rutas están además cubiertas por pruebas unitarias del handler/configuración.

## Alcance QA y límites

- La cuenta de staff de QA queda sin permisos. Sin una sesión reutilizable, el endpoint devuelve `401`; el `403 insufficient_staff_permission` autenticado sigue pendiente de que el titular abra operaciones en la Preview con su sesión ya establecida. No se solicitan contraseñas, enlaces de acceso ni nuevos correos.
- La evidencia de Stripe Test, rechazo e idempotencia se mantiene en los informes anteriores. Esta revisión no inició pagos ni webhooks.
- La Preview está protegida por Vercel Authentication. No se considera pública ni indexable mientras siga protegida.
- Para preparar Producción siguen pendientes, con aprobaciones separadas: DNS del subdominio, migraciones y secretos de Supabase Production, Stripe Live, correo transaccional y apertura pública.
