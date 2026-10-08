# Showroom 3D: materiales, luces y reflejos

## Objetivo visual

Trasladar a tiempo real el lenguaje de fotografía automotriz premium: estudio detailing oscuro, techo con luminarias hexagonales blancas, dos bandas/softboxes lineales laterales, luz de contorno y suelo de reflejo moderado. La carrocería y los materiales deben seguir legibles durante giro y zoom.

## Decisión crítica: luz fija y vehículo rotatorio

- Cámaras de cliente pueden orbitar alrededor del vehículo, pero el entorno de luz no debe «pegarse» a la cámara ni al coche.
- Las líneas y hexágonos se reflejan al cambiar la orientación de la superficie; **una luz que ilumina no genera por sí sola el dibujo visible en una reflexión especular**.
- Implementación base: superficies emisivas visibles + environment map/HDRI/PMREM de estudio **en coordenadas del mundo**, con formas hexagonales y rectángulos reflejantes; rotar el vehículo frente al entorno.
- Si se requiere que luminarias/objetos cercanos modifiquen su reflejo en tiempo real, explorar reflection probes/cubemap o técnicas screenspace, condicionado a rendimiento y soporte web. No activar SSR costoso por defecto en móviles.
- Si el render solo parece pintar rayas sobre la chapa, gate visual FAIL.

## Materiales PBR

| Superficie | Característica |
|---|---|
| Pintura brillo | Metalness apropiado según material, baseColor correcto, clearcoat, roughness reducida |
| Pintura satín | Reflexión más difusa, roughness mayor y microtextura discreta |
| Vinilo mate | Roughness alta, especular suavizado, respuesta distinta de la pintura |
| Vinilo brillo | Capa superior con reflejo controlado y color del arte preservado |
| Cristal | Fresnel/reflectividad y transparencia controladas; no mostrar texto bajo el vidrio por error |
| Plásticos/ruedas | Material específico, sin brillo homogéneo artificial |

No usar valores numéricos «universales» de roughness/metalness; calibrar por referencia fotográfica y pantalla. Textura del arte en sRGB; cálculos de iluminación en espacio lineal; tone mapping y control de exposición consistentes.

## Prestaciones

- Crear niveles de calidad (móvil base, móvil premium, escritorio); feature detection WebGL.
- Mantener escena/iluminación compartida, no duplicar por cada proyecto.
- Optimizar GLB por polígonos, mallas, draw calls y texturas; imágenes KTX2/WebP/AVIF donde sean adecuadas y probadas.
- Resolución de textura por zona/LOD; acercamientos a logos sin pixelación perceptible bajo límite de zoom razonable.
- Limitar DPR dinámicamente; cargar vista simple antes de assets pesados y suspender render cuando página esté inactiva.
- Perfil de tiempo de fotograma, memoria, descarga y batería en iPhone real; targets en QA, no cifras garantizadas sin medir.

## Cámara y composición

3/4 frontal por defecto, focal visual fotográfica sin exagerar perspectivas; transiciones suaves entre left/right/rear/hood; movimiento reducido accesible. Piso oscuro con sombra de contacto y reflexión sutil; evitar entorno negro que elimine detalle de piezas.

## Prueba de fidelidad

Para cada acabado, revisar: panel lateral, capó en oblicuo, trasera, cristal, unión de gráficos en puerta, reflejo de hexágono que se desplaza correctamente al girar; captura real de vídeo de iPhone a varias distancias.
