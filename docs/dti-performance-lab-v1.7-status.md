# RIDAOS DTI Performance Lab V1.7

## Estado de esta rama

El configurador y el checkout visibles siguen en modo local/mock. No crean pedidos reales ni muestran una confirmación de pago real. La landing conserva la experiencia Dark Garage Luxury, Liquid Glass, GSAP y mobile-first. Los metadatos globales del sitio no se fuerzan a DTI; el SEO de DTI/DTF se define en la ruta de producto.

La rama contiene una base de backend aislada para revisión local:

- `supabase/migrations/20261124112802_dti_innuro_ecommerce_v1.sql` define pedidos, presupuestos, versiones de archivo, revisiones técnicas, permisos staff, intentos de pago, eventos idempotentes, RLS sin acceso directo a `anon`/`authenticated` y el bucket privado `dti-artwork`.
- `supabase/functions/dti-orders` calcula precios en una función SQL transaccional, admite reintentos con clave idempotente y clave de recuperación aleatoria para invitados, y permite consultar estado sin exponer datos de contacto ni rutas de almacenamiento. El backend calcula despacho aplicando el corte de 18:30 Europe/Madrid y saltando fines de semana.
- `supabase/functions/dti-artwork` limita formatos/tamaño, valida CRC y descompresión de PNG no entrelazado, comprueba estructura/XRef y marcadores activos en PDF, guarda versiones en el bucket privado y deriva formatos profesionales, PNG entrelazados, PDF sospechosos y archivos grandes a revisión.
- `supabase/functions/dti-accept-artwork` registra aceptación del cliente por versión y verifica que corresponda a la versión más reciente del pedido.
- `supabase/functions/dti-adaptation-quotes` permite a personal autorizado crear presupuestos versionados a 35 €/h + IVA y al cliente aceptarlos o rechazarlos antes de pagar.
- `supabase/functions/dti-staff-operations` registra revisiones técnicas con permiso separado y solo libera a producción si el pedido está pagado y la última versión tiene aceptación del cliente, validación de servidor y aprobación técnica.
- `supabase/functions/dti-payment-intent` reserva intentos por pedido, reutiliza el PaymentIntent para reintentos y solo crea/recupera intents con `sk_test_` y `livemode=false`. Activa métodos automáticos; Apple Pay depende de Stripe y de la verificación del dominio.
- `supabase/functions/stripe-webhook` valida la firma y `livemode=false`. La función SQL deduplica eventos, verifica importe/moneda y deja pedidos pagados en `paid_awaiting_technical_review`.

Los handlers están preparados para un proyecto QA dedicado de Ridaos con `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DTI_GUEST_TOKEN_SECRET` (32+ caracteres), `DTI_ALLOWED_ORIGIN`, `STRIPE_SECRET_KEY` de test y `STRIPE_WEBHOOK_SECRET` de test. Pedidos invitados deben enviar una clave `x-dti-recovery-key` aleatoria de 32 bytes en base64url; el token de acceso se deriva sin almacenar el token en claro. Las claves privadas solo se usan en servidor. El webhook requiere una URL HTTPS registrada en Stripe Test Mode.

## Verificación hecha

- `npm ci --ignore-scripts --no-audit --no-fund`: completado; instaló 158 paquetes. Los scripts de instalación se omitieron deliberadamente.
- `npm run test`: 16 pruebas unitarias aprobadas. Cubren precios, límites de metraje, IVA, despacho/corte, carrito mixto, validación de PNG/PDF, revisión profesional, firmas de webhook e idempotencia del token invitado.
- `supabase/tests/dti-commerce.integration.sql`: ejecutado y aprobado en PostgreSQL 17.10 temporal. Se aplicó toda la migración y se verificaron RLS/Storage privado, totales, reintentos de pedido, presupuesto aprobado, webhook repetido/reintentado, discrepancia de importe, bloqueo hasta revisión técnica, liberación a producción y confirmación de plazos largos.
- `npm run lint`: aprobado.
- `npm run build`: aprobado (TypeScript y Vite).
- `git diff --check`: aprobado, con aviso de normalización LF/CRLF en `src/pages/DTFPage.tsx`.

La prueba SQL usó un Postgres desechable con stubs mínimos para `auth.users` y `storage.buckets`; no sustituye Supabase Auth, Storage ni Edge Runtime. Docker, Deno y Supabase CLI local no están disponibles, y no hay un proyecto QA de Ridaos. No se desplegó ni se aplicó ninguna migración remota. No se probaron pagos, webhooks, carga a Storage ni Apple Pay en un entorno de servicio. La comprobación en navegador local se interrumpió al pulsarse Escape; el checkout visible sigue simulado.

## Restricciones y pendientes de servicio

- La organización Supabase disponible contiene proyectos CostaClean, incluido uno QA con esquema CostaClean. No es un backend DTI de Ridaos y no se ha conectado ni modificado.
- Vercel tiene un proyecto `ridaos`, pero no hay variables de Preview configuradas y las funciones actuales de Vercel no sustituyen el backend Supabase aislado.
- No se encontraron credenciales autorizadas de Stripe Test Mode ni un conector Stripe. No se creó infraestructura ni se llamó a Stripe.
- El dominio `dti.ridaosprint.com` aún no está disponible/verificado para Apple Pay. No se modificó DNS.
- Falta provisionar/autorizar un proyecto QA dedicado de Ridaos, aplicar la migración allí, desplegar las funciones y secretos de prueba y conectar la UI a estos endpoints. Hasta entonces el checkout sigue siendo simulado.
- Las comprobaciones de PNG/PDF no son análisis antivirus ni certificación completa de preimpresión. PNG entrelazados, PDF grandes o sospechosos y AI/PSD/SVG/CDR requieren revisión profesional. La aceptación del cliente no aprueba producción.
- Las fechas de despacho omiten festivos nacionales, catalanes y locales. Antes de presentar una fecha estimada como compromiso, QA necesita un calendario laboral aprobado.
- ESLint y pruebas Node no sustituyen `deno check` ni un entorno Supabase real. El clúster temporal sí ejecutó las funciones PL/pgSQL, pero falta validar las Edge Functions y las rutas de Storage con el runtime y servicios Supabase.

Las reglas comerciales aplicadas en frontend y funciones son 15 €/m IVA incluido, mínimo 1 m, ancho útil de 55 cm, envío peninsular 5 € IVA incluido, recogida en Carrer d'Aragó 423, Barcelona, corte 18:30 Europe/Madrid y preparación de 48 horas laborables hasta 5 m / 3 días laborables para más de 5 hasta 10 m. Por encima de 10 m se requiere confirmación de plazo. El transporte es adicional al plazo de preparación. La adaptación se calcula a 35 €/h más IVA y requiere presupuesto aprobado antes del pago.
