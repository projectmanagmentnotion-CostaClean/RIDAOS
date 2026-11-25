# DTI Performance Lab V2.1 — estado de certificación

Fecha: 2026-11-25  
Rama: `feat/dti-performance-lab-v1-6`  
Entorno de pagos: Stripe TEST / Supabase QA

## Integración revisada

- Se reutiliza la integración existente de Payment Element, creación de PaymentIntent y Edge Function `stripe-webhook`.
- La función de pago solo acepta una clave `sk_test_`, calcula el importe a partir del pedido en servidor y crea el PaymentIntent en EUR con clave de idempotencia.
- El webhook valida firma HMAC y antigüedad, rechaza eventos live y entrega la conciliación a una función SQL que comprueba PaymentIntent, pedido, importe y moneda. Los eventos duplicados se reconocen idempotentemente; eventos que no concuerdan permanecen reintentables.
- Destino TEST preparado: `https://uzldkpnenmfjfwqfkhre.supabase.co/functions/v1/stripe-webhook`.
- Eventos suscritos y consumidos por el handler: `payment_intent.canceled`, `payment_intent.payment_failed`, `payment_intent.processing`, `payment_intent.requires_action` y `payment_intent.succeeded`. Los nombres se contrastaron con el catálogo/API oficial de Stripe.
- El endpoint está activo en Stripe Test. Hasta introducir las claves no hay entregas registradas.

## Evidencia disponible

- `npm test`: 21/21 pruebas pasan.
- Prueba SQL de integración ejecutada en Supabase QA: duplicado, importe incorrecto, reintento, transición tardía y aislamiento entre pedidos. La transacción terminó con rollback; se verificó que no quedaban filas de fixture.
- Preview inspeccionado en Chrome: configurador de 1 m con recogida suma 15 €; 2 m con envío peninsular suma 35 € (30 € producto + 5 € envío). La interfaz aclara que el flujo actual es local y no crea pedido/cobro real.
- Se corrigieron en la landing el precio obsoleto de 14,50 €, el titular DTF presentado como producto y los mensajes heredados de IVA/anticipo.

## Pendiente para certificar compra TEST

Stripe Test tiene que proporcionar `sk_test_…` y el `whsec_…` del endpoint; se guardarán directamente en Edge Function Secrets de Supabase QA. La clave `pk_test_…` se guardará directamente como variable Preview de esta rama en Vercel. Los valores nunca se copian a chat, terminal ni este documento. Los formularios protegidos están preparados; no se han guardado valores.

Después de guardar las claves falta ejecutar desde Preview una compra sintética de extremo a extremo y verificar el pedido, PaymentIntent, entrega firmada y estado pagado; probar rechazo con tarjeta de test y reenvío del webhook duplicado. El importe manipulado, reintento e aislamiento se cubrieron por el handler/prueba SQL, pero no mediante entrega HTTP desde Stripe.

## Limitaciones

- `npm run lint` y `npm run build` no están certificados en este checkout: faltan ejecutables de desarrollo en `node_modules` y la instalación local con npm falla con `Exit handler never called!`. No se modifica el lockfile para forzar una resolución distinta.
- Apple Pay no está certificado. No se hizo una compra real con un navegador/dispositivo compatible; tampoco se modificó DNS ni se registró el dominio previsto `dti.ridaosprint.com` en Stripe. La disponibilidad requiere completar el registro del dominio en el entorno correspondiente.
- La inspección E2E de navegador se hizo en Chrome de escritorio, no en Safari de iPhone. Comportamiento de wallet, Safari y compra real en móvil permanece sin verificar.
- No se usaron claves live ni se tocó Production, `main`, DNS o despliegues Production.
