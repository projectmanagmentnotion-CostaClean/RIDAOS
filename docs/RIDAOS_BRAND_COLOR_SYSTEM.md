# RidaosPrint - Brand Color System

## 1. Direccion general

RidaosPrint debe respirar una identidad:

- oscura
- urbana
- premium
- energetica
- profesional

La referencia no es un ecommerce generico ni una interfaz gamer. La base visual es garage urbano exclusivo: negro profundo, grafito, ladrillo oscuro y acentos de marca muy controlados.

## 2. Paleta canonica

### Base dark

| Token | Hex | Uso |
| --- | --- | --- |
| `black` | `#050505` | fondo principal, shell, base del storefront |
| `blackSoft` | `#090A0B` | fondos interiores, overlays oscuros |
| `charcoal` | `#101113` | cards, cabeceras, modales |
| `graphite` | `#181A1D` | paneles, configuradores, bloques de apoyo |
| `graphiteSoft` | `#202327` | hover, tarjetas secundarias, admin |
| `brickDark` | `#171111` | profundidad editorial, fondos garage |
| `brickMuted` | `#231617` | soporte secundario, mezcla con grafito |

### Texto

| Token | Hex | Uso |
| --- | --- | --- |
| `softWhite` | `#F4F4F1` | titulos y CTA sobre oscuro |
| `offWhite` | `#E7E3DA` | texto secundario premium |
| `mutedText` | `#A9A39A` | ayudas, labels, meta |
| `subtleText` | `#706B66` | texto muy secundario, estados suaves |

### Bordes

| Token | Valor | Uso |
| --- | --- | --- |
| `borderDark` | `rgba(255,255,255,0.08)` | borde base |
| `borderSoft` | `rgba(255,255,255,0.12)` | hover, cards activas suaves |
| `borderStrong` | `rgba(255,255,255,0.18)` | separacion fuerte o estados destacados |

### Marca

| Token | Hex aproximado | Uso |
| --- | --- | --- |
| `neonGreen` | `#D9FF00` | CTA principal, selected state, highlights |
| `neonPink` | `#F014D8` | premium/editorial, tags especiales, detalles |
| `cyan` | `#1AD9E2` | info tecnica, prepress, apoyo visual, secondary accents |

### Estados

| Token | Hex | Uso |
| --- | --- | --- |
| `success` | `#B8FF7A` | acciones correctas, confirmacion, exito |
| `warning` | `#D99A32` | avisos sobrios, no error |
| `error` | `#C95A68` | errores y acciones destructivas |
| `info` | `#69E5F1` | mensajes informativos, revision tecnica |

## 3. Regla 80 / 15 / 5

- `80%` base dark: negro, charcoal, grafito
- `15%` grises controlados y ladrillo oscuro
- `5%` acentos verdes, fucsia y cyan

Si una pantalla parece “neon first”, esta mal calibrada.

## 4. Reglas de uso

### Negro / charcoal

Usar para:

- fondos principales
- secciones
- shells
- cards grandes
- modales

### Ladrillo oscuro

Usar para:

- profundidad
- bloques garage
- zonas editoriales
- transiciones visuales

### Verde fluor

Usar para:

- CTA principal
- opciones seleccionadas
- highlights clave
- precio estimado destacado
- confirmaciones positivas

### Fucsia

Usar para:

- acento editorial
- premium finishes
- piezas especiales
- glow puntual

No usarlo para parrafos largos ni para errores.

### Cyan

Usar para:

- informacion tecnica
- prepress
- revision de archivo
- microdetalles
- secondary CTA

## 5. Botones y CTA

### CTA principal

- fondo verde de marca o dark con borde verde segun contexto
- texto muy legible
- glow corto y controlado

### CTA secundario

- base dark o transparente
- borde suave
- texto blanco o cyan

### CTA especial

- puede introducir fucsia o mezcla fucsia/cyan
- nunca debe competir con el CTA principal sistematicamente

### Destructivos

- rojo sobrio
- sin usar fucsia como error

## 6. Configuradores

### Regla visual

- fondo: graphite / charcoal
- borde base: blanco muy sutil
- selected state: verde fluor + borde visible
- info tecnica: cyan
- premium finish: fucsia puntual
- warning: ambar sobrio
- error: rojo profundo

### No hacer

- depender solo del color para selected state
- usar fucsia para focus general
- usar cyan electrico en bloques largos de texto

## 7. Storefront por zona

### Home

- negro profundo
- ladrillo oscuro sutil
- DTI con verde + cyan
- rotulacion con verde + fucsia + cyan controlados

### Catalogo

- familias destacadas sobre base oscura
- DTI y rotulacion con mas energia
- resto de familias con acentos segun contenido, sin romper sistema

### Categorias

- hero oscuro con un acento dominante por familia
- beneficios y chips con lectura limpia

### PDPs

- mismo sistema comun
- personalidad por producto a traves del accent y del visual, no por cambiar toda la paleta

## 8. Admin

Admin mantiene un look operativo:

- menos artistico que storefront
- mas graphite/charcoal
- accents funcionales
- evitar glows innecesarios

## 9. Documentos print-safe

Los documentos no deben heredar el dark mode del storefront.

Reglas:

- fondo blanco
- texto negro/gris
- acento de marca muy contenido
- prioridad absoluta a legibilidad e impresion

## 10. Que no hacer

- no convertir la UI en look gamer
- no saturar todas las cards con neon
- no usar fucsia en texto pequeno
- no usar verde fluor sobre fondos brillantes sin contraste
- no meter glows debajo de parrafos largos
- no usar fondos blancos en assets del storefront salvo necesidad fotografica puntual

## 11. Implementacion actual

Fuente canonica en codigo:

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\brand\brandTokens.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\brand\brandTokens.ts)

Variables CSS principales:

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\App.css](C:\Users\USUARIO\Documents\ridaosprint-pro\src\App.css)

Aplicacion visible:

- storefront
- configuradores
- live feedback
- admin operativo

## 12. Checklist rapida para diseno

- fondo oscuro primero
- verde como accion principal
- fucsia solo en detalle premium
- cyan para tecnico y apoyo
- contraste comprobado sobre negro
- no exportar assets con glow quemado
- no usar blancos planos fuera de documentos o necesidades concretas
