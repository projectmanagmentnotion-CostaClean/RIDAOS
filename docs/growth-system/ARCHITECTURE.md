# Arquitectura

## Componentes

- Contenido de campañas en `src/features/growth-system/campaignContent.ts` y destinos existentes en `campaigns.ts`.
- Plantilla responsive en `src/features/growth-system/GrowthLandingPage.tsx`.
- Las URL limpias `/growth/{slug}` con HTML pre-generado por Vite para los metadatos sociales; se mantienen las rutas hash antiguas.
- Rewrites limitadas a `/growth/:slug` en `vercel.json`.
- CTAs a fichas actuales y al presupuesto actual.
- SEO dinámico de título y descripción en `src/lib/seo.ts`.
- Formulario existente construye un `mailto:` con contenido y UTM; la aplicación no envía una petición HTTP.
- `src/features/growth-system/contracts.ts` define contratos neutrales para lead, consentimiento, atribución, interacciones, campañas, estados, métricas y repositorio. Es solo una interfaz de dominio; no hay adaptador ni persistencia configurados.
- `scripts/fixtures/inMemoryGrowthRepository.mjs` es un fixture aislado para validar el ciclo CRM en memoria. Solo lo consumen las pruebas Node; no participa en el runtime de la aplicación.
- `metaContracts.ts` define la frontera de eventos de Meta y `server/metaWebhookSecurity.mjs` verifica localmente challenge y firma HMAC del cuerpo original. No existe receptor HTTP, normalizador de payloads Meta ni llamada a API.

## Flujo hoy

```text
Instagram / enlace compartido
        ↓
Landing /growth/{slug}
        ├── ficha existente del producto
        └── presupuesto → validación local → borrador de correo del usuario
                                            └── envío manual por el usuario
```

No existe una API Growth, almacenamiento de leads, CRM Growth, cookie de atribución ni integración Meta. El click y la apertura de la app de correo tampoco se consideran conversiones confirmadas. Los contratos describen consentimiento y exportación/borrado, pero esas operaciones no están disponibles en la aplicación. El ciclo de CRM verificado en el fixture es **PASS_MOCK**, no una capacidad disponible al usuario final.

## Build de landings públicas

El plugin `growthLandingPages` del `vite.config.ts` reutiliza el contenido compartido de campañas y el HTML principal ya compilado. Escribe un `dist/growth/{slug}/index.html` por slug, con canonical en `/growth/{slug}` y tags sociales específicos. Las rewrites de Vercel sirven esos archivos; el cliente React toma el slug del pathname para renderizar la misma plantilla. `scripts/growth-system.test.mjs` prueba transferencia de UTM; `scripts/verify-growth-build.mjs` comprueba slug set, idioma, tags, canonical único, assets y rewrites.

## Evolución permitida

Implementar un adaptador server-side de `GrowthRepository` solo cuando se identifique un backend de RidaosPrint y su autorización. Validar esquema, consentimiento, firma/rate limits e idempotencia y después habilitar persistencia y estados del CRM. Mantener el registro de campañas independiente de proveedores Meta.
