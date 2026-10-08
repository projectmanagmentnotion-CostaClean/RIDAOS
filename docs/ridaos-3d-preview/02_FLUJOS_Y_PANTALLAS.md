# Flujos y pantallas — móvil primero

## Flujo del operador

1. **Dashboard:** proyectos; filtros borrador/generando/revisión/publicado/aprobado; coste IA acumulado.
2. **Nuevo proyecto:** nombre, cliente, marca/modelo/año, versión y batalla/altura, color base, acabado; campos desconocidos explícitos.
3. **Referencias vehículo:** fotos del vehículo limpio o sin gráficos; instrucciones de capturas 3/4 frontal, laterales, 3/4 trasero, frontal, capó; metadatos y consentimiento.
4. **Artes:** pestañas izquierda, derecha, trasera, capó/frontal, techo opcional; logo separable; asignar original a región.
5. **Generación:** selección de proveedor/variante; estimación antes de consumir créditos; historial de intentos; previsualizar geometría sin diseño.
6. **Inspección de malla:** silueta, puertas, ruedas, manetas, cristales, juntas; comparador con referencias; aprobar malla o regenerar.
7. **Editor 3D:** vista central, capa seleccionada, controles de encaje, máscara y ayudas; undo/redo; guardado automático versionado.
8. **Showroom y revisión:** cambiar acabados, activar luminarias, comparar artes originales, examinar capó y costuras.
9. **Publicar:** snapshot inmutable; token privado; vista previa del cliente; caducidad/revocación; confirmar.
10. **Feedback:** comentarios por versión; revisión y republicación sin reescribir una versión ya aprobada.

## Landing cliente (estructura móvil)

- Cabecera RIDAOS PRINT + título del proyecto, poco texto; no ocupar el visor.
- Gran visor 3D como zona dominante de pantalla.
- Entorno oscuro con hexágonos de luz en techo y barras laterales.
- Etiqueta «Vista interactiva 360°» y ayuda al primer toque.
- Carrusel compacto de cámaras: 3/4 frontal, izq, der, 3/4 trasera, capó.
- Controles evidentes: restablecer, ampliar, pantalla completa; gestos drag/pinch.
- Acciones: «Aprobar diseño» / «Solicitar cambios» con confirmación y resumen de versión.
- Datos: vehículo, acabado, fecha de versión; aviso «previsualización conceptual».
- Fallback si WebGL no está disponible: 4–6 renders estáticos seguros, sin fingir 360°.

## Mockup existente y guía visual

Referencia conceptual aprobada en conversación: furgoneta negra con rotulación azul; estudio detailing oscuro, luz hexagonal blanca cenital, tiras verticales laterales, reflejos nítidos y suelo sobrio. El mockup es una **imagen**, no un componente implementado ni garantía de render.

**Tono UI:** premium, minimal, profesional; texto de producto en español; evitar colores estridentes y efectos que oculten el arte.

## Estados críticos de UI

Empty / uploading / parsing / awaiting photos / AI pending / AI running / AI failed / mesh rejected / mesh accepted / unassigned graphics / unsaved adjustments / draft preview / publish confirmation / published / expired / revoked / approved / change requested.

## Accesibilidad

- Botones nativos y etiquetas claras.
- Alternativa a gestos: cámaras guardadas, zoom +/- y reset.
- Contraste WCAG AA; foco visible; teclado compatible en escritorio.
- Preferencias de movimiento reducido para animaciones de cámara.
- Evitar botones táctiles demasiado pequeños, scroll accidental dentro del visor y bloqueo de página.
