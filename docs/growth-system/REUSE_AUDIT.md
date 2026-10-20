# Auditoría de reutilización

## Decisión

**KEEP** el repositorio candidato y la arquitectura React + Vite. GitHub confirma `projectmanagmentnotion-CostaClean/RIDAOS`, paquete `ridaosprint-pro`; la rama `main` y producción de Vercel apuntan a `1b21fb68d527fc73b6c15280ac0a7f0c34bcab4e`. El trabajo local parte de ese HEAD en `codex/instagram-growth-system`.

## Matriz

| Área | Decisión | Evidencia / límite |
| --- | --- | --- |
| React + TypeScript + Vite, hash router | KEEP | App activa y rutas consolidadas; el crecimiento añade URLs limpias sin retirar hashes. |
| Catálogo, fichas, configuradores y diseño | KEEP | Reutilizados como destinos de las campañas. |
| Carrito y checkout | KEEP | Existen, pero su configuración de pago es disabled por defecto. |
| Repositorios de clientes/pedidos | REFACTOR cuando se active backend | Mock activo; repositorios Supabase son placeholders que lanzan error. |
| CMS/admin | KEEP como demo | Persistencia de contenido basada en localStorage; no es CRM multiusuario. |
| Formulario de presupuesto | REFACTOR | No persiste; ahora redacta correo y declara que no se recibió. |
| CRM/seguimiento Growth | BUILD (contrato + fixture) | El dominio define tags/estados/interacciones/vínculos/métricas; el fixture en memoria solo sirve para pruebas, sin UI o persistencia real. |
| Supabase SQL genérico en repo | KEEP como referencia, no activar | No prueba integración ni RLS de runtime terminada. |
| Supabase CostaClean QA/producción | REMOVE del alcance Ridaos | Datos y función de otra marca; no conectar ni leer filas. |
| Meta, pixel, CAPI, Ads | BLOCKED_EXTERNAL | Sin app, cuenta, permisos, consentimiento ni secretos Ridaos confirmados. |
| Migración de stack | REMOVE | Sin evidencia que justifique migrar React/Vite. |

## Auditoría inicial

- No hay cliente Supabase oficial instalado ni configuración segura de proyecto Ridaos en el checkout.
- `runtimeConfig` usa mock por defecto. Seleccionar Supabase solo enruta a implementaciones todavía no conectadas.
- `docs/STORAGE_ARCHITECTURE.md` confirma que uploads, auth y storage reales no existen.
- `docs/MOCK_CMS.md` confirma que el CMS guarda overrides mock en localStorage.
- `SolicitarPresupuesto.tsx` validaba campos pero solo cambiaba un estado local; no enviaba nada. Se retiró el mensaje engañoso de recepción.
- `Legal.tsx` presenta resúmenes, no políticas completas o consentimientos listos para activar marketing/analítica.
- Al inicio no había scripts de test. Esta entrega añade `test:growth` para atribución y páginas estáticas; no prueba persistencia remota ni integraciones externas.
- La instalación limpia inicialmente falló por lockfile desincronizado. Se regeneró de forma compatible y se repararon las vulnerabilidades transitivas auditadas; ver `npm audit`.

## Infraestructura ajena excluida

El proyecto Supabase QA inspeccionado pertenece a CostaClean. Su `public-lead-intake` impone environment `qa`, refiere explícitamente `kpvvydthlxupjjqqdpxy` y evalúa presupuestos de limpieza CostaClean. Aunque usa validación, firma, idempotencia y límites, reutilizarlo cruzaría clientes/datos. No se hizo ninguna escritura remota.
