# RIDAOS DTI Performance Lab V1.7

## Estado de esta rama

El configurador y el checkout visibles siguen en modo local/mock. No crean pedidos reales ni muestran una confirmación de pago real. La landing conserva la experiencia Dark Garage Luxury, Liquid Glass, GSAP y mobile-first. Los metadatos globales del sitio no se fuerzan a DTI; el SEO de DTI/DTF se define en la ruta de producto.

La rama contiene una base de backend aislada para revisión local:

- `supabase/migrations/20261124112802_dti_innuro_ecommerce_v1.sql` define pedidos, presupuestos, versiones de archivo, revisiones técnicas, permisos staff, intentos de pago, eventos idempotentes, RLS sin acceso directo a `anon`/`authenticated` y el bucket privado `dti-artwork`.
- `supabase/functions/dti-orders` calcula el pedido en servidor y admite reintento con clave idempotente y token de acceso de invitado.
- `supabase/functions/dti-artwork` recibe el archivo, limita formatos/tamaño, comprueba estructura básica de PNG/PDF, guarda una versión en el bucket privado y deriva formatos de diseño o archivos sospechosos a revisión profesional.
- `supabase/functions/dti-accept-artwork` registra aceptación del cliente separada de revisión profesional.
- `supabase/functions/dti-payment-intent` solo inicia pago si recibe una clave `sk_test_` y el arte tiene aceptación/validación y, si procede, aprobación profesional y presupuesto de adaptación aprobado. Activa métodos automáticos de Stripe; Apple Pay depende de Stripe y de la verificación del dominio.
- `supabase/functions/stripe-webhook` valida la firma Stripe con tolerancia temporal; la función SQL deduplica eventos, compara importes y deja pedidos pagados en `paid_awaiting_technical_review`.

Los handlers están preparados para desplegarse en un proyecto QA dedicado de Ridaos con `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DTI_GUEST_TOKEN_SECRET`, `DTI_ALLOWED_ORIGIN`, `STRIPE_SECRET_KEY` de test y `STRIPE_WEBHOOK_SECRET` de test. Las claves privadas solo se usan en servidor. El webhook requiere una URL HTTPS registrada en Stripe Test Mode.

## Verificación hecha

- `npm ci --ignore-scripts --no-audit --no-fund`: completado; instaló 158 paquetes. Los scripts de instalación se omitieron deliberadamente.
- `npm run test`: 15 pruebas unitarias aprobadas. Cubren precios, límites de metraje, IVA, tiempos, hora de corte, carrito mixto, validaciones de archivos, firmas de webhook e idempotencia del token invitado.
- `npm run lint`: aprobado.
- `npm run build`: aprobado (TypeScript y Vite).
- `git diff --check`: aprobado, con aviso de normalización LF/CRLF en `src/pages/DTFPage.tsx`.

No se ejecutaron pruebas de integración contra Postgres/Supabase ni E2E. Docker y Supabase CLI local no están disponibles en el entorno, y no existe un proyecto Supabase QA identificado como Ridaos. No se aplicó la migración ni se desplegaron funciones. No se probaron pagos, webhooks, carga a storage ni Apple Pay en un entorno remoto.

## Restricciones y pendientes de servicio

- La organización Supabase disponible contiene proyectos CostaClean, incluido uno QA con esquema CostaClean. No es un backend DTI de Ridaos y no se ha conectado ni modificado.
- Vercel tiene un proyecto `ridaos`, pero no hay variables de Preview configuradas y las funciones actuales de Vercel no sustituyen el backend Supabase aislado.
- No se encontraron credenciales autorizadas de Stripe Test Mode ni un conector Stripe. No se creó infraestructura ni se llamó a Stripe.
- El dominio `dti.ridaosprint.com` aún no está disponible/verificado para Apple Pay. No se modificó DNS.
- Falta provisionar/autorizar un proyecto QA dedicado de Ridaos, aplicar la migración allí, desplegar las funciones y secretos de prueba, terminar el flujo de presupuestos/revisión profesional en operaciones y conectar la UI a estos endpoints. Hasta entonces el checkout sigue siendo simulado.
- Las comprobaciones de PNG/PDF son validaciones estructurales iniciales, no análisis antivirus ni certificación de preimpresión. Los formatos AI/PSD/SVG/CDR y los PDF grandes o con marcadores activos requieren revisión profesional. La aceptación del cliente no aprueba producción.

Las reglas comerciales aplicadas en frontend y funciones son 15 €/m IVA incluido, mínimo 1 m, ancho útil de 55 cm, envío peninsular 5 € IVA incluido, recogida en Carrer d'Aragó 423, Barcelona, corte 18:30 Europe/Madrid y preparación de 48 horas laborables hasta 5 m / 3 días laborables para más de 5 hasta 10 m. Por encima de 10 m se requiere confirmación de plazo. El transporte es adicional al plazo de preparación. La adaptación se calcula a 35 €/h más IVA y requiere presupuesto aprobado antes del pago.
