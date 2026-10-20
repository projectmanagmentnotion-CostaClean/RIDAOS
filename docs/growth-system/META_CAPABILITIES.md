# Capacidades de Instagram y Meta

## Situación del producto

En este código no hay Graph API, Instagram Messaging API, webhooks, OAuth, pixel, Conversions API, Lead Ads ni campañas publicitarias conectadas. No está verificada una cuenta Instagram profesional ni una aplicación de Meta de RidaosPrint. Todas esas funciones quedan **BLOCKED_EXTERNAL**; no se simulan.

Revisión de la documentación del espacio oficial Instagram de Meta el 21-10-2026: la [colección Instagram API](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api) documenta dos configuraciones de inicio de sesión con requisitos distintos. No elegir ni implementar un flujo hasta confirmar los activos que administra RidaosPrint.

| Configuración documentada por Meta | Requisito / alcance relevante |
| --- | --- |
| [Instagram API con Instagram Login](https://www.postman.com/meta/instagram/folder/1z5vxzu/instagram-api-with-instagram-login) | Para cuentas profesionales Business y Creator. No requiere vincular una Facebook Page. La colección enumera `instagram_business_basic`, `instagram_business_manage_messages`, `instagram_business_manage_comments` y `instagram_business_content_publish`; solicitar solo los permisos necesarios para los endpoints realmente elegidos. Esta configuración no accede a Ads ni tagging. |
| [Instagram API con Facebook Login](https://www.postman.com/meta/instagram/folder/u4g5a2a/instagram-api-with-facebook-login) | Requiere una Facebook Page vinculada a la cuenta profesional de Instagram. La colección enumera `pages_show_list`, `pages_read_engagement`, `instagram_basic`, `instagram_manage_comments` e `instagram_content_publish` para las solicitudes mostradas; el permiso concreto depende del endpoint. |

Para Send API, Meta exige un token de la cuenta profesional que envía, `instagram_business_manage_messages` en el flujo Instagram Login y que la persona destinataria haya iniciado la conversación con la cuenta profesional. La colección también documenta límites de bandeja/solicitudes, roles de testers y que el contenido compartido por mensaje puede llegar como URL. Las cuentas personales no son elegibles para estas APIs profesionales. Antes de construir, verificar en la referencia vigente el flujo, acceso avanzado/App Review, campos de webhook, ventanas y límites del endpoint específico.

## Evaluación

| Capacidad solicitada | Estado | Gate externo antes de implementación |
| --- | --- | --- |
| Instagram Graph API / mensajería | BLOCKED_EXTERNAL | Confirmar cuál de los dos flujos corresponde a los activos Ridaos, cuenta profesional, app, token server-side, permisos específicos y App Review/acceso que corresponda; en Send API el cliente debe iniciar la conversación antes de responder. |
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
