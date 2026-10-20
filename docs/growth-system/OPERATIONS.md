# Operaciones

## Uso actual

- Compartir la URL limpia `/growth/{slug}` con parámetros UTM si se desea identificar el origen en el borrador.
- El visitante usa la ficha de producto o abre el presupuesto.
- Validar el formulario solo redacta un correo al canal comercial existente. El usuario debe comprobarlo y enviarlo; el equipo solo lo recibe después de ese envío.
- Una apertura de correo no es lead recibido ni conversión.
- La página `promociones` no presenta descuentos inventados; editar el registro solo cuando haya oferta aprobada y fechas/condiciones comprobables.

## Supervisión actual

No hay eventos Growth, CRM, webhook, analítica ni alarmas específicas. Revisar solicitudes en la bandeja de correo comercial, fuera de esta aplicación.

## Guía pendiente de conexión de Instagram

1. El titular confirma quién administra la cuenta Instagram profesional y el Business Portfolio asociado; no compartir claves personales con la aplicación.
2. En Meta for Developers, crear o seleccionar una app perteneciente al negocio y añadir solo los productos/API necesarios para el caso acordado. Registrar responsables, cuentas, permisos exactos y estado de App Review.
3. Para mensajería, comprobar que la conversación se inicia en las condiciones admitidas y que el permiso `instagram_business_manage_messages` está concedido. La colección oficial advierte que el destinatario debe haber enviado un mensaje a la cuenta profesional antes de responder por API: [Instagram API de Meta](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api).
4. Antes de suscribir webhooks, desplegar un endpoint público con verificación de challenge/firma, idempotencia, minimización de payload, registro sin PII y una forma de desactivar el receptor. Probar con usuarios y eventos de prueba.
5. Para Lead Ads, Pixel o Conversions API, confirmar titularidad de Page/dataset, permisos y revisión por separado. No crear campañas, cambiar presupuesto ni enviar PII a Meta sin autorización y revisión legal.
6. Mantener respuestas automáticas apagadas hasta aprobar contenido, ventanas de mensajería, consentimiento, fallos y transferencia a persona. Linked Reels se configura con las herramientas nativas de Instagram.

## Guía de operación de campañas

- Crear un slug de campaña aprobado y asignar landing/producto; no codificar descuentos, stock ni plazos que el titular no haya confirmado.
- Enlaces orgánicos pueden usar `utm_source=instagram`, `utm_medium=organic`, `utm_campaign={slug}` y `utm_content={ubicacion-creativa}`. No colocar nombres, emails, teléfonos ni otros datos personales en parámetros.
- Compartir la URL de la landing en el lugar que permita Instagram. La navegación landing→producto→presupuesto conserva los cinco campos UTM permitidos; no se graban en el navegador ni se envían a analítica. No automatizar comentarios, scraping, DMs o enlaces de Reels.
- Antes de promocionar una oferta, registrar titular, fechas, condiciones, códigos y responsable de retirada. La página actual de promociones no contiene oferta activa.
- Medir solo métricas que realmente existan. Hoy se pueden revisar parámetros que llegan al borrador de email, pero no hay analítica, CRM o conversiones capturadas.

## Incidentes

Como no hay captura ni envío server-side desde estas páginas, un error de formulario no crea registro en CRM. Si el correo no se abre, contactar por el canal publicado por RidaosPrint. Tras activar backend en el futuro, definir responsable, redacción de logs sin PII, reintentos idempotentes, alerta y procedimiento de deshabilitación antes del release.

## Verificación previa y rollback

Antes de una release: confirmar PR revisado, `npm ci`, lint, TypeScript, build y pruebas; revisar contenido legal/ofertas, rutas limpias en Preview y móvil; comprobar que no se exponen secretos ni datos de prueba; confirmar los flags de integración por entorno. No publicar si se habilita captación sin backend y consentimiento.

Ante regresión pública, una persona con acceso Vercel debe promover el último deployment estable o revertir el PR, verificar rutas y formularios y documentar el incidente. Este proyecto no ejecuta deployments, rollback remoto ni cambios de variables desde este flujo.
