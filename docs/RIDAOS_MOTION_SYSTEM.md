# RidaosPrint - Motion System

## 1. Principios

El motion de RidaosPrint sigue cuatro reglas:

- vender mejor, no distraer
- reforzar profundidad y ritmo
- mantener legibilidad y control
- respetar reduced motion

La referencia es scroll polish premium con identidad garage urbana. No se busca un comportamiento explosivo ni ornamental.

## 2. Donde se usa GSAP

### Storefront general

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\motion\scrollMotion.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\motion\scrollMotion.ts)
- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\motion\revealAnimations.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\motion\revealAnimations.ts)
- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\motion\useScrollMotion.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\motion\useScrollMotion.ts)
- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\motion\motionSelectors.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\motion\motionSelectors.ts)

### Cinematic home

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\motion\cinematic\useCinematicScroll.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\motion\cinematic\useCinematicScroll.ts)

### PDPs

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\products\product-detail\motion\useProductExperienceMotion.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\products\product-detail\motion\useProductExperienceMotion.ts)

### Motion base y sincronizacion con Lenis

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\lib\animations.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\lib\animations.ts)

## 3. Que anima el sistema reusable

### Reveal basico

- `fade + y`
- `duration` entre `0.88` y `0.96`
- `ease: power3.out`
- entrada por viewport, no por timer global

### Stagger de cards

- cards y paneles con `0.08` a `0.10`
- batches pequenos para no multiplicar triggers

### Parallax

- solo visuales grandes
- `yPercent` bajo
- scrub suave
- no se aplica a formularios ni botones de compra

### Overlay reveal

- beams
- glows
- grids visuales

## 4. Selectores disponibles

### Storefront

- hero: `data-animate="hero"`
- reveal: `data-animate="reveal"`
- panel: `data-animate="panel"`
- parallax: `data-parallax`
- overlays: `data-overlay-reveal`

### PDP

- reveal: `data-product-reveal`
- visuales internos de hero y galeria con `data-parallax`

## 5. Reglas de ScrollTrigger

- no usar triggers por cada control de formulario
- preferir `ScrollTrigger.batch()` para listas y grids
- scrub solo en visuales y overlays grandes
- no pinning nuevo en configuradores, carrito o checkout
- sincronizar con Lenis cuando haya scroll suave activo

## 6. Reduced motion

Si `prefers-reduced-motion` esta activo:

- no se crean reveals ni parallax no esenciales
- el contenido queda visible sin depender de JS
- hover y focus basicos siguen funcionando
- no se dejan elementos a `opacity: 0`

## 7. Que no animar

- inputs
- selects
- steppers de cantidad
- CTA de compra con transformaciones agresivas
- checkout y cart con scrub
- modales criticos

## 8. Performance

- GSAP ya existe en el proyecto; no se anaden dependencias
- se agrupan reveals con `batch`
- se limita `will-change` a visuales concretos
- no se usan blur o filtros pesados en masa durante scroll
- cleanup por `context.revert()` al desmontar

## 9. Zonas revisadas

- home
- catalogo
- categorias
- PDPs
- hero visuals
- gallery frames
- sticky summary
- upload/prepress
- cart/checkout en polish visual, no con motion invasivo

## 10. Uso rapido

### Storefront page

1. marcar secciones con `data-animate`
2. marcar visuales con `data-parallax`
3. marcar overlays con `data-overlay-reveal`
4. inicializar `initStorefrontRevealAnimations(scope)`

### PDP

1. usar `data-product-reveal`
2. marcar visuales internos con `data-parallax`
3. usar `useProductExperienceMotion(scope)`

## 11. Que no hacer

- no duplicar sistemas de reveal por pagina
- no dejar un segundo ScrollTrigger compitiendo sobre el mismo nodo sin motivo
- no esconder contenido con CSS esperando a que JS lo revele
- no convertir el storefront en una coreografia continua
