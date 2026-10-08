# PRD — Ridaos 3D Preview

## Problema y propuesta de valor

Hoy el cliente evalúa la rotulación en mockups 2D; la continuidad entre piezas, la ubicación de logos y el acabado de vinilo se interpretan peor. 3D Preview ofrece una propuesta navegable y aprobable con estética fotográfica, preservando las artes de producción.

## Personas y necesidades

- **Operador Ridaos:** trabaja en CorelDRAW, conoce producción, no quiere modelar en Blender; necesita subir, ajustar y publicar en minutos para geometrías ya validadas.
- **Cliente final:** móvil primero; necesita rotar, ampliar, inspeccionar el diseño, pedir cambios y aprobar una versión inequívoca.
- **Administrador:** necesita controlar costes de IA, acceso, retención, publicaciones y trazabilidad.

## Objetivo medible V1

Completar un proyecto piloto con un vehículo IA generado, cuatro vistas rotuladas y una landing real navegable desde iPhone. El piloto es PASS solo si la calidad visual, fidelidad gráfica, rendimiento y trazabilidad superan los gates de QA.

## Requisitos funcionales (P0)

| ID | Historia / requisito | Criterio de aceptación |
|---|---|---|
| F01 | Crear proyecto con cliente, vehículo, año, variante, acabado | Datos persistidos y editables antes de publicar |
| F02 | Subir fotos base del vehículo por ángulo | No confundir fotos de referencia con artes de rotulación |
| F03 | Subir SVG/PNG/JPG y documentos fuente convertibles | Validación MIME real, tamaño, calidad y miniaturas |
| F04 | Invocar IA por trabajo asíncrono con coste visible | Estados queued/running/succeeded/failed; reintento manual |
| F05 | Guardar versiones de modelos 3D generados | Archivo y metadatos auditables, sin pérdida al regenerar |
| F06 | Asignar rotulación a left/right/rear/hood | Posición/escala/rotación/mascarado persistentes |
| F07 | Vista interna con luces fijas y reflejos al girar | Reflectancias perceptibles; pantalla fluida según QA |
| F08 | Vista pública móvil con orbit, pinch, presets, fullscreen | Sin acceso al editor o archivos fuente |
| F09 | Solicitar cambios y aprobar versión exacta | Registro con hora, versión, identidad declarada y comprobación |
| F10 | Revocar enlace, retirar publicación y versionar | Un enlace revocado deja de permitir acceso |
| F11 | Techo neutro; sugerencia conceptual opcional | No mostrar como rotulación confirmada sin aprobación |
| F12 | Guardar progreso y recuperar interrupciones | Ningún trabajo fallido destruye la última versión publicada |

## Requisitos no funcionales (P0)

- Seguridad: secretos solo servidor; controles de acceso; tokens no enumerables; límites de tamaño y solicitudes; antivirus/escaneo según diseño final.
- Fidelidad: texto/logos no pasan por recreación generativa; no se autoriza producción sobre una aproximación visual.
- Experiencia móvil: visor táctil accesible, sin controles críticos dependientes de hover.
- Rendimiento: presupuesto y métricas reales por dispositivo, detallado en QA.
- Disponibilidad: error y fallback visual si falla WebGL/API 3D.
- Coste: cuota máxima por proyecto ajustable y ninguna regeneración facturable sin acción o política aprobada.
- Observabilidad: ID por job/proyecto; logs sin datos personales o secretos.

## Fuera del MVP

Modelado exacto garantizado por texto; IA entrenada propia; pintura libre universal sobre mallas arbitrarias; CAD para corte/producción; generación de archivos de impresión; presupuestación automática; marketplaces de coches; app nativa; realidad aumentada; vídeo cinematográfico remoto.

## UX de éxito

Operador: crear → capturar/subir → generar → validar → ajustar → revisar → publicar → compartir. Cliente: abrir → inspeccionar → aprobar o comentar.

**Aviso comercial obligatorio:** «Previsualización digital del diseño. El resultado físico puede variar por material, curvaturas y montaje; no sustituye la revisión técnica previa a producción».
