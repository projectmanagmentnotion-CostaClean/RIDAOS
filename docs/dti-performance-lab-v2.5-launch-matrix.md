# RIDAOS DTI Performance Lab V2.5 — matriz de lanzamiento

Estado verificado: 26 de noviembre de 2026
Rama local: `feat/dti-performance-lab-v1-6`
Commit funcional verificado: `27dfb0a466061231b9f754acfecd0d66838c1b83`
Entorno QA: Supabase `uzldkpnenmfjfwqfkhre`; Vercel Preview verificada.

## Matriz

| Estado | Área | Evidencia y alcance |
|---|---|---|
| PASS | DTI Only | `ridaos_publication_flags` en QA tiene `dti_only_mode=true` y `published_product_codes=['dti-innuro']`. Las reglas locales mantienen catálogo, carrito, soporte y rutas privadas según política de publicación. |
| PASS | Seguridad de datos DTI | RLS está activo en las 10 tablas DTI y hay 10 políticas DTI. No se asignaron permisos de personal. |
| PASS | Revisión técnica y aprobación | `dti-commerce.integration.sql` ya pasó en una transacción con rollback: registra aprobación técnica, rechaza liberar sin aprobación y libera el pedido pagado a `queued_for_production`. Evidencia de integración backend; no equivale a una acción del panel con cuenta real. |
| PASS | Producción y calidad | La misma prueba recorre `in_production`, `quality_control`, `rework_required`, reimpresión, control final, preparación y `ready_for_dispatch`; comprueba rechazo de un salto de etapa y persistencia de marcas de tiempo. Ejecución QA con rollback, no se repitió en V2.5. |
| PASS | Despacho | La prueba termina en `dispatched` y valida pedido pagado, marcas de producción/calidad/preparación/despacho y referencia de seguimiento `TEST-RIDAOS-0001`; el flujo de recogida conserva la referencia vacía. Solo datos de prueba revertidos. |
| PASS | Recogida | La prueba de recogida recorre aprobación, producción, calidad, preparación, `ready_for_pickup` y `picked_up`, y verifica `picked_up_at` con seguimiento nulo. Solo datos de prueba revertidos. |
| PASS | Pago de QA | Un PaymentIntent de TEST quedó `succeeded` por 20,00 EUR; el webhook firmado `payment_intent.succeeded` se procesó una vez. No se creó otro pago. |
| PASS | Funciones DTI | QA muestra activas `dti-orders` v7 y `dti-staff-operations` v9. El panel valida identidad Supabase Auth y permisos DTI en servidor; las descargas de arte usan URL firmada de 120 segundos. |
| PASS | Identidad del administrador candidato | La cuenta Google conectada figura como miembro confirmado con rol `OWNER` del equipo Vercel de Ridaos. Esto acredita identidad y propiedad técnica del proyecto, pero no define permisos operativos DTI. |
| PASS | Intenciones transaccionales | La migración local `20261126150000_dti_transactional_notification_outbox.sql` encola una lista permitida de eventos en la misma transacción, deduplica por evento, aplica RLS y deja los registros en `pending`; no almacena el email del cliente en la cola ni marca un envío como real. La prueba focalizada se ejecutó en QA dentro de `BEGIN/ROLLBACK`; luego se comprobó que la tabla no existe y quedaron 0 eventos de prueba. No se persistió la migración en QA. |
| PASS | Verificación local | 31/31 pruebas; build correcto; `git diff --check` limpio. Lint: 0 errores y 1 warning existente en `src/features/artwork-upload/hooks/useArtworkUploadFlow.ts:92`. |
| PASS | Rama feature en GitHub | `feat/dti-performance-lab-v1-6` se actualizó por fast-forward de `f620840` a `27dfb0a`; conserva todo el historial posterior a `f620840`, incluido el commit de cola de avisos. `main` no se modificó. |
| PASS | Preview protegida del panel | Vercel deployment `dpl_DhsaFPahgfM8EETFk5VjYKTPpK44` está `READY`, target Preview, rama `feat/dti-performance-lab-v1-6`, SHA `27dfb0a466061231b9f754acfecd0d66838c1b83`: [abrir Preview](https://ridaos-aix5x0xsu-projectmanagmentnotion-costacleans-projects.vercel.app). La protección SSO del proyecto está habilitada para todos los despliegues que no usen dominios custom; este deployment usa el dominio Vercel generado. El commit funcional verificado contiene `src/admin/components/DtiOperationsWorkspace.tsx` y pasó el build de Vercel. |
| BLOCKED | Acciones del panel sobre pedidos QA | No hay usuario en Auth QA ni filas en `dti_staff_permissions`, por lo que no se pudo iniciar sesión ni ejecutar acciones positivas desde `DtiOperationsWorkspace`. La prueba SQL anterior valida RPC/estados con un usuario sintético dentro de una transacción revertida; no demuestra una sesión de panel ni una acción persistida en QA. |
| BLOCKED | Acceso y rol operativo del administrador | El correo identificado no tiene cuenta en Auth QA. Su rol `OWNER` de Vercel acredita propiedad técnica, no autorización para `review_artwork`, `manage_quotes`, `manage_production` o `manage_payments`. Pendiente confirmar alcance y autorizar la creación/invitación; no se concedió ningún permiso. |
| BLOCKED | Entrega de notificaciones | No hay trabajador de entrega ni transporte de correo autorizado/configurado. El outbox es solo código local y QA no conserva la migración; por tanto, no se envió correo. El SMTP integrado de Supabase Auth limita los envíos a direcciones del equipo, aplica límites y no ofrece garantía de entrega; no es apto para pedidos reales ([documentación](https://supabase.com/docs/guides/auth/auth-smtp)). No se contrató ni configuró un servicio adicional. |

## Intervención necesaria

1. Confirmar qué permisos DTI requiere la cuenta candidata (`review_artwork`, `manage_quotes`, `manage_production`, `manage_payments`) y autorizar su creación/invitación en Auth QA. No enviar contraseñas por chat ni conceder permisos sin el alcance aprobado.
2. Indicar un transporte de correo existente y autorizado para integrar. No enviar secretos por chat; configurar credenciales solo mediante el mecanismo oficial del proveedor/plataforma.

## Alcance preservado

Solo se publicó `feat/dti-performance-lab-v1-6` y su Preview protegida; no se modificaron `main`, Production, Stripe Live, DNS ni otros proyectos. DTI Only continúa activo en QA y el resto del e-commerce sigue presente en la aplicación.
