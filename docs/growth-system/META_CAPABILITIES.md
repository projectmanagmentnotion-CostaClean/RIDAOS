# Capacidades de Instagram y Meta

## Situación del producto

En este código no hay Graph API, Instagram Messaging API, webhooks, OAuth, pixel, Conversions API, Lead Ads ni campañas publicitarias conectadas. No está verificada una cuenta Instagram profesional ni una aplicación de Meta de RidaosPrint. Todas esas funciones quedan **BLOCKED_EXTERNAL**; no se simulan.

Revisión de documentación oficial de Meta el 21-10-2026: la [colección Instagram API de Meta en Postman](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api) enumera permisos separados para funciones básicas, mensajes, comentarios y publicación (`instagram_business_basic`, `instagram_business_manage_messages`, `instagram_business_manage_comments`, `instagram_business_content_publish`). El permiso aplicable depende del endpoint; no se deben pedir todos por defecto.

La colección indica que para Send API hacen falta un token de una cuenta profesional con capacidad para responder, el permiso de gestión de mensajes y que la persona destinataria ya haya iniciado la conversación con la cuenta profesional. También describe limitaciones de inbox/solicitudes, roles de testers y acceso a contenido propio. Antes de construir, confirmar en la referencia vigente el flujo de login, la elegibilidad de cuenta, revisión de app, campos webhook y límites del endpoint concreto.

## Evaluación

| Capacidad solicitada | Estado | Gate externo antes de implementación |
| --- | --- | --- |
| Instagram Graph API / mensajería | BLOCKED_EXTERNAL | Cuenta profesional vinculada, app Meta, token server-side, permiso específico y App Review/acceso que corresponda; el cliente debe iniciar la conversación antes del Send API según la colección revisada. |
| Webhooks de mensajes/comentarios | BLOCKED_EXTERNAL | Callback público seguro, verificación de desafío/firma, suscripción de campos elegibles, permisos de cuenta y pruebas aprobadas. |
| Respuestas privadas a comentarios / keywords | BLOCKED_EXTERNAL | Elegibilidad del evento, políticas/ventana vigentes y permiso aprobado. |
| Automatizaciones Direct | BLOCKED_EXTERNAL | Ventana de mensajería, consentimiento y reglas actuales de Meta. |
| Click-to-Instagram Direct / WhatsApp | BLOCKED_EXTERNAL | Configuración comercial y destino verificado por RidaosPrint. |
| Meta Lead Ads | BLOCKED_EXTERNAL | Página/Business autorizados, permisos lead retrieval y consentimiento. |
| Pixel y Conversions API | BLOCKED_EXTERNAL | Dataset/Pixel propio, base legal y consentimiento, endpoint server-side y deduplicación. |
| Enlaces de Reels | Manual / nativo | Usar herramientas de Instagram; no inventar endpoint de creación de enlaces. |

No scraping, automatización de la interfaz, credenciales personales de terceros, campañas reales o gasto publicitario. No existe atribución de conversión activa.

## Contrato futuro

`src/features/growth-system/metaContracts.ts` define los tipos de eventos normalizados y el contrato del adaptador. `src/features/growth-system/server/metaWebhookSecurity.mjs` comprueba localmente challenge y firma HMAC del cuerpo original; las pruebas usan un secreto ficticio. No hay listener, normalizador de payload real, token ni llamada a Meta. Mantener proveedores fuera del dominio comercial: el adaptador server-side traducirá solo eventos autorizados y con clave idempotente. No mandar PII/hashed PII hasta revisar base legal, minimización y requisitos vigentes.
