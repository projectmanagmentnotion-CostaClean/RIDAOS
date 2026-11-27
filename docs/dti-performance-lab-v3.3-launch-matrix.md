# RIDAOS DTI Performance Lab V3.3 — matriz final de Preview QA

Fecha: 27 de noviembre de 2026  
Rama: `feat/dti-performance-lab-v1-6`  
SHA de aplicación probado por Lighthouse: `3fc5635b38618a41ed6e1b96b47d7bf71a0f12b3`

SHA probado por E2E desde la Preview: `3fa77618da0101a7c284c5e46a58831bb7554ccc`

Preview protegida: `https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app`

Supabase autorizado: QA `uzldkpnenmfjfwqfkhre` (Ridaos DTI QA)

## Matriz

| Estado | Área | Evidencia y alcance |
|---|---|---|
| PASS | Rama y publicación Preview | Los commits V3.2 `3fc5635b38618a41ed6e1b96b47d7bf71a0f12b3` y V3.3 E2E `3fa77618da0101a7c284c5e46a58831bb7554ccc` están publicados mediante fast-forward solo en la rama autorizada. Vercel confirmó ambos deployments READY con el SHA correspondiente; el alias estable apunta al Preview de V3.3. Este commit de matriz cambia documentación solamente y tendrá su propio SHA/deployment que se confirmará al terminar. |
| PASS | Landing y configurador | La Preview protegida carga landing cinematográfica DTI, producto, configuración de 1 m, recogida/envío, carga de archivo, resumen de 20,00 € con IVA incluido, preparación de 48 horas laborables y reglas de archivos. Se validaron en la UI el ancho útil de 55 cm, envío peninsular 5 €, recogida en Carrer d'Aragó 423, corte 18:30 Europe/Madrid, plazos por metraje, adaptación de 35 €/h + IVA sujeta a presupuesto aprobado, y lenguaje SEO DTF frente a producto DTI. |
| PASS | DTI Only | Consulta directa actual a Supabase QA `uzldkpnenmfjfwqfkhre`: `dti_only_mode=true` y `published_product_codes=["dti-innuro"]`. La publicación no se modificó y el resto del e-commerce se conserva en el código. |
| PASS | CORS QA | `dti-orders`, `dti-artwork` y `dti-accept-artwork` aceptan únicamente el origen estable exacto cuando `SUPABASE_URL` corresponde al proyecto QA; orígenes no autorizados continúan rechazados. Sin comodines. Evidencia de preflight en V3.2; no se desplegaron funciones durante V3.3. |
| PASS | Calidad del cambio y privacidad | Commit V3.2 contiene CORS exacto QA, pruebas, documentación y estabilización de callbacks/contexto React. No se hallaron secretos ni datos personales en los archivos cambiados; la cadena de email en la prueba CORS es un origen sintético deliberadamente malformado. `.env.local` y `.vercel` permanecen ignorados y no se incluyen en Git. |
| PASS (laboratorio) | Lighthouse móvil | Chrome/Lighthouse 13.6.0 sobre Preview protegida de código SHA `3fc5635b38618a41ed6e1b96b47d7bf71a0f12b3`, emulación móvil: Performance 86, Accessibility 91, Best Practices 96, SEO 91; FCP 2.837 ms, LCP 2.837 ms, CLS 0, TBT 177 ms, Speed Index 4.291 ms. |
| PASS (laboratorio) | Lighthouse escritorio | Sobre el mismo SHA: Performance 97, Accessibility 91, Best Practices 96, SEO 91; FCP 782 ms, LCP 782 ms, CLS 0, TBT 0 ms, Speed Index 1.541 ms. |
| PASS | E2E desde Preview protegida | Checkout de 1 m, envío peninsular (15 € producto + 5 € envío = 20 €), datos ficticios con correo `.invalid`, PNG sintético, aceptación del cliente y solicitud de adaptación. Pedido QA `58cc6e58-c7c5-4b6a-9c07-2d97399dfc5e`. Se ejecutaron `dti-orders`, `dti-artwork` y `dti-accept-artwork` desde la Preview de SHA `3fa77618da0101a7c284c5e46a58831bb7554ccc`. Supabase confirma estado `awaiting_artwork`, `payment_status=not_ready`, PNG `passed`/aceptado, un objeto en bucket privado `dti-artwork` y 0 intentos de pago. La adaptación quedó solicitada, sin presupuesto emitido ni aprobado (`adaptation_quote_status=null`); se mantuvo así para evitar permisos administrativos y pagos. El navegador registró 0 llamadas a `dti-payment-intent`, 0 solicitudes a Stripe y 0 a correo. Datos sintéticos retenidos en QA para inspección. |
| BLOCKED | Safari/iPhone físico y Apple Pay | No se dispone de Safari/iPhone físico en esta sesión. Lighthouse no confirma WebKit, comportamiento táctil real, Core Web Vitals de usuarios ni elegibilidad/visibilidad de Apple Pay. |
| NOT MEASURED | Core Web Vitals reales (RUM) | No se obtuvieron datos de campo de CrUX ni de Vercel Speed Insights para esta Preview. Lighthouse aporta métricas de laboratorio; FCP/LCP/CLS de esta sección no son mediciones reales de usuarios. Lighthouse de navegación tampoco mide INP real. |

## Plan físico Safari/iPhone

1. Registrar modelo de iPhone, versión iOS/Safari, tamaño de viewport, conexión y hora. Abrir la Preview protegida y confirmar que la autenticación Vercel devuelve a la misma ruta.
2. Probar navegación, hero y configurador en vertical y horizontal; revisar overflow, tipografía, contraste, safe areas, scroll, overlays Liquid Glass, objetivos táctiles y retorno al inicio.
3. Cambiar metros con controles táctiles: 1, 5, 6, 10 y 11 m. Verificar 48 h laborables, 3 días y plazo bajo consulta; comprobar corte 18:30 Europe/Madrid y que el transporte se añade al tiempo de preparación.
4. Seleccionar recogida BCN y envío peninsular; comprobar dirección, precio, IVA incluido y totales. Probar teclado iOS en notas y campos de cliente sin ocultar CTA ni resumen.
5. Abrir selector de archivos iOS y cargar PNG y PDF sintéticos QA; verificar previsualización, validación inicial, aceptación de referencia y recuperación ante cancelar, cambiar de archivo, volver atrás, refrescar o interrumpir red. Confirmar que AI/PSD/SVG/CDR siguen en revisión manual.
6. Activar adaptación y revisar texto 35 €/h + IVA, presupuesto previo aprobado y bloqueo de cobro hasta aprobación.
7. Probar VoiceOver, foco/orden de lectura, zoom de texto, movimiento reducido, contraste, orientación y estados de error/conexión lenta.
8. Solo en QA, comprobar si Apple Pay aparece con dispositivo compatible, Wallet configurado, navegador elegible y Stripe en modo test. Verificar elegibilidad del dominio de prueba según la configuración de Stripe; no completar ni confirmar ningún pago. Registrar «no disponible» si el entorno Preview o el dispositivo no ofrece Apple Pay; nunca inferir disponibilidad de la prueba de laboratorio.
9. Si se repite el E2E, usar datos y archivo sintéticos, comprobar en QA `payment_status=not_ready`, cero intentos de pago y cero solicitudes a proveedores; conservar cualquier nueva fila/blob hasta tener autorización explícita para eliminarla.

## Aislamiento y siguientes pasos

No se modificaron `main`, Production, DNS, Stripe Live, permisos administrativos ni proveedores de correo. No se llamó a Stripe ni se enviaron correos. Se creó un pedido y PNG exclusivamente sintéticos en Supabase QA para el E2E; se conservaron para inspección. La rama conserva el e-commerce completo; DTI Only está activo en QA.

Antes de considerar lanzamiento: completar Safari/iPhone y la comprobación física de Apple Pay; habilitar/consultar RUM para medir Core Web Vitals reales; y confirmar el SHA/estado del deployment documental que incluye esta matriz. Un presupuesto de adaptación aún requiere revisión y aprobación por personal autorizado antes de cualquier pago.
