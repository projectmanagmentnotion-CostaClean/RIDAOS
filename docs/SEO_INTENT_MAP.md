# SEO Intent Map

Esta capa organiza la demanda real por intencion, entidad, localizacion y oportunidad long-tail.

## Fuentes de patron competitivo

- Pixartprinting:
  - https://www.pixartprinting.es/impresion-etiquetas/stickers-adhesivos/pegatinas-corte-completo/
  - https://www.pixartprinting.es/formato-grande/impresion-adhesivos-vinilicos/adhesivos-para-autos-motos/
  - https://www.pixartprinting.es/blog/como-hacer-folleto-eficaz/
- VistaPrint:
  - https://www.vistaprint.es/materiales-de-marketing
  - https://www.vistaprint.es/etiquetas-y-pegatinas
  - https://www.vistaprint.es/lonas-y-posteres/vinilos
- HelloPrint:
  - https://www.helloprint.es/canva
  - https://www.helloprint.es/formato-a4
- OnlinePrinters:
  - https://www.onlineprinters.es/%24WS/diedruckerei/shopdata/media/pim/04-aa/live/files/dataInfo/2c9ceb817c84b262017ca28d0b55753a.pdf?x=202111030744
  - https://www.onlineprinters.es/%24WS/diedruckerei/shopdata/media/pim/04-aa/live/files/dataInfo/2c9ceb8181a5f24901820219f3c062e6.pdf?x=202207181038

## Principios

- No trabajar keywords aisladas.
- Priorizar intencion, entidad y siguiente paso comercial.
- Capturar aliases reales como `DTI` sin romper la nomenclatura correcta `DTF`.
- Convertir FAQs en respuestas claras para Google, Bing y buscadores conversacionales.

## Keyword groups prioritarios

| Grupo | Termino principal | Intencion | Prioridad | Entidad | Localizacion |
| --- | --- | --- | --- | --- | --- |
| DTF por metro | DTF por metro | transactional / commercial / local | alta | dtf | Barcelona, Blanes, Girona, Costa Brava, Espana |
| Rotulacion comercial | Rotulacion de furgonetas | commercial / transactional / local | alta | rotulacion | Barcelona, Blanes, Girona, Costa Brava, Cataluna |
| Rotulacion local | Rotulacion furgonetas Barcelona | local / commercial | alta | rotulacion | Barcelona, Blanes, Girona, Costa Brava |
| Pegatinas personalizadas | pegatinas personalizadas | transactional / commercial / informational | alta | pegatinas | Barcelona, Girona, Espana |
| Vinilo comercial | vinilos comerciales | commercial / local / informational | alta | vinilo-comercial | Barcelona, Blanes, Girona, Costa Brava |
| Tarjetas empresa | tarjetas empresa | transactional / commercial / local | media | tarjetas | Barcelona, Girona, Espana |
| Flyers personalizados | flyers personalizados | transactional / commercial | media | flyers | Barcelona, Blanes, Girona, Espana |
| Gran formato | impresion gran formato | commercial / transactional / informational | media | gran-formato | Barcelona, Girona, Espana |

## Answer-style questions prioritarias

| Pregunta | Intencion | Prioridad | Entidad | Local |
| --- | --- | --- | --- | --- |
| Que diferencia hay entre DTI y DTF | informational / commercial | alta | dti | no |
| Cuanto cuesta rotular una furgoneta en Barcelona | commercial / local | alta | rotulacion | Barcelona |
| Que vinilo dura mas | informational / commercial | media | vinilo-comercial | no |
| Cuanto tarda una rotulacion comercial | commercial / local | alta | rotulacion | no |
| Puedo imprimir desde una foto | informational / commercial | media | gran-formato | no |
| Como preparar un archivo DTI | informational / commercial | alta | dti | no |
| Trabajais rotulacion en Blanes y Costa Brava | local / commercial | alta | rotulacion | Blanes / Costa Brava |
| Cuantas tarjetas de visita necesito para empezar | informational / commercial | media | tarjetas | no |

## Long-tail local

### Barcelona

- Rotulacion de furgonetas Barcelona
- Vinilos para vehiculos Barcelona
- Rotulacion comercial Barcelona
- Rotulacion integral Barcelona
- DTI Barcelona
- Impresion personalizada Barcelona

### Blanes

- Rotulacion de vehiculos Blanes
- Rotulacion de furgonetas Blanes
- Vinilos comerciales Blanes
- DTI Blanes

### Girona / Costa Brava

- Rotulacion comercial Girona
- Vinilos para empresas Girona
- Rotulacion de flotas Girona
- Rotulacion comercial Costa Brava
- DTI Costa Brava

### Espana

- DTI Espana
- Rotulacion de vehiculos Espana
- Impresion personalizada Espana

## Relacion entre entidades

- Rotulacion:
  - relacionado con vinilo comercial, branding, DTI para uniforme, pegatinas empresa y tarjetas empresa
- DTF:
  - relacionado con camisetas, sudaderas, uniformes, eventos y branding
- Tarjetas:
  - relacionado con flyers, pegatinas, papeleria corporativa y ventas presenciales
- Vinilo comercial:
  - relacionado con escaparates, senaletica, carteleria y rotulacion

## Oportunidades

- Capturar `DTI` como patron de busqueda, pero responder con estructura `DTF por metro`.
- Dominar rotulacion local con combinacion de:
  - ciudad
  - tipo de vehiculo
  - cobertura
  - uso comercial
- Conectar preprensa y plantillas con busquedas informacionales de alta confianza.
- Abrir puentes internos entre rotulacion, escaparates, senaletica, pegatinas y branding.

## Capa de discoverability

Archivos preparados:

- `src/features/discoverability/hubs/discoverabilityHubs.ts`
- `src/features/discoverability/related/relatedServices.ts`
- `src/features/discoverability/recommendations/upsellRules.ts`
- `src/features/discoverability/internal-links/internalLinkGraph.ts`
- `src/features/discoverability/local/localServiceHubs.ts`
- `src/features/discoverability/articles/relatedGuides.ts`

Objetivo:

- convertir keywords e intenciones en navegacion util
- unir hubs con related services, related products y guias
- crear upselling contextual sin meter copy artificial
