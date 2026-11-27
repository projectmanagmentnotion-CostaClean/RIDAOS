# RIDAOS DTI Performance Lab V3.1 — matriz QA

Fecha: 27 de noviembre de 2026
Rama: `feat/dti-performance-lab-v1-6`
Código funcional validado en: `28fc8255927ceb58429185f076d3871638b8da2e`
Preview protegida: `https://ridaos-git-f-2c0516-projectmanagmentnotion-costacleans-projects.vercel.app`
Deployment observado: `dpl_14rA7qppwCodzvouyANmmqjh2Ffy`, READY, con SHA exacto. El alias de rama se reasignó tras verificar que apuntaba a una versión anterior.

## Matriz

| Estado | Área | Evidencia y alcance |
|---|---|---|
| PASS | Build y checks | 52/52 pruebas, lint sin avisos, build correcto y `git diff --check` limpio tras las correcciones de código. |
| PASS | Carrito vacío | En Preview, productos, envío, IVA y total muestran `0,00 €`; no hay envío/cupón seleccionable sin líneas. |
| PASS | Precio y entrega | 1 m DTI: 15,00 € IVA incluido; envío peninsular: 5,00 €; total 20,00 € e IVA mostrado 3,47 €. Preparación 48 h laborables; transporte adicional. |
| PASS | Landing/configurador | Se inspeccionaron landing, CTA, metraje, ancho útil 55 cm, tramos de preparación, corte 18:30 Europe/Madrid y criterios de archivo. Preflight aceptó un PNG sintético en cliente. |
| PASS | Checkout | Valida datos obligatorios. La aceptación del arte se requiere al enviar el pedido, no al pasar entre pasos; botón final bloqueado hasta marcarla. Texto comercial indica IVA incluido, revisión técnica y aprobación de presupuesto antes del pago. No se inició pago. |
| PASS | Mis pedidos / Detalle | Datos locales identificados como demostración; el código consulta el pedido DTI invitado mediante `dti-orders` y el token de sesión. |
| PASS | Protección | Vercel SSO habilitado para dominios no personalizados; Preview `.vercel.app` protegida. |
| PASS | Responsive | Emulación 360×800, 390×844, 412×915 y 430×932: landing, configurador, carrito y checkout sin desbordamiento horizontal. No equivale a prueba física. |
| PASS | GSAP | `scrollMotion.ts` respeta `prefers-reduced-motion`, usa `matchMedia` y revierte contexto. No se midieron Web Vitals. |
| BLOCKED | Pedido, subida y seguimiento remoto end-to-end | El primer envío desde hostname único falló en `fetch` por CORS antes de crear pedido. Se reasignó el alias estable al deployment actual y se comprobó que muestra el código correcto. No se volvió a enviar formulario usando el carrito QA preexistente del navegador; falta repetir con carrito sintético aislado y verificar autorización de origen en Supabase QA. |
| BLOCKED | Safari/iPhone físico | Solo se hizo emulación de viewport; falta dispositivo físico. Apple Pay no se probó. |
| BLOCKED | Recuperación entre sesiones | El token de pedido invitado permanece en `sessionStorage`; no permite recuperar desde otro dispositivo o sesión cerrada. |
| BLOCKED | Rendimiento medido | No hay medición Lighthouse, Web Vitals reales ni red/dispositivo físico. |

## Alcance preservado

Se publicó solo la rama Preview autorizada, mediante push fast-forward. No se modificaron `main`, Production, DNS, Stripe Live, permisos administrativos ni proveedores de correo. No se creó pedido ni cobro. El entorno Supabase inspeccionado pertenece a QA `uzldkpnenmfjfwqfkhre`; DTI Only no se reconsultó en esta revisión y se conserva la evidencia anterior V2.5.

## Siguientes pasos

Repetir el flujo de subida, alta y seguimiento con carrito sintético aislado, confirmando antes que la allowlist CORS de Supabase QA incluye el alias HTTPS estable. Completar pruebas físicas de iPhone/Safari y medir Lighthouse/Core Web Vitals antes de considerar lanzamiento.
