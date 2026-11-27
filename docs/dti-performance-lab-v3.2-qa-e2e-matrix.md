# RIDAOS DTI Performance Lab V3.2 — cierre E2E de Preview QA

Fecha: 27 de noviembre de 2026
Rama: `feat/dti-performance-lab-v1-6`
HEAD de Preview: `7c8aed98ffd22141fa2886f1308d93b521942edd`
Preview protegida: `https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app`
Supabase: QA `uzldkpnenmfjfwqfkhre` (Ridaos DTI QA)

## Matriz de verificación

| Estado | Área | Evidencia y alcance |
|---|---|---|
| PASS | Rama y Preview | La rama de trabajo es `feat/dti-performance-lab-v1-6`; HEAD y `FETCH_HEAD` coinciden en `7c8aed98`. Vercel confirma deployment `dpl_z43p7svHA95EUaUhwtFXf8WLA9hb` en estado READY, SHA `7c8aed98ffd22141fa2886f1308d93b521942edd`, y el alias estable asignado a ese deployment. |
| PASS | DTI Only | Consulta directa a `public.ridaos_publication_flags`: `dti_only_mode=true`; `published_product_codes=["dti-innuro"]`. |
| PASS | CORS de QA | Antes del cambio, el preflight del origen estable devolvía 403. Se añadió el hostname exacto, sin comodines, de forma condicional solo cuando `SUPABASE_URL` pertenece a `uzldkpnenmfjfwqfkhre`. `dti-orders` v9, `dti-artwork` v8 y `dti-accept-artwork` v8 responden preflight 200 con el origen exacto; un origen no autorizado continúa en 403. Se conservaron los valores de `DTI_ALLOWED_ORIGIN` existentes. |
| PASS | Checkout sintético aislado | Checkout normal desde `http://localhost:5173`, con `.env.local` apuntando a QA y almacenamiento de origen separado; una línea DTI de 1 m, envío peninsular, contacto/dirección ficticios y PNG sintético. El carrito previo del alias Preview se inspeccionó y se dejó intacto. Pedido del flujo UI: `a8398a1d-9b5d-4772-bb35-0356c3e3f49a`; total 2.000 céntimos. |
| PASS | Archivo privado | El configurador cargó `ridaos-dti-qa-e2e-synthetic.png`; checkout mostró la recepción y estado “passed”. Supabase confirma versión PNG 1, validación `passed`, un objeto del pedido en `dti-artwork` y `storage.buckets.public=false`. |
| PASS | Mis pedidos / Detalle | Con el token de invitado establecido por el checkout normal, “Mis pedidos” mostró “Seguimiento DTI conectado” y el ID real; “Detalle” y “Actualizar estado” consultaron el pedido y mostraron el archivo `passed`. La UI separó este pedido de los registros demo y explicó que el acceso vive en la sesión actual. Flujo validado en la app local de la rama, con la misma revisión del código que el Preview READY. |
| PASS | Token de invitado y denegación | La sesión UI de invitado accedió correctamente al pedido real. Además, el GET QA con token aleatorio para el pedido sintético de API `81c0a889-b95b-4cca-8bcc-538474e67c35` devolvió 403. El token válido no se imprimió ni se guardó en este documento. |
| PASS | No hubo pago | No se llamó a `dti-payment-intent`, Stripe ni webhook. La fila del pedido mantiene `payment_status=not_ready`. No se enviaron correos. |
| PASS | Interfaz Preview y datos demo | La Preview protegida muestra la landing DTI y su alias apunta al SHA verificado. En el navegador Preview se detectó el carrito anterior con su archivo adjunto y se conservó sin alterarlo. Los registros de ejemplo en Mis pedidos siguen etiquetados como demostraciones; el pedido real se verificó en una sesión QA local aislada. |
| PASS | Regresión de React | La comprobación local detectó `Maximum update depth exceeded` al cargar el archivo: `DTFPage` recreaba callbacks y objetos de contexto/resumen, y `ArtworkUploadFlow` volvía a notificar al padre en cada render. Se estabilizaron esos valores con `useCallback`/`useMemo`. Tras el cambio, se recargó el pedido existente y se repitió la prevalidación del PNG: 0 errores de consola; no se creó un pedido adicional. |
| PASS | Tests locales | 54/54 pruebas, lint y build pasan; `git diff --check` pasa tras incorporar la corrección CORS. |
| BLOCKED | Safari/iPhone físico | Solo hay evidencia previa de emulación responsive; falta dispositivo físico y Safari real. |
| BLOCKED | Rendimiento medido | No hay mediciones Lighthouse/Core Web Vitals sobre dispositivo y red físicos. |

## Cambios y aislamiento

Los cambios locales incluyen la allowlist exacta de Preview para `dti-orders`, `dti-artwork` y `dti-accept-artwork`, condicionada al `SUPABASE_URL` del proyecto QA, y la estabilización de callbacks/contexto del configurador para evitar el bucle React. No se usan comodines. Los cambios locales están sin commit. Las versiones Edge Function desplegadas pertenecen solo a Supabase QA. Se generó un pedido sintético por API y otro por la ruta normal del navegador; ambos se mantienen en QA para inspección y no deben confundirse con operaciones de cliente.

No se modificaron `main`, Production, DNS, Stripe Live, permisos Auth ni servicios externos de pago. El pedido y el PNG son datos de prueba sintéticos en QA; no representan una venta real. No se inició ningún cobro.

## Próximos pasos

1. Limpiar los dos pedidos y archivos QA sintéticos cuando deje de ser necesaria la evidencia; se conservan por ahora para inspección.
2. Probar Safari en iPhone y medir rendimiento real antes de considerar lanzamiento.
