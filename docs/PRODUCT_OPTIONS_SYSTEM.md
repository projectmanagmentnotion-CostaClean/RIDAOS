# Product Options System

## Objetivo

Este documento fija las reglas del configurador storefront para que cada PDP tenga un flujo propio, legible y sin mezclar opciones entre familias.

## Archivos clave

- [productOptionDefinitions.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\product-options\data\productOptionDefinitions.ts)
- [productOptionPricing.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\product-options\pricing\productOptionPricing.ts)
- [ProductExperiencePage.tsx](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\products\product-detail\ProductExperiencePage.tsx)
- [ConfiguratorFieldRenderer.tsx](C:\Users\USUARIO\Documents\ridaosprint-pro\src\components\ConfiguratorFieldRenderer.tsx)
- [catalogCartAdapter.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\catalog\adapters\catalogCartAdapter.ts)

## Reglas de producto

- cada PDP canonica usa un configurador unico
- las rutas canonicas activas son:
- `#/producto/dti-por-metro`
- `#/producto/pegatinas-personalizadas`
- `#/producto/tarjetas-visita`
- `#/producto/flyers-personalizados`
- `#/producto/vinilo-impreso`
- `#/producto/rotulacion-furgonetas`
- `#/producto/textil-personalizado`
- no duplicar configuradores en catalogo ni en landings de categoria
- prohibido crear CTAs, recomendaciones o fallbacks hacia `#/product-configurator`
- prohibido reutilizar rutas legacy como `#/producto/dtf`, `#/producto/papeleria`, `#/producto/materiales` o `#/producto/textil`
- el resumen sticky debe mostrar labels legibles, nunca ids tecnicos
- el carrito debe heredar labels finales desde los fields del configurador
- el pricing sigue siendo mock/local; no prometer cobro ni produccion real

## Tarjetas de visita

Ruta:

- `#/producto/tarjetas-visita`

Grupos activos:

- cantidad cerrada: `100`, `250`, `500`, `1000`, `2500`
- formato: `Estandar 85 x 55 mm`, `Europeo 90 x 50 mm`, `Compacto 85 x 50 mm`, `Cuadrada 55 x 55 mm`, `Esquinas redondeadas`
- papel y gramaje: `Estucado 350 g`, `Premium 400 g`, `Reciclado 300 g`, `Texturizado especial`
- laminado: `Sin laminado`, `Laminado mate`, `Laminado brillo`, `Soft touch`
- caras: `Solo anverso`, `Solo reverso`, `Anverso y reverso`
- acabado exclusivo: `Ninguno`, `Foil oro`, `Foil plata`, `Barniz 3D`
- revision: `Revision basica incluida`, `Revision avanzada`, `Ayuda con archivo`

Guardas:

- si se usa `Foil` o `Barniz 3D`, el sistema debe mostrar aviso de capa o reserva separada
- no mostrar variantes futuras como PVC si no estan soportadas comercialmente en esta fase

## Flyers y folletos

Ruta:

- `#/producto/flyers-personalizados`

Grupos activos:

- cantidad cerrada: `100`, `250`, `500`, `1000`, `2500`, `5000`
- formato: `A3`, `A4`, `A5`, `A6`, `DL 99 x 210 mm`
- orientacion: `Vertical`, `Horizontal`
- caras: `Una cara`, `Dos caras`
- papel y gramaje: `135 g estucado`, `170 g estucado`, `250 g premium`, `300 g rigido`, `Reciclado 170 g`
- acabado: `Sin acabado`, `Mate`, `Brillo`, `Soft touch`
- revision: `Revision basica incluida`, `Revision avanzada`, `Ayuda con archivo`

Guardas:

- no activar plegado mientras el producto siga representando flyers y folletos ligeros en el mismo PDP
- A5, A4 y A3 deben quedar explicados con microcopy visible en hints, no en labels interminables

## Pricing mock

- tarjetas: cantidad, formato, papel, laminado, acabado exclusivo, caras y revision alteran el total
- flyers: cantidad, formato, papel, acabado, caras y revision alteran el total
- DTI, pegatinas, vinilo, textil y rotulacion tambien deben traducir cualquier `value` tecnico a label comercial antes de renderizar el breakdown
- el breakdown del panel comercial debe usar labels de cliente, no keys internas como `coated-350`

## Resumen y carrito

- `ProductExperiencePage` no limita ya el resumen a cinco items cuando el producto necesita mas contexto comercial
- `catalogCartAdapter` convierte cada field en una linea legible para el carrito
- el objeto `artwork.acceptance` viaja desde el upload hasta carrito y checkout
- si hay archivo final, el cliente debe aceptarlo explicitamente o solicitar ayuda de diseno antes de cerrar la solicitud
- si aparece `undefined`, ids tecnicos o labels pegados, se considera regression

## Sistema de aceptacion de archivo

- el upload usa estados visibles: `no-file`, `uploaded`, `checking`, `needs-correction`, `needs-designer`, `ready-for-approval`, `client-approved`, `accepted-for-production`
- la comprobacion es inicial y orientativa; no se debe vender como certificacion tecnica completa
- `Foil oro`, `Foil plata` y `Barniz 3D` disparan advertencia de capa o pagina separada
- `Ayuda con archivo` debe mantener salida comercial clara y permitir continuar como solicitud con apoyo de Ridaos
- formatos recomendados por familia:
- tarjetas y flyers: PDF
- pegatinas: PDF, SVG, AI o EPS
- DTI: PNG limpio, PDF o AI
- vinilo y rotulacion: PDF, AI o EPS
- textil: PNG transparente, PDF o AI

## QA minima

- verificar `#/producto/tarjetas-visita`
- verificar `#/producto/flyers-personalizados`
- revisar sticky summary, carrito y checkout basico
- confirmar que DTI, pegatinas, vinilo, rotulacion y textil siguen con grupos propios

## QA validada en este sprint

- tarjetas: `2500 uds` + `Esquinas redondeadas` + `Texturizado especial` + `Soft touch` + `Anverso y reverso` + `Foil oro`
- tarjetas: variante paralela con `Foil plata`
- tarjetas: variante paralela con `Barniz 3D`
- flyers: `5000 uds` + `A3` + `Horizontal` + `Dos caras` + `300 g rigido` + `Soft touch`
- DTI: sin archivo, archivo recibido, archivo aceptado y ayuda de diseno solicitada
- pegatinas: troquel personalizado o `kiss cut` con salida a ayuda
- vinilo: archivo raster orientativo con mensaje de revision
- textil: recomendacion de PNG transparente o vector
- rotulacion: flujo comercial con ayuda de diseno y sin forzar checkout de pago

## Reglas de bloqueo comercial

- en productos directos o hibridos, el CTA principal queda bloqueado si hay archivo subido y falta aceptacion final sin ayuda de diseno
- en carrito se mantiene el estado visible por linea pero no se bloquea la navegacion
- en checkout se bloquea solo la confirmacion final cuando hay lineas con aceptacion pendiente y sin ayuda
- si no hay archivo, el flujo puede seguir como solicitud comercial cuando el producto lo permite

## Checklist de nuevos CTAs

- usar siempre `src/lib/navigation.ts` como fuente unica para rutas publicas y PDP
- si un CTA apunta a una familia de producto, resolver el PDP canonico correspondiente en lugar de inventar aliases
- si el destino no existe, redirigir a `#/catalogo` o a un PDP canonico; no dejar placeholders ni hashes legacy
- revisar carrito, discoverability, landings y docs antes de cerrar el cambio

## Checklist QA validado

- tarjetas: `Esquinas redondeadas` + `Texturizado especial` + `Soft touch` + `Foil oro` + `Anverso y reverso` + `Ayuda con archivo`
- flyers: `A3` + `Horizontal` + `Dos caras` + `300 g rigido` + `Soft touch` + `Ayuda con archivo`
- carrito y checkout deben conservar esas labels sin `undefined`, sin keys tecnicas y sin separadores corruptos
- las guias de plantilla no deben mostrar etiquetas internas como `PRINT_TEMPLATE_GUIDES`
