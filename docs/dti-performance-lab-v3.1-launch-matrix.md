# RIDAOS DTI Performance Lab V3.1 — matriz de lanzamiento

Fecha de revisión: 27 de noviembre de 2026

Rama local: `feat/dti-performance-lab-v1-6`

HEAD de partida: `9437851ea9724e30b36d02d463f0b953940cf450`

Entorno de aplicación observado: Preview protegida de Vercel, despliegue anterior al diff local.
Entorno Supabase: solo QA Ridaos DTI (`uzldkpnenmfjfwqfkhre`) según evidencia previa V2.5.

## Matriz

| Estado | Área | Evidencia y alcance |
|---|---|---|
| PASS | Reglas comerciales DTI | Tests locales cubren 15 €/m IVA incluido, mínimo 1 m, adaptación 35 €/h + IVA, tramos de preparación, corte 18:30 Europe/Madrid y envío peninsular de 5 €. Evidencia anterior QA en `dti-performance-lab-v2.5-launch-matrix.md`; no se repitieron pruebas backend superadas. |
| PASS | Supabase QA y Stripe TEST | Según matriz V2.5, PaymentIntent TEST de 20,00 € confirmado por webhook firmado; RPC/migraciones y flujo backend verificados allí. Sin nuevos pagos ni cambios externos en esta revisión. |
| PASS | Responsive por emulación | Preview inspeccionada en 360×800, 390×844, 412×915 y 430×932; sin desbordamiento horizontal observado en landing, producto y seguimiento. No es prueba física ni cubre todas las rutas. |
| PASS | GSAP por inspección | `scrollMotion.ts` usa `matchMedia`, respeta `prefers-reduced-motion` y revierte contexto. No se obtuvo medición de Lighthouse/Core Web Vitals. |
| PASS | Consola durante recorrido anterior | 0 errores/avisos visibles durante las interacciones inspeccionadas. La Preview utilizada no contiene las correcciones locales actuales. |
| PASS | Verificación local actual | 51/51 pruebas; `npm run lint` sin errores/avisos; `npm run build` correcto; `git diff --check` limpio. |
| PASS | Seguimiento DTI en código local | `useDtiGuestOrder` reutiliza `dti-orders` GET con el token de invitado ya guardado en `sessionStorage`; Mis pedidos y Detalle muestran estado remoto para ese pedido y mantienen separados los registros demo locales. El endpoint responde `currency`, `status`, `paymentStatus`, `trackingReference`, `estimatedDispatchDate` y `latestArtwork`. Build verificado; falta ejercicio en Preview con una sesión QA válida. |
| FAIL corregido localmente | CTA de landing | «Configurar mi rollo» apuntaba a `#dti-configurator`, que no es una ruta reconocida. Ahora desplaza al configurador manteniendo la ruta SPA, gestiona foco y respeta movimiento reducido. Pendiente revalidar en Preview nueva. |
| FAIL corregido localmente | Carrito vacío | La Preview observada aún mostraba envío 6,90 €, IVA 1,45 € y total 8,35 € con cero productos. El código local elimina importes y opciones de envío/cupón sin líneas. No está desplegado, por lo que el defecto persiste en la Preview observada. |
| FAIL corregido localmente | Checkout | Código local bloquea avanzar sin nombre, teléfono, email válido y dirección peninsular completa; los campos muestran errores accesibles. La validación pura tiene tests. No se creó ni envió ningún pedido en esta revisión. |
| FAIL corregido localmente | Aviso de demo | Los pedidos del store local y su detalle ahora identifican claramente que son datos de demostración y no operaciones reales. Validar la apariencia final en Preview. |
| FAIL corregido localmente | Modal de prepress | El diálogo deja de ocultar el contenido con `aria-hidden`, mantiene Tab dentro, enfoca el diálogo y devuelve el foco al elemento anterior. Pendiente revisión manual con lector de pantalla/teclado. |
| BLOCKED | Preview de las correcciones | El deployment observado corresponde a SHA `9437851ea9724e30b36d02d463f0b953940cf450` y muestra el carrito vacío con 8,35 €. Los cambios actuales no están publicados. Se requiere autorización específica para commit/push a la rama y generación de una nueva Preview QA protegida. |
| BLOCKED | Validación Safari/iPhone y Apple Pay | No hay prueba física disponible. Para Apple Pay hacen falta dispositivo compatible, Apple Wallet preparado para pruebas, Stripe TEST, HTTPS y dominio de pago registrado/verificado en Stripe; no hay certificación Apple Pay de esta revisión. No se registró dominio ni se modificó DNS. |
| BLOCKED | Seguimiento e historial entre sesiones | El acceso DTI de invitado está ligado a `sessionStorage` en el mismo navegador; no recupera pedidos desde otro dispositivo o sesión cerrada. Hace falta definir un mecanismo de recuperación autenticado antes del lanzamiento público. |
| BLOCKED | Rendimiento medido | Build correcto y chunks registrados; no hay Lighthouse, Web Vitals reales ni pruebas de red/dispositivo físico. No declarar rendimiento certificado. |
| BLOCKED | Paso QA → Production | No ejecutar hasta desplegar/certificar la Preview, validar seguimiento real, completar revisión de accesibilidad/rendimiento, prueba física de Safari/Apple Pay y revisar configuración/secretos y migraciones del entorno destino. No se hicieron cambios de Production. |

## Alcance preservado

No se modificaron `main`, Production, DNS, Stripe Live, permisos administrativos, ni proveedor de correo. No se creó un pedido ni un cobro. La Preview observada conserva el e-commerce completo, pero aún no contiene este diff local; DTI Only en QA se considera verificado solo por la evidencia anterior V2.5, no por una nueva consulta a QA en esta revisión.

## Siguiente paso

Autorizar explícitamente la publicación de los cambios actuales a `feat/dti-performance-lab-v1-6` para crear una Preview QA protegida y repetir el recorrido visual. Después, validar en un iPhone real Safari y Apple Pay con Stripe TEST, y decidir el mecanismo de seguimiento que permita recuperar pedidos fuera de la sesión actual.
