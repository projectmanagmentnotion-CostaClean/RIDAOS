# Landing cliente — entrega y aprobación verificable

## URL objetivo

Subdominio separado de la tienda, ejemplo aspiracional:
- Panel: https://3d.ridaosprint.com/admin
- Cliente: https://3d.ridaosprint.com/p/<token-no-enumerable>

No se ha configurado DNS/SSL. Estas URLs son diseño futuro, no enlaces operativos.

## Estructura de página

1. Cabecera mínima «RIDAOS PRINT», nombre de propuesta y versión.
2. Hero visor WebGL: showroom fijo, furgoneta gira, zoom táctil, con controles alternativos.
3. Selector de vista: frente 3/4, lateral izq, lateral der, trasera 3/4 y capó.
4. Acabado declarado: color base, mate/satinado/brillo, fecha y notas de concepto.
5. Acciones separadas «Aprobar diseño» / «Solicitar cambios»; mostrar versión y resumen previo a aprobar.
6. Aviso de límites de previsualización e indicación de techo conceptual, cuando aplique.
7. Fallback imágenes si dispositivo o red impiden 3D; no simular interacción.

## Semántica de la aprobación

- Solo puede aprobarse una **publicación inmutable** con version_id + mesh_hash + artwork_hashes + placements_hash + finish_id.
- La acción requiere confirmación explícita y nombre/email o comprobación de identidad acordada; registrar timestamp y, cuando sea legalmente adecuado, contexto de autenticación mínimo.
- Token de enlace privado no equivale a identidad fuerte. Para aprobación con valor contractual, incorporar OTP/email validado o firma externa según necesidad jurídica; revisar con asesoría antes de presentarlo como firma contractual.
- Registrar IP/UA solo si es necesario, justificado y comunicado en política de privacidad.
- Solicitud de cambios genera evento y nueva revisión; no borra aprobación histórica ni sobreescribe el snapshot.
- Versiones antiguas: visibles o no según política definida, pero no se pueden «actualizar en sitio» sin invalidar su versión publicada.
- Revocación: token invalidado servidor, archivos privados inaccesibles; cache/CDN controlada.

## Medidas contra errores del cliente

No mostrar aprobación si la generación/rotulación está marcada como «no validada». Confirmar «Aprobar versión N» con miniaturas/fecha. Evitar que un simple click accidental apruebe directamente.

## Idioma y móvil

Español MVP; catalogar textos para catalán/inglés futuros. Contraste, tamaño táctil, menús legibles, fallback e instrucciones claras sin tapar el vehículo.
