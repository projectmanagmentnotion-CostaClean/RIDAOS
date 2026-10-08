# Roadmap ejecutable para Codex — incremental y con STOP

No seguir fases por inercia. Cada una exige evidencia y gate PASS antes de consumir recursos reales o tocar producción.

| Fase | Objetivo | Entregable | Gate |
|---|---|---|---|
| R0 | Descubrimiento del repo y hospedaje | ADR stack, estado Git, plan local, informe SiteGround | No cambios en producción |
| R1 | Benchmark IA multivista | 1 vehículo IA y pruebas reproducibles con coste registrado | Geometría aceptada o STOP |
| R2 | Viewer sin backoffice | GLB real gira, zoom, cámara y entorno fijo hex/lateral | Reflejo correcto + iPhone usable |
| R3 | Arte real de CorelDRAW | 4 zonas + proyección/máscaras; arte exacto | Letras/colores/costuras PASS |
| R4 | Editor web mínimo | mover/escalar/rotar, guardar, undo, máscaras | Reload reproduce el mismo estado |
| R5 | Persistencia y acceso | Node + DB + asset pipeline + auth | aislamiento y recuperación PASS |
| R6 | Landing pública privada | publicación inmutable, token, cámaras, fallback | móvil, seguridad y privacidad PASS |
| R7 | Aprobación | feedback y aprobación a versión/identidad verificable | auditabilidad/revocación PASS |
| R8 | GrowBig staging | deployment en dominio temporal, backup+restore | rollback y performance PASS |
| R9 | Producción con autorización | subdominio, monitoreo, primer cliente | aceptación integral PASS |

## Dependencias que condicionan el esfuerzo

- R1 no prueba UI comercial; R2 no prueba fidelidad de logos.
- R3 necesita R1 + segmentación/máscaras válidas, no solo screenshot bonito.
- R5 requiere decidir almacenamiento persistente tras investigar SiteGround.
- R9 necesita consentimiento explícito, privacidad y autorización de publicar.

## Gate P0 de realismo (R1–R3)

- Lateral izq/der, puertas y capó identificables respecto a referencia fotográfica.
- Un logo pequeño no desaparece/deforma durante rotación y zoom permitido.
- Malla sin artefactos obvios que amplifiquen el brillo del estudio.
- Render con hexágonos y strips que realmente cambian de posición aparente sobre la carrocería.
- Distinción explícita entre render visual y plano técnico de impresión.

## Criterios de STOP

Geometría repetidamente errónea, IA sin licencia adecuada, fuga de datos, costes sin límites, aprobación sin versión, pérdida de archivos tras despliegue, rendimiento móvil inaceptable. Investigar alternativas antes de avanzar.

## Hitos de valor

A. Demo local convincente (R1–R3). B. Productividad real en editor (R4–R5). C. Primera aprobación privada verificada (R6–R9).
