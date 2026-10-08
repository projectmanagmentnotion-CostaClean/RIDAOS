# ADR — decisiones de arquitectura y riesgos abiertos

## ADR-001 — Generar en lugar de comprar modelos

**Decisión:** no presupuestar librería comercial 3D; experimento con IA multivista. **Consecuencia:** coste de intentos y riesgo geométrico alto. **Alternativa si falla:** detener 3D fiable, presentar mockup 2D; no ocultar desviación.

## ADR-002 — No usar Blender manualmente

**Decisión:** flujo operador 100% web + conversiones automáticas/headless donde técnicamente posibles. **Consecuencia:** desarrollar mapeado/segmentación propios y un workflow de diagnóstico. **No implica:** que cualquier malla arbitraria pueda prepararse sin una tarea experta puntual.

## ADR-003 — Carrocería y artes separadas

**Decisión:** IA genera la malla, rotulación se proyecta desde originales. **Motivo:** proteger logos, texto y colores; hacer correcciones sin regenerar el vehículo.

## ADR-004 — Entorno fijo, vehículo giratorio

**Decisión:** luces y reflejos en espacio mundo (environment reflection); no reflejos «pintados». **Coste:** setup de materiales/entorno y optimización para móvil; efectos de alto coste solo condicionales.

## ADR-005 — Hosting GrowBig como primer candidato

**Decisión:** sin Vercel ni Supabase nuevo para el MVP. **Observación:** web RIDAOS existente contiene código Supabase y no se elimina ni migra. **Riesgo:** recursos compartidos y persistencia/colas a validar. **Acción:** staging real antes de producción.

## ADR-006 — Editor semiautomático y revisión humana

**Decisión:** autocolocación como punto de partida, ajustes/certificación manuales. **Motivo:** superficies curvas, uniones, capó y máscaras no garantizadas por IA.

## ADR-007 — Publicación y aprobación inmutables

**Decisión:** approval exige snapshot/versión/hash y mecanismo de validación de identidad adecuado. **Motivo:** seguridad, confianza y trazabilidad comercial.

## Registro de riesgos priorizados

| Riesgo | Impacto | Mitigación/gate |
|---|---|---|
| IA deforma una versión concreta | P0 | Fotos múltiples + inspección + rechazo |
| UV o costuras destruyen gráfica | P0 | decal por zona + ortográficas + QA textos |
| Propiedad/licencia modelos e imágenes | P0 | verificar términos antes de usar/compartir |
| Publicación revela activos fuente | P0 | buckets privados + versiones web necesarias + aviso extracción posible |
| Enlace aprobable por tercero | P0 | tokens, verificación, expiración y auditoría |
| Archivos desaparecen al redeploy | P0 | prueba de persistencia + backups/restore |
| Reflexiones no corresponden a luces | P1 | environment map fijo + QA rotación real |
| Render se bloquea en iPhone | P1 | LOD, control DPR, fallback, profiling |
| Coste IA por regeneraciones | P1 | límites por job/proyecto, caché, stops |
| Dependencia proveedor IA | P2 | adapter interface y benchmark de alternativa |
| Hosting insuficiente para archivos pesados | P1 | test de cuotas; objeto externo solo si imprescindible |
| Techo imaginado como diseño aprobado | P1 | neutro/default + etiqueta conceptual |

## Decisiones futuras pendientes

- Origen y licencia comercial de fotos de vehículos reales de terceros.
- Elección concreta entre Fastify, Express o framework full stack tras prueba del despliegue.
- Dónde guardar activos persistentes si GrowBig no es suficiente.
- Proveedor IA aprobado por benchmark y condiciones comerciales, no por marketing.
- Política de retención GDPR, identidad en aprobación y plantilla contractual.
- Presupuesto máximo mensual e inversión inicial de horas.

**Gate final:** ninguna incógnita P0 puede convertirse en supuesto silencioso.
