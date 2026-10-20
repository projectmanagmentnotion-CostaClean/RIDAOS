# Despliegue

## Estado

Aplicación Vite estática, build listo. Vercel ya tiene el proyecto `ridaos`; Producción sigue en `main` con `1b21fb68d527fc73b6c15280ac0a7f0c34bcab4e`. El Preview vigente `dpl_263pY4zqYd8ZmWjbCjsLknZk9FEb` del commit `5eccd62c8818a379981d1deae7bd3d9918c3fb6e` está `READY`: las cinco rutas limpias devolvieron HTTP 200 con `lang=es`, título y canonical correctos al leerlas por el acceso autenticado de Vercel. Producción no se modificó. La revisión visual no se completó.

Preparación actual: **PASS_REAL para build estático y routing de Preview**, no lista para activar captación o Meta. La revisión visual del navegador, Instagram in-app, rendimiento y accesibilidad siguen pendientes. No existe endpoint Growth ni variable/credencial Meta configurada.

## Requisitos de build

- Node/npm de proyecto con lockfile sincronizado.
- `npm ci`, `npm run lint`, `npm run build`.
- El build genera páginas estáticas en `dist/growth/{slug}/index.html`; `vercel.json` reescribe las URL limpias a cada archivo.
- El build termina con `scripts/verify-growth-build.mjs`, que verifica metadatos, canonical, assets y rutas configuradas.
- No requiere variables Growth para las landings de borrador por email.
- Los valores `VITE_RIDAOS_*` actuales solo eligen modos mock/supabase/auth/pagos; no confirman un backend funcional.

## Separación de entornos futura

1. Identificar un backend de RidaosPrint; la cuenta conectada solo muestra proyectos CostaClean. No reutilizar esos proyectos. Si se autoriza o identifica un backend Ridaos, usarlo primero en Preview/staging con datos de prueba.
2. Validar auth, políticas, endpoint, consentimiento, logs y eliminación antes de producción.
3. Configurar secretos server-side en Vercel/Supabase por entorno. Nunca prefijar secreto con `VITE_`.
4. Promover solo con revisión de PR, aceptación legal y checklist de release.

## Rollback

Revertir el cambio de código mediante un commit correctivo/revert y restaurar el deployment Vercel anterior desde el panel por una persona autorizada. No hay migraciones ni cambios remotos realizados en esta entrega.
