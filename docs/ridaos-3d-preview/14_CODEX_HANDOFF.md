# Handoff de ejecución para Codex / ORCHESTOR

## Estado inicial y principio de trabajo

Este repositorio alberga una web RIDAOS ya existente (React/Vite/TypeScript). Los documentos de esta carpeta especifican un **producto aún no construido**; no modificar código existente, despliegues, DB, DNS ni secretos hasta mapear impacto. Local-first y mínima infraestructura.

## Orden de lectura obligatorio

README → 00 → 01 → 03 → 05 → 06 → 12 → 13 → 15. Para cada slice consultar los documentos asociados; no asumir que un diseño conceptual es output 3D funcional.

## Primera misión recomendada (R0 + R1)

1. Inspeccionar status/head/ramas, scripts, dependencias, estructura, tests y archivos de configuración; producir baseline.
2. Proponer ubicación aislada (nueva app en workspace o repositorio aparte) **sin editar web existente**.
3. Verificar API Tripo actual (autenticación, generador multivista, ficheros, licencia, límites, callback/poll, precio por llamada), fuentes oficiales y condiciones.
4. Crear prueba LOCAL mock de pipeline usando malla sintética/fixture, sin API externa y sin secretos.
5. Definir fixture de 1 furgoneta de referencia y protocolo de fotos a aportar por el usuario.
6. Definir pequeño benchmark contra 1 generación real **solo con autorización explícita de gasto y credenciales**.
7. Diseñar checks geométricos y visuales, incluido techo, ventanas y reflejos. STOP si no funciona.
8. Entregar diff pequeño, tests reales y coste real observado; pedir permiso antes de ampliar alcance.

## Prompt listo para pegar a Codex

Lee íntegramente docs/ridaos-3d-preview/README.md y sus documentos vinculados. Actúa como arquitecto/ingeniero senior local-first. El producto es Ridaos 3D Preview: IA multivista para malla de vehículo, 4 artes de CorelDRAW por zona, editor web de colocación, entorno detailing con luces hexagonales y laterales fijas en mundo y reflejos dinámicos al rotar, landing móvil y aprobación versionada. Restricciones: sin Blender manual, sin compra de modelos 3D, sin servicios nuevos si GrowBig basta, sin tocar sitio RIDAOS actual, sin writes a producción, sin API de pago ni secretos sin permiso. Ejecuta ÚNICAMENTE R0: audita repositorio/estado, valida documentación de proveedor IA y hosting, propone arquitectura concreta aislada, plan de R1, riesgos y criterios de STOP. No implementes aún R2–R9 ni despliegues. Reporta HEAD inicial/final, archivos tocados, evidencias, tests ejecutados/no ejecutados, bloqueos y siguiente paso concreto.

## Formato de respuesta exigido a agentes

- SCOPE / BASELINE_SHA / BRANCH / FILES_CHANGED
- IMPLEMENTED / NOT_IMPLEMENTED
- VERIFIED_WITH_EVIDENCE / ASSUMED / NOT_VERIFIED
- QA: lint, typecheck, test, build, screenshot/phone, security, performance
- AI_CREDITS_SPENT / HOSTING_MUTATIONS / SECRETS_TOUCHED
- BLOCKERS / STOP or PASS / NEXT_SAFE_STEP

## Prohibiciones

No declararlo terminado basándose en maqueta IA, no desplegar a main, no instalar proveedor sin revisar términos, no inferir autorización de usar dinero por esta documentación, no subir fotos reales ni assets de clientes a un repo público.
