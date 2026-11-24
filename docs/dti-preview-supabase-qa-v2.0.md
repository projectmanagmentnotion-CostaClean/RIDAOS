# RIDAOS DTI V2.0 — Preview a Supabase QA

Fecha de verificación: 24 de noviembre de 2026  
Rama: `feat/dti-performance-lab-v1-6`  
Supabase objetivo: `Ridaos DTI QA` (`uzldkpnenmfjfwqfkhre`)  
Preview verificada: `https://ridaos-nyx2ke2te-projectmanagmentnotion-costacleans-projects.vercel.app`

## Allowlist y CORS

Se configuró `DTI_ALLOWED_ORIGIN` solo en los Edge Function Secrets de QA con estos orígenes exactos:

- `http://localhost:5173`
- `https://ridaos-nyx2ke2te-projectmanagmentnotion-costacleans-projects.vercel.app`
- `https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app` (alias de la rama confirmado por Vercel)

No hay wildcard ni regla para todos los hostnames de Vercel. El helper compara el `Origin` exacto, añade `Vary: Origin` y no devuelve `Access-Control-Allow-Origin` para valores ajenos. Las seis funciones de navegador responden `200` al preflight permitido y `403` al origen externo; el encabezado coincide con el origen solicitado. Un GET real devolvió ACAO exacto para Preview y lo omitió para el origen externo. Verificación HTTPS directa a QA con cabeceras `Origin` de los casos; el flujo de pedidos usa las funciones desplegadas, el proyecto QA y la clave publishable del entorno local.

Funciones de navegador actualizadas: `dti-orders` v4, `dti-artwork` v4, `dti-accept-artwork` v4, `dti-adaptation-quotes` v4, `dti-payment-intent` v4 y `dti-staff-operations` v5. El webhook `stripe-webhook` no requiere CORS: OPTIONS devuelve `405` sin cabecera ACAO y no se envió ningún evento Stripe.

## Flujo sintético QA

Todas las llamadas usaron HTTPS al proyecto indicado y el `Origin` exacto de la Preview. No se llamó a Stripe ni se inició un intento de pago.

- Pedido invitado A: `0871da48-564d-4e7d-b6cb-2cc38a12ed5b`, creado `201`.
- Subida de PNG sintético: `201`, validación `passed`, versión `05c60b59-3b02-4080-9b49-e76c3b30d1e1`.
- Storage: bucket `dti-artwork`, `public=false`, blob existente durante la prueba; validación y aceptación del cliente confirmadas en la fila de versión.
- Descarga anónima del objeto privado: `400` (no legible públicamente).
- Aceptación del archivo: `200`; lectura propia del pedido: `200`.
- Pedido invitado B: `53c65660-f82f-4079-95c2-ba1aeefaf2bf`; su token al leer el pedido A recibió `403`.

Objeto PNG sintético:
`0871da48-564d-4e7d-b6cb-2cc38a12ed5b/edb5dc8e-f175-4a3c-859b-415b1ed3206b/qa-pixel.png`

Limpieza completada en QA tras confirmación explícita: se purgó el PNG recién cargado; se borraron los dos pedidos creados en esta prueba y sus filas dependientes. El pedido y el blob de la prueba anterior ya estaban ausentes al inspeccionar QA. Una consulta final confirmó cero filas para los tres IDs y cero objetos para las dos rutas.

## Verificación local

En una copia aislada en `%TEMP%` (sin `.env`):

- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm test`: 21/21 pruebas correctas, incluidas las nuevas pruebas de allowlist CORS.
- `git diff --check`: correcto.

## Stripe

`dti-payment-intent` está desplegada en QA pero no se invocó. El siguiente paso es configurar, solo en QA/Preview, `STRIPE_SECRET_KEY` con una clave `sk_test_`, `STRIPE_WEBHOOK_SECRET` con el secreto `whsec_` del endpoint QA y `VITE_DTI_STRIPE_PUBLISHABLE_KEY` con `pk_test_`. Mantener esos valores fuera del frontend salvo la publishable key y no ejecutar pagos hasta terminar una verificación explícita del modo test.
