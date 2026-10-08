# Ridaos 3D Preview — documentación maestra

**Estado:** diseño y documentación (sin código MVP ni despliegue certificado).
**Fecha de corte:** 2026-10-08.
**Propietario funcional:** Ridaos Print.
**Proyecto GitHub contenedor:** RIDAOS (web existente React + Vite; esta carpeta documenta una aplicación nueva y aislada).

## Visión de 30 segundos

Convertir una rotulación diseñada en CorelDRAW en una presentación 3D de vehículo accesible por enlace privado. El operador facilita marca/modelo/año/versión, fotografías de referencia y artes de ambos laterales, trasera y capó; una IA propone la geometría 3D, un editor web permite corregir el encaje y el cliente gira, amplía y aprueba la versión final.

**No** se comprarán modelos 3D comerciales como estrategia del MVP. **No** se exigirá usar Blender manualmente. **Sí** se exige revisión humana antes de publicar. La IA no garantiza fidelidad de la carrocería ni una UV utilizable. La primera prueba técnica debe demostrarlo.

## Decisiones de producto ya expresadas

- Cuatro proyectos/vehículos por mes como referencia económica inicial.
- Inputs: CorelDRAW, vector SVG/EPS/PDF (convertible), PNG, JPG y mapas de bits.
- Vistas: izquierda, derecha, trasera, capó/frontal; techo normalmente no disponible.
- Techo: neutro por defecto; sugerencia IA opcional y marcada como conceptual hasta aprobación.
- Acabados: pintura/vinilo mate, satinado o brillo, con showroom oscuro tipo detailing.
- Luces hexagonales en techo y lineales laterales **fijas en el mundo**; el vehículo gira y los reflejos cambian sobre la carrocería.
- Visor móvil con giro 360°, zoom táctil, vistas guardadas, pantalla completa, aprobación/cambios.
- Desarrollo local-first con Codex; SiteGround GrowBig para operación cuando se certifique.
- No modificar la web comercial actual ni exponer secretos de IA al navegador.

## Lectura por perfil

**Dirección de producto:** [estado y decisiones](00_ESTADO_Y_DECISIONES.md) → [PRD](01_PRD.md) → [costes](11_COSTES_Y_CAPACIDAD.md) → [roadmap](12_ROADMAP_Y_GATES.md).

**Diseño/operador:** [flujos/pantallas](02_FLUJOS_Y_PANTALLAS.md) → [CorelDRAW e ingesta](04_INPUTS_Y_CORELDRAW.md) → [editor](07_EDITOR_Y_REGLAS.md).

**Codex/ingeniería:** [arquitectura](03_ARQUITECTURA.md) → [pipeline de IA](05_PIPELINE_IA_3D.md) → [render](06_SHOWROOM_RENDER.md) → [datos/API/seguridad](09_DATOS_API_SEGURIDAD.md) → [hosting](10_SITEGROUND_GROWBIG.md) → [hándoff](14_CODEX_HANDOFF.md).

**QA:** [landing](08_LANDING_Y_APROBACION.md) → [pruebas](13_QA_ACEPTACION.md) → [ADR/riesgos](15_ADR_RIESGOS.md).

## Alcance del repositorio actual

RIDAOS ya contiene React, Vite, TypeScript y artefactos Supabase; no se asume que la futura aplicación tenga que compartir ese backend ni migrar la web. Se ha elegido esta ruta de documentación para mantener continuidad bajo la marca mientras se valida si conviene una app aislada en el mismo monorepo o un repositorio dedicado.

**Fuente de verdad:** estos documentos son decisiones/requisitos propuestos, **no certificación de funcionalidad implementada**. Toda dependencia externa pendiente está etiquetada como hipótesis o gate.

## Referencias oficiales (verificar precios, límites y API al ejecutar)

- SiteGround Node.js GrowBig: https://www.siteground.com/es/blog/hosting-para-proyectos-node-js-con-siteground
- Node.js SiteGround, guía: https://www.siteground.com/es/kb/crear-proyecto-node-js
- Three.js: https://threejs.org/
- React Three Fiber: https://r3f.docs.pmnd.rs/
- Tripo: https://www.tripo3d.ai/ (API y precios sujetos a comprobación)
