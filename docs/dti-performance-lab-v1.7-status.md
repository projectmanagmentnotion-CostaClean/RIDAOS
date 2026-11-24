# RIDAOS DTI Performance Lab V1.7

## Estado de esta rama

El configurador conserva la landing Dark Garage Luxury, Liquid Glass, GSAP y mobile-first. El checkout del resto del catálogo sigue siendo local/mock. Para una cesta con una sola línea DTI, el frontend tiene un recorrido QA aislado y fail-closed: solo activa la creación si se configuran `VITE_DTI_SUPABASE_URL` y `VITE_DTI_SUPABASE_ANON_KEY`, crea el pedido usando las tarifas del servidor, sube el archivo de esta sesión y registra aceptación del cliente separada. Stripe Payment Element solo se habilita con `VITE_DTI_STRIPE_PUBLISHABLE_KEY` `pk_test_` y credenciales TEST en servidor; ningún pago se considera confirmado hasta recibir y verificar el webhook.

La rama contiene una base de backend aislada para revisión local:

- `supabase/migrations/20261124112802_dti_innuro_ecommerce_v1.sql` define pedidos, presupuestos, versiones de archivo, revisiones técnicas, permisos staff, intentos de pago, eventos idempotentes, RLS sin acceso directo a `anon`/`authenticated` y el bucket privado `dti-artwork`.
- Los RPC internos viven en `dti_private`, que no está expuesto por PostgREST. Wrappers `public.dti_*` permiten llamadas desde Edge Functions con `service_role`; sus permisos se revocan para `anon` y `authenticated`.
- `supabase/functions/dti-orders` calcula precios en una función SQL transaccional, registra nombre/contacto y dirección peninsular validada para envíos, admite reintentos con clave idempotente y clave de recuperación aleatoria para invitados, y permite consultar estado sin exponer datos de contacto ni rutas de almacenamiento. El backend calcula despacho aplicando el corte de 18:30 Europe/Madrid y saltando fines de semana.
- `supabase/functions/dti-artwork` limita formatos/tamaño a 20 MiB (para caber holgadamente bajo la memoria de Edge Functions), valida CRC y descompresión de PNG no entrelazado, comprueba estructura/XRef y marcadores PDF incluidos nombres escapados, y deriva formatos profesionales, PNG entrelazados, objetos PDF comprimidos/sospechosos y PDF de más de 10 MiB a revisión. Guarda versiones en el bucket privado e identifica reintentos de subida.
- `supabase/functions/dti-accept-artwork` registra aceptación del cliente por versión mediante una transacción idempotente que conserva la primera marca temporal y verifica la última versión del pedido.
- `supabase/functions/dti-adaptation-quotes` permite a personal autorizado crear presupuestos versionados a 35 €/h + IVA y al cliente aceptarlos o rechazarlos antes de pagar.
- `supabase/functions/dti-staff-operations` registra revisiones técnicas con permiso separado y solo libera a producción si el pedido está pagado y la última versión tiene aceptación del cliente, validación de servidor y aprobación técnica.
- `supabase/functions/dti-payment-intent` reserva intentos por pedido, reutiliza el PaymentIntent para reintentos y solo crea/recupera intents con `sk_test_` y `livemode=false`. Activa métodos automáticos; Apple Pay depende de Stripe y de la verificación del dominio.
- `src/features/dtf/dtiCheckout.ts`, `src/pages/DTFPage.tsx` y `src/pages/Checkout.tsx` conectan el flujo DTI exclusivamente al proyecto QA configurado, conservan el archivo seleccionado en memoria durante la sesión, transmiten una clave de recuperación de invitado, idempotencia de pedido/subida, dirección peninsular completa y aceptación del cliente separada. El cliente puede consultar y aprobar/rechazar el presupuesto de adaptación desde el pedido.
- `src/features/dtf/DtiStripePayment.tsx` carga Stripe.js y monta Payment Element solo con una clave pública `pk_test_`; solicita el PaymentIntent al servidor. La interfaz deja el pedido pendiente y no afirma que se pagó: el webhook debe confirmar el importe. Stripe activa métodos automáticos, con Apple Pay sujeto al dispositivo, navegador, país, configuración Stripe y dominio verificado.
- `supabase/functions/stripe-webhook` valida la firma y `livemode=false`. La función SQL deduplica eventos, verifica importe/moneda y deja pedidos pagados en `paid_awaiting_technical_review`.
- Los carritos DTI persistidos con el nombre anterior se migran a DTI Innuro a 15 €/m IVA incluido; las opciones antiguas de urgencia/calidad se descartan y el envío `express` se adapta a estándar solo para cestas exclusivamente DTI.

Los handlers están preparados para un proyecto QA dedicado de Ridaos con `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DTI_GUEST_TOKEN_SECRET` (32+ caracteres), `DTI_ALLOWED_ORIGIN`, `STRIPE_SECRET_KEY` de test y `STRIPE_WEBHOOK_SECRET` de test. Pedidos invitados deben enviar una clave `x-dti-recovery-key` aleatoria de 32 bytes en base64url; el token de acceso se deriva sin almacenar el token en claro. Las claves privadas solo se usan en servidor. El webhook requiere una URL HTTPS registrada en Stripe Test Mode.

## Verificación hecha

- `npm ci --ignore-scripts --no-audit --no-fund`: instalación limpia aprobada; 158 paquetes desde el lockfile.
- `npm run test`: 18 pruebas unitarias aprobadas. Cubren precios, límites de metraje, IVA, direcciones peninsulares, despacho/corte, carritos nuevo y persistido, carrito mixto, validación PNG/PDF, revisión profesional, firmas de webhook e idempotencia.
- `supabase/tests/dti-commerce.integration.sql`: ejecutado y aprobado en PostgreSQL 17.10 temporal. Se aplicó toda la migración y se verificaron RPCs públicos con permisos, RLS/Storage privado, direcciones, totales, reintentos, presupuestos, aceptación idempotente, webhooks, revisión técnica, liberación a producción y confirmación de plazos largos.
- `npm run lint`: aprobado.
- `npm run build`: aprobado (TypeScript y Vite).
- `git diff --check`: aprobado, con aviso de normalización LF/CRLF en `src/pages/DTFPage.tsx`.

La prueba SQL usó un Postgres desechable con stubs mínimos para `auth.users` y `storage.buckets`; no sustituye Supabase Auth, Storage ni Edge Runtime. Docker, Deno y Supabase CLI local no están disponibles, y no hay un proyecto QA de Ridaos. No se desplegó ni se aplicó ninguna migración remota. El checkout DTI está conectado en código, pero el flujo frontend contra servicios, pagos, webhooks, Storage y Apple Pay no se ha probado en un entorno QA real. No se ejecutó E2E de navegador del flujo DTI actualizado.

## Restricciones y pendientes de servicio

- La organización Supabase disponible contiene proyectos CostaClean, incluido uno QA con esquema CostaClean. No es un backend DTI de Ridaos y no se ha conectado ni modificado.
- Vercel tiene un proyecto `ridaos`, pero no hay variables de Preview configuradas y las funciones actuales de Vercel no sustituyen el backend Supabase aislado.
- No se encontraron credenciales autorizadas de Stripe Test Mode ni un conector Stripe. No se creó infraestructura ni se llamó a Stripe.
- El dominio `dti.ridaosprint.com` aún no está disponible/verificado para Apple Pay. No se modificó DNS.
- Falta provisionar/autorizar un proyecto QA dedicado de Ridaos, aplicar la migración allí y desplegar las funciones con secretos TEST. Hasta entonces la rama no conecta con servicios reales y ningún pago puede funcionar. La UI de Payment Element está condicionada a credenciales `pk_test_`/`sk_test_`; el checkout genérico sigue simulado y DTI falla cerrado cuando no hay QA configurado.
- Las comprobaciones de PNG/PDF no son análisis antivirus ni certificación completa de preimpresión. PNG entrelazados, PDF grandes o sospechosos y AI/PSD/SVG/CDR requieren revisión profesional. La aceptación del cliente no aprueba producción.
- Las fechas de despacho omiten festivos nacionales, catalanes y locales. Antes de presentar una fecha estimada como compromiso, QA necesita un calendario laboral aprobado.
- ESLint y pruebas Node no sustituyen `deno check` ni un entorno Supabase real. El clúster temporal sí ejecutó las funciones PL/pgSQL, pero falta validar las Edge Functions y las rutas de Storage con el runtime y servicios Supabase.

Las reglas comerciales aplicadas en frontend y funciones son 15 €/m IVA incluido, mínimo 1 m, ancho útil de 55 cm, envío peninsular 5 € IVA incluido, recogida en Carrer d'Aragó 423, Barcelona, corte 18:30 Europe/Madrid y preparación de 48 horas laborables hasta 5 m / 3 días laborables para más de 5 hasta 10 m. Por encima de 10 m se requiere confirmación de plazo. El transporte es adicional al plazo de preparación. La adaptación se calcula a 35 €/h más IVA y requiere presupuesto aprobado antes del pago.
