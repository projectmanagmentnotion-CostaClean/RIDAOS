# RidaosPrint Instagram Growth System

## Estado actual

La primera entrega añade cinco landings públicas con URL limpias `/growth/{slug}` y mantiene también sus rutas internas `#/growth/{slug}`: rotulación de vehículos, DTF por metro, textil personalizado, papelería y una página de campañas. Reutilizan las rutas de catálogo y el formulario de presupuesto existentes; el contenido no promete descuentos ni capacidades de Meta que no estén verificadas.

El CTA de presupuesto prepara un correo en el dispositivo. El sitio no guarda el lead ni confirma que se haya recibido: el usuario debe revisar y enviar el borrador. Las solicitudes y conversiones no se incorporan al CRM.

## Rutas

- `/growth/rotulacion-vehiculos`
- `/growth/dtf-por-metro`
- `/growth/textil-personalizado`
- `/growth/papeleria`
- `/growth/promociones`

El build genera HTML por landing con canonical, descripción, Open Graph, Twitter Card e idioma español para vistas previas que no ejecutan JavaScript. `npm run test:growth` prueba transferencia/filtrado de UTM y valida los artefactos generados y las rewrites de Vercel; `npm run build` ejecuta esa verificación.

Los parámetros UTM pueden acompañar el hash. La landing los conserva al abrir el producto y el CTA principal del producto los transfiere al presupuesto; el formulario los añade al borrador de correo. No se persisten ni se envían a analítica.

## Integración

`src/features/growth-system/campaignContent.ts` es el contenido compartido de campañas; `campaigns.ts` relaciona ese contenido con rutas de producto/presupuesto y `GrowthLandingPage.tsx` lo presenta. `campaignAttribution.mjs` transfiere solo parámetros UTM permitidos. El módulo no tiene dependencias nuevas, CRM propio, pixel, SDK de Meta ni acceso directo a datos de clientes.

`contracts.ts` fija el límite del futuro CRM desacoplado (incluidos consentimiento, exportación y borrado) y `metaContracts.ts` define el contrato de eventos Meta normalizados. `server/metaWebhookSecurity.mjs` aporta comprobaciones puras de challenge y firma para uso server-side. `scripts/fixtures/inMemoryGrowthRepository.mjs` implementa el flujo CRM solo en memoria para pruebas: consentimiento, idempotencia, etiquetas, estado, interacciones, vínculos a presupuesto/pedido, métricas y derechos de exportar/borrar. Ninguno se importa desde la app, realiza llamadas a Meta o guarda datos en disco.

## Evidencia de validación

- **PASS_REAL:** TypeScript, ESLint, build Vite, cinco páginas estáticas verificadas, las cinco rutas limpias servidas por Vercel Preview con HTTP 200 y canonical correcto, cuatro pruebas de atribución y dos del verificador HMAC/challenge con secretos ficticios. Esto no demuestra entregas reales desde Meta.
- **PASS_MOCK:** cuatro pruebas del fixture CRM en memoria; no validan persistencia ni seguridad de servidor.
- **BLOCKED_EXTERNAL:** persistencia CRM real y todas las integraciones Meta; faltan backend RidaosPrint, propiedad/autorizaciones, credenciales y permisos.
- **NOT_VERIFIED:** renderizado visual automatizado, navegador in-app real de Instagram, revisión visual completa en iOS/Android y auditoría instrumental de accesibilidad/rendimiento. La comprobación de URL protegida se hizo con lectura HTTP autenticada, no con navegador.

## Criterio para activar captación

Hace falta una base/backend de RidaosPrint autorizado, contrato y retención definidos, endpoint protegido, consentimiento y aviso de privacidad completos, reglas de acceso/RLS, entorno de pruebas, gestión administrativa de leads y pruebas de seguridad. La función `public-lead-intake` inspeccionada corresponde a CostaClean y queda excluida.

La comprobación actual de proyectos Supabase accesibles devuelve `CostaClean QA` y `CostaClean`; no aparece un proyecto de RidaosPrint. Los SQL bajo `supabase/schema/` están marcados como planes y no se ejecutaron; los repositorios Supabase del frontend siguen siendo placeholders. No se conectaron ni consultaron filas de CostaClean. La guía oficial de Supabase exige RLS, permisos mínimos y pruebas antes de exponer tablas a la app; el plan local todavía no demuestra esos controles ([guía RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)).

Consulta [arquitectura](ARCHITECTURE.md), [auditoría de reutilización](REUSE_AUDIT.md), [capacidades Meta](META_CAPABILITIES.md), [roadmap](ROADMAP.md), [seguridad](SECURITY.md), [despliegue](DEPLOYMENT.md) y [operaciones](OPERATIONS.md).
