# Despliegue

## Estado

Aplicación Vite estática, build listo localmente. Vercel ya tiene el proyecto `ridaos`; producción usa `main` en `1b21fb68d527fc73b6c15280ac0a7f0c34bcab4e`. La vista previa existente correspondía a una rama documental anterior. No se llamó a Vercel para desplegar ni modificar configuración.

Preparación actual: **lista para Preview estático bajo revisión**, no lista para activar captación o Meta. Los artefactos de cinco landings pasan el verificador local; routing, build y cabeceras de producción aún necesitan comprobarse en un deployment Preview del commit actual. No existe endpoint Growth ni variable/credencial Meta configurada.

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
