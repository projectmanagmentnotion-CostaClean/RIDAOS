# Ridaos Prepress Acceptance System

## Objetivo

Este sistema define la comprobacion inicial, la revision visible y la aceptacion explicita del archivo antes de preparar una solicitud de impresion en frontend/mock/local.

No activa backend real.
No activa storage real.
No activa pagos.
No promete validacion tecnica absoluta.

## Estado del archivo

- `no-file`: archivo pendiente
- `uploaded`: archivo recibido
- `checking`: comprobando archivo
- `needs-correction`: necesita correccion
- `needs-designer`: ayuda de diseno solicitada
- `ready-for-approval`: listo para revisar
- `client-approved`: aprobado por el cliente
- `accepted-for-production`: aceptado para preparar impresion

## Regla principal

- si hay archivo y no se ha solicitado ayuda de diseno, el cliente debe revisar y aceptar explicitamente la version que se usara como referencia
- si el cliente solicita ayuda de diseno Ridaos, la solicitud puede continuar sin aceptacion final del archivo
- el checkout no debe confirmar una solicitud con lineas pendientes de aceptacion cuando `acceptanceRequired` sea `true`

## Formatos permitidos

Preferidos:

- PDF
- AI
- EPS
- SVG
- TIFF
- PNG alta resolucion
- JPG alta resolucion

Aceptados con aviso:

- PSD
- ZIP
- WEBP solo como caso orientativo o preview

No recomendados:

- capturas de pantalla
- imagenes comprimidas de mensajeria
- Word o PowerPoint como arte final
- archivos sin medidas claras
- raster pequeño para impresion final

## Requisitos por producto

### DTI por metro

- formato recomendado: PNG limpio, PDF o AI
- comprobar transparencia y separacion de disenos
- respetar ancho util del rollo

### Tarjetas de visita

- PDF recomendado
- revisar formato elegido, sangrado y zona segura
- si hay foil oro, foil plata o barniz 3D, exigir capa o pagina separada

### Flyers

- PDF recomendado
- revisar A3, A4, A5, A6 o DL segun configuracion
- si es doble cara, recomendar PDF multipagina o caras separadas con claridad

### Pegatinas

- PDF, SVG, AI o EPS recomendados
- si hay troquel personalizado o kiss-cut, pedir linea de corte o ayuda de diseno

### Vinilo

- PDF, AI o EPS recomendados
- revisar escala, paneles y resolucion raster

### Rotulacion

- vector recomendado
- si faltan plantilla o medidas claras, derivar a ayuda de diseno como flujo principal

### Textil

- PNG transparente, PDF o AI recomendados
- revisar fondo y zona de impresion

## Validaciones frontend disponibles

- extension
- MIME type cuando esta disponible
- peso maximo por regla
- formato recomendado por producto
- numero de archivos en el flujo actual
- dimensiones de imagen cuando el navegador puede leerlas
- advertencias de productos de papel si el archivo no es PDF
- advertencias de acabados especiales sin capa/pagina separada
- advertencias de DTI, textil o troquelado segun configuracion

## Lo que no se debe prometer todavia

- certificacion tecnica completa
- validacion real de sangrado o colorimetria
- comprobacion automatica fiable de capas de foil o barniz
- produccion automatica
- plazos cerrados por sistema

Usar siempre el lenguaje `comprobacion inicial` o `revision visible`.

## Modal de incidencias

Cuando el archivo necesita correccion, el storefront debe abrir un modal con:

- problema detectado
- por que importa
- que corregir
- opcion de subir otro archivo
- opcion de ver requisitos
- opcion de solicitar ayuda de diseno Ridaos

## Aceptacion explicita del cliente

Bloque visible:

- nombre de archivo
- formato
- peso
- producto asociado
- configuracion asociada
- estado de comprobacion
- advertencias
- fecha y hora de aceptacion si existe

Texto:

- `Revisa este archivo antes de continuar. Este sera el archivo usado como referencia para preparar la impresion.`

Checkbox:

- `He revisado el archivo y acepto que esta es la version que se usara para preparar la impresion.`

Boton:

- `Aceptar archivo`

## Integracion con carrito y checkout

- el carrito muestra estado del archivo, aceptacion del cliente, ayuda de diseno y advertencia principal
- el checkout vuelve a mostrar el estado por linea
- si falta aceptacion final y no hay ayuda de diseno, checkout bloquea la confirmacion
- si no hay archivo, la solicitud puede continuar como flujo comercial y el equipo indicara el siguiente paso

## Ayuda de diseno Ridaos

Microcopy base:

- `Selecciona esta opcion si quieres que revisemos o preparemos el archivo contigo antes de producir.`

Efectos:

- estado `needs-designer`
- la solicitud puede continuar
- carrito y checkout deben mostrar que el archivo queda pendiente de revision con Ridaos

## Eventos futuros para backend

Este sprint deja preparado el contrato para:

- persistir `acceptance`
- registrar auditoria de cambios de archivo
- versionar reuploads
- aprobar desde admin
- conectar emails transaccionales futuros
