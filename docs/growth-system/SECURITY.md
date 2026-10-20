# Seguridad y privacidad

## Implementado

- Las landings no usan cookies, pixel ni almacenamiento de lead.
- Los UTMs solo se leen al pulsar para preparar el correo y se ponen en el cuerpo del borrador.
- El navegador no llama a Supabase ni lleva secretos.
- El CTA usa el email comercial ya configurado en el código (`hola@ridaosprint.com`) mediante `mailto:`; el usuario revisa y envía el mensaje.
- El nombre de archivo de referencia se anota como texto; el fichero local no se adjunta automáticamente.
- El módulo server-only `server/metaWebhookSecurity.mjs` verifica el challenge y `X-Hub-Signature-256` sobre el cuerpo original con comparación de tiempo constante; sus pruebas usan secretos ficticios. No hay endpoint, secreto configurado ni tráfico Meta.

## Riesgos pendientes antes de captar leads en web

- Las fichas legales son resúmenes y no completan aviso, privacidad, conservación, derechos ni consentimiento.
- Falta backend exclusivo de RidaosPrint, control de acceso al panel y roles/RLS. El contrato define exportación y borrado, pero no existe una implementación operativa de esos derechos.
- Sin endpoint no se pueden implementar firma, rate limit, idempotencia, validación de abuso ni registro de errores server-side.
- El proceso mailto depende del cliente de correo del usuario; no produce acuse ni registro CRM.
- No se cargan datos al Pixel/CAPI; no hay consentimiento para ello.

## Requisitos mínimos del futuro backend

Validar tamaño/shape y consentimiento en servidor; límites y CAPTCHA adaptativo si el abuso lo requiere; idempotencia con expiración; RLS en toda tabla expuesta; secretos solo server-side; minimizar PII y logs; política de retención y borrado; pruebas negativas de firma/autorización. No usar service-role en frontend. Revisar [Supabase: Secure data](https://supabase.com/docs/guides/database/secure-data) y [Edge Function secrets](https://supabase.com/docs/guides/functions/secrets).
