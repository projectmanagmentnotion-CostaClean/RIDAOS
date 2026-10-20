# Despliegue

## Estado

Aplicación Vite estática, build listo. Vercel ya tiene el proyecto `ridaos`; Producción sigue en `main` con `1b21fb68d527fc73b6c15280ac0a7f0c34bcab4e`. El deployment Preview `dpl_62ZicoRuHqZvLs6PfVGC94M8MczF` del commit `d576d6e1b8b86b7a9ede8040210c2ba69d11e9fe` está `READY`: las cinco rutas limpias devolvieron HTTP 200 con HTML en español y canonical único correcto al leerlas por el acceso autenticado de Vercel. Producción no se modificó.

Preparación actual: **PASS_REAL para build estático y routing de Preview**, no lista para activar captación o Meta. La revisión visual del navegador, Instagram in-app, rendimiento y accesibilidad siguen pendientes. No existe endpoint Growth ni variable/credencial Meta configurada.

## Requisitos de build

- Node/npm de proyecto con lockfile sincronizado.
- `npm ci`, `npm run lint`, `npm run build`.
- El build genera páginas estáticas en `dist/growth/{slug}/index.html`; `vercel.json` reescribe las URL limpias a cada archivo.
- El build termina con `scripts/verify-growth-build.mjs`, que verifica metadatos, canonical, assets y rutas configuradas.
- No requiere variables Growth para las landings de borrador por email.
- Los valores `VITE_RIDAOS_*` actuales solo eligen modos mock/supabase/auth/pagos; no confirman un backend funcional.

## Separación de entornos futura

1. Usar backend de RidaosPrint en Preview/staging con datos de prueba.
2. Validar auth, políticas, endpoint, consentimiento, logs y eliminación antes de producción.
3. Configurar secretos server-side en Vercel/Supabase por entorno. Nunca prefijar secreto con `VITE_`.
4. Promover solo con revisión de PR, aceptación legal y checklist de release.

## Rollback

Revertir el cambio de código mediante un commit correctivo/revert y restaurar el deployment Vercel anterior desde el panel por una persona autorizada. No hay migraciones ni cambios remotos realizados en esta entrega.
