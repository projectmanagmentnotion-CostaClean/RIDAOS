# Editor de rotulación — web, simple, controlable

## UI de escritorio (uso principal del operador)

- Barra superior: proyecto/versión, guardar, historial, deshacer/rehacer, comparar, previsualizar, publicar.
- Izquierda: árbol de zonas left/right/rear/hood/front/roof; por zona listado de capas originales.
- Centro: modelo 3D, overlay de referencia, selector de cámaras, modo «solo arte», iluminación.
- Derecha: seleccionar capa y ajustar: X/Y, escala X/Y bloqueada por defecto, rotación, opacidad, orden, máscara.
- Parte inferior: estado de geometría, progresos de guardado, advertencias, coste IA consumido.

## Reglas de interacción

- Proyección inicial automática y **editable**; drag en superficie con raycast y handles en zona.
- «Bloquear proporción» por defecto, no espejar texto automáticamente.
- Snapping a puntos de referencia del modelo (puertas, centro de panel, bordes seguros).
- Máscaras separadas por zona para vidrio, manetas, matrícula, juntas y ruedas; se deben poder corregir.
- Vista ortográfica por cara para corregir proporciones; comparador de diseño original vs aplicado.
- Costuras: comprobar continuidad de franjas al envolver puertas y esquinas; línea roja de alarma por estiramiento excesivo.
- Capó: proyección con orientación explícita; no asumir que frontal y capó son la misma superficie.
- Techo: por defecto sin rotular; propuesta IA detrás de bandera de confirmación.
- Presets de acabado afectan reflejos, **no** modifican la tinta ni el color base del arte importado.
- Guardado de operaciones atómicas; versionado/restauración y autosave sin sobrescribir publicación aprobada.

## Prohibiciones

No permitir desplazar una matrícula real, borrar emblemas legales ni usar arte aprobado como medición de corte; no aprobar silenciosamente un diseño IA reconstruido de memoria. La herramienta es visual y no un CAD certificado.

## Modelo de placement (conceptual)

- placement_id, project_revision_id, zone_id, artwork_asset_id.
- transform: local_position_u/v, scale_u/v, rotation_degrees, lock_aspect.
- mask_id, projection_mode, z_order, visible, material_finish_override.
- mesh_revision_id, author, updated_at.

Cada placement depende de revisión de malla; si la regeneración altera topología o escala, invalidar placements existentes hasta que sean revisados.

## Criterios de aceptación

Una capa se mueve y queda en la misma posición tras recargar; un ajuste no altera otras caras; existe «restaurar original»; las letras no se espejan; el capó y la trasera no heredan indebidamente máscaras de lateral; al publicar, el estado editado se congela.
