# Topical Authority Map

Este mapa define hubs, clusters y enlaces internos sugeridos para construir autoridad semantica sin inflar copy.

## Hubs principales

### Hub 1: Rotulacion comercial

- Hub URL: `#/servicios/rotulacion`
- Objetivo:
  - capturar demanda comercial y local sobre vehiculos de empresa, furgonetas, flotas, escaparates y senaletica
- Clusters:
  - rotulacion local
  - vinilo comercial
  - escaparates
  - flotas comerciales
  - branding de empresa

Enlaces internos sugeridos:

- Rotulacion -> Carteleria
- Rotulacion -> Portafolio
- Rotulacion -> Contacto
- Rotulacion -> Materiales
- Rotulacion -> Pegatinas empresa
- Rotulacion -> Tarjetas empresa

### Hub 2: DTF por metro

- Hub URL: `#/producto/dtf`
- Objetivo:
  - capturar busquedas transaccionales y de preparacion tecnica sobre DTF por metro
- Clusters:
  - DTI vs DTF
  - preparacion de archivo
  - uniformes empresa
  - textil promocional
  - produccion urgente

Enlaces internos sugeridos:

- DTF -> Guia de archivos
- DTF -> Textil
- DTF -> Uniformes empresa
- DTF -> Contacto

### Hub 3: Impresion comercial basica

- Hub URL: `#/catalogo`
- Objetivo:
  - servir como entrada a tarjetas, flyers, pegatinas y gran formato
- Clusters:
  - tarjetas empresa
  - flyers personalizados
  - pegatinas personalizadas
  - carteleria
  - material de branding

Enlaces internos sugeridos:

- Catalogo -> Papeleria
- Catalogo -> Materiales
- Catalogo -> Pegatinas
- Catalogo -> Rotulacion

## Cluster map

| Cluster | Hub | Paginas soporte | Preguntas |
| --- | --- | --- | --- |
| rotulacion-hub | `#/servicios/rotulacion` | `#/servicios/carteleria`, `#/portafolio`, `#/contacto`, `#/catalogo` | coste, plazo, cobertura local |
| dtf-hub | `#/producto/dtf` | `#/guia`, `#/catalogo`, `#/contacto` | DTI vs DTF, preparar archivo |
| print-basics-hub | `#/catalogo` | `#/producto/papeleria`, `#/producto/materiales`, `#/guia` | imprimir desde foto, cantidad tarjetas |

## Relaciones entre servicios

- Rotulacion <-> Vinilo comercial <-> Escaparates <-> Senaletica
- DTF <-> Textil <-> Uniformes <-> Branding
- Tarjetas <-> Flyers <-> Pegatinas <-> Papeleria corporativa
- Gran formato <-> Carteleria <-> Eventos <-> Punto de venta

## Reglas de enlazado interno

- Cada hub debe enlazar como minimo a:
  - una guia tecnica
  - una pagina comercial relacionada
  - una prueba visual o portafolio
  - una accion de contacto o presupuesto
- Cada FAQ importante debe poder enlazar a:
  - un producto
  - un servicio
  - una guia de archivo o plantilla
- No usar enlaces internos genericos sin contexto. El anchor debe reflejar la intencion.

## Discoverability engine

La capa operativa para aplicar este mapa vive en:

- `src/features/discoverability/hubs/discoverabilityHubs.ts`
- `src/features/discoverability/related/relatedServices.ts`
- `src/features/discoverability/recommendations/upsellRules.ts`
- `src/features/discoverability/internal-links/internalLinkGraph.ts`
- `src/features/discoverability/local/localServiceHubs.ts`
- `src/features/discoverability/articles/relatedGuides.ts`

Integraciones actuales:

- `src/pages/Catalogo.tsx`
- `src/features/products/product-detail/ProductExperiencePage.tsx`

## Prioridad editorial

1. Rotulacion comercial local
2. DTF / DTI por metro
3. Pegatinas y vinilo comercial
4. Tarjetas y papeleria de empresa
5. Gran formato y senaletica
