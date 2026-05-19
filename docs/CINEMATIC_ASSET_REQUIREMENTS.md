# Requisitos provisionales de assets para la home cinematografica

Esta lista prepara la fase visual final del sistema cinematografico de la home. No activa assets reales todavia.

## 1. textile-hoodie-transparent

- Escena: `TEXTILE_DTF_TRANSITION`
- Archivo esperado: `/assets/cinematic/textile-hoodie-transparent.webp`
- Formato recomendado: `WEBP`
- Fondo transparente: `si`
- Orientacion: `vertical / portrait`
- Tamano recomendado: `2400x3000 px`
- Notas de uso:
  - silueta limpia de sudadera o camiseta
  - sin fondo
  - buen volumen en mangas y cuello
  - pensado para moverse sobre el bloque foundation
- Prioridad: `alta`

## 2. dtf-roll-transparent

- Escena: `HERO_CINEMATIC`
- Archivo esperado: `/assets/cinematic/dtf-roll-transparent.webp`
- Formato recomendado: `WEBP`
- Fondo transparente: `si`
- Orientacion: `horizontal`
- Tamano recomendado: `2600x1600 px`
- Notas de uso:
  - detalle de rollo DTF o material impreso
  - sirve como profundidad secundaria, no como protagonista
- Prioridad: `media`

## 3. wrap-car-transparent

- Escena: `VEHICLE_WRAP_TRANSITION`
- Archivo esperado: `/assets/cinematic/wrap-car-transparent.webp`
- Formato recomendado: `WEBP`
- Fondo transparente: `si`
- Orientacion: `horizontal`
- Tamano recomendado: `3200x1800 px`
- Notas de uso:
  - coche lateral o tres cuartos
  - sin fondo
  - dejar suficiente aire para que no tape CTAs ni texto en tablet/mobile
- Prioridad: `alta`

## 4. print-detail-transparent

- Escena: `PRODUCTION_DETAIL_TRANSITION`
- Archivo esperado: `/assets/cinematic/print-detail-transparent.webp`
- Formato recomendado: `WEBP`
- Fondo transparente: `si`
- Orientacion: `horizontal`
- Tamano recomendado: `2600x1600 px`
- Notas de uso:
  - detalle de maquina, tintas, manos o acabado
  - textura rica para close-up editorial
- Prioridad: `media`

## 5. final-brand-object

- Escena: `FINAL_BRAND_REVEAL`
- Archivo esperado: `/assets/cinematic/final-brand-object.webp`
- Formato recomendado: `WEBP`
- Fondo transparente: `si`
- Orientacion: `cuadrada`
- Tamano recomendado: `2200x2200 px`
- Notas de uso:
  - objeto o composicion premium de cierre
  - puede ser logo-objeto, packshot o detalle de material
  - debe convivir bien con el CTA final
- Prioridad: `alta`

## Recomendaciones generales

- Exportar a `WEBP` con transparencia real cuando aplique.
- Mantener bordes limpios para que el motion con `mix-blend-mode` y overlays suaves no genere halos.
- Evitar fondos integrados; la composicion ya los aporta con el overlay cinematografico.
- Preparar versiones ligeras para tablet/mobile si alguna escena final lo exige.
