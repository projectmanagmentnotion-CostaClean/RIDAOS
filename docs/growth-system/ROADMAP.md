# Roadmap

## Hecho en esta entrega

- Confirmación de repo, rama de trabajo aislada, HEAD base y despliegue existente.
- Auditoría de mocks, persistencia, formularios y límites de Supabase.
- Cinco landings reutilizando catálogo/productos existentes, con UTM en borrador de correo.
- Rutas limpias públicas con HTML por campaña y metadatos OG/Twitter/canonical en build.
- Verificador sin dependencias de las páginas estáticas generado como parte de `npm run build`.
- Formulario transparente: prepara borrador, no afirma envío o recepción.
- Contratos neutrales de Growth para leads, consentimiento, atribución, etiquetas, estados, interacciones, vínculos y conversiones.
- Fixture CRM exclusivamente en memoria, contrato Meta desacoplado y verificador local de challenge/firma, probados mediante diez pruebas clasificadas PASS_MOCK/PASS_REAL.
- Preview de Vercel del commit `d576d6e1b8b86b7a9ede8040210c2ba69d11e9fe` listo; las cinco rutas limpias devuelven HTTP 200 y canonical correcto (**PASS_REAL Preview**).
- Lockfile sincronizado y dependencias sin hallazgos en `npm audit` tras reparación compatible.
- Ocho documentos del sistema.

## Siguiente fase técnica (local, sin proveedor externo)

1. Completar revisión visual y accesibilidad en viewport móvil; Computer Use detuvo la revisión al no poder identificar con confianza la URL del navegador y no hay Playwright instalado.
2. Ampliar pruebas unitarias de navegación y mensajes de formulario; ya existen pruebas para UTM en landing→producto→presupuesto, artefactos estáticos, fixture CRM en memoria y seguridad criptográfica local.
3. Completar contenido comercial y legal con datos aprobados por titular.
4. Completar revisión manual de landings en Preview y comprobar el navegador in-app de Instagram; no hay automatización de navegador instalada y Computer Use no pudo obtener un estado de URL confiable.
5. Implementar y probar persistencia solo tras identificar un backend RidaosPrint autorizado; hoy existe el contrato y fixture PASS_MOCK, sin adaptador de persistencia conectado.

## Bloqueos de integración

1. Identificar un backend/proyecto Supabase propiedad de RidaosPrint o autorizar crear/usar uno. Los dos proyectos visibles son CostaClean y no deben recibir leads Ridaos.
2. Aprobar titularidad, campos, retención, consentimiento, política de privacidad y accesos de CRM.
3. Para Meta: aportar acceso Business/Instagram profesional y app con los permisos aprobados.
4. Para analytics/cookies: definir consentimiento y herramienta; no instalar Pixel antes de ello.
5. Vercel: variables por Preview/Production y endpoints seguros solo después del gate de backend; deploy/producción requiere autorización aparte.

## Release

Preparar un PR de revisión para esta rama, con CRM real, Meta, routing en Vercel y QA visual marcados como gates. No fusionar ni desplegar a producción hasta resolver los gates de backend/privacidad, verificaciones Preview, seguridad y aprobación del titular. Producción sigue en el commit `1b21fb68d527fc73b6c15280ac0a7f0c34bcab4e`.
