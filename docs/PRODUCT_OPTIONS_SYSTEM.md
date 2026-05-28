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
- no duplicar configuradores en catalogo ni en landings de categoria
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
- si aparece `undefined`, ids tecnicos o labels pegados, se considera regression

## QA minima

- verificar `#/producto/tarjetas-visita`
- verificar `#/producto/flyers-personalizados`
- revisar sticky summary, carrito y checkout basico
- confirmar que DTI, pegatinas, vinilo, rotulacion y textil siguen con grupos propios

## Checklist QA validado

- tarjetas: `Esquinas redondeadas` + `Texturizado especial` + `Soft touch` + `Foil oro` + `Anverso y reverso` + `Ayuda con archivo`
- flyers: `A3` + `Horizontal` + `Dos caras` + `300 g rigido` + `Soft touch` + `Ayuda con archivo`
- carrito y checkout deben conservar esas labels sin `undefined`, sin keys tecnicas y sin separadores corruptos
- las guias de plantilla no deben mostrar etiquetas internas como `PRINT_TEMPLATE_GUIDES`
