# Pipeline IA de generación 3D y validación geométrica

## Principio rector

La IA genera **solo una propuesta de carrocería 3D** desde fotos multivista. No genera ni altera artes finales, y no proporciona por sí sola un modelo homologado/medible. Elegir Tripo para la primera comparación no implica que esté certificado ni que sea siempre el mejor.

## Flujo técnico de job

1. Crear expediente de vehículo: marca/modelo/año/versión/longitud/altura y fotos con permisos.
2. Preprocesar fotos para iluminación consistente, fondo limpio y orientación; conservar originales.
3. Consultar límites, capacidad, formatos, términos comerciales y presupuesto del proveedor.
4. Encolar generación multivista, registrar proveedor, modelo de IA, parámetros, IDs, costes previstos y reales.
5. Esperar callback autenticado o polling seguro con backoff; proteger de dobles facturaciones.
6. Descargar geometría y texturas a almacenamiento privado; hash y trazabilidad.
7. Preflight automático: formato GLB/GLTF, número de mallas, vértices, escala, normales, orientación, UV y presupuesto triángulos.
8. Comparar en inspector contra fotos: silueta, puertas, lunas, espejos, llantas, capó, voladizos.
9. Delimitar zonas de rotulación mediante reglas/segmentación + herramientas de corrección web.
10. Generar export web optimizado, previews y métricas; pedir aprobación explícita del operador.
11. Cache del vehículo **solo** si geometría, año, versión y calidad están validados, con versión de pipeline.

## Estrategia para aplicar gráficos

- Primer intento: superficies/zones detectadas, proyección planar calibrada por vista y raycast sobre malla; clip/máscaras para vidrio, juntas y parachoques.
- Segundo nivel: decals por zona sobre geometría visible, con ajustes manuales limitados; detectar pliegues y estiramientos.
- Modelo reutilizable validado: bake/UV editables con coordenadas y máscaras guardadas.
- No proyectar la foto entera de una furgoneta ya rotulada encima de la carrocería; separar arte y referencia.
- No prometer correspondencia milimétrica en una malla IA; el diseño de impresión y verificación real permanecen separados.

## Gates geométricos de rechazo (obligatorios)

- Puertas laterales o traseras mal ubicadas; lunas fundidas en chapa.
- Logos se deforman en la zona plana que deberían respetar.
- Capó/techo faltantes o superpuestos.
- Ruedas, manetas o pilares geométricamente absurdos.
- Reflejos que muestran artefactos severos al mover cámara.
- El proveedor no permite legalmente exportación/uso público del activo en visor interactivo.
- El coste máximo de reintentos supera el presupuesto definido.

## Manejo de fallo

2–3 reintentos humanos controlados, con coste visible, y comparación de proveedores como experimento. Si ninguna malla es apta, detener publicación 3D; se puede ofrecer un mockup 2D claramente señalado como tal. **No ocultar errores geométricos con efectos de estudio**.

## Contrato de salida de Generator

model_id, generation_job_id, provider, provider_model_version, source_photo_hashes, attempt, status, charged_credits, asset_glb_uri_private, preview_uri, mesh_metrics, licence_status, manual_review, validation_report, created_at.

## Licencias y propiedad intelectual

Confirmar condiciones comerciales de generación, retención de fotos, derechos de outputs, divulgación y logos de fabricante; nunca presumir derecho a redistribuir ficheros generados o referencias de cliente sin revisión.
