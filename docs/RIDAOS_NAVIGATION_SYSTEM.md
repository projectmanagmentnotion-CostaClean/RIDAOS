# Ridaos Navigation System

## 1. Concepto

`Ridaos Command Navigation` define la navegacion publica premium de RidaosPrint.

La idea es un panel de control visual para exploracion comercial:

- desktop: barra fija compacta + command panel desplegable
- mobile: command drawer fullscreen
- tono visual: dark garage premium
- enfoque: acceso rapido a catalogo, DTI, rotulacion y preparacion de archivo

## 2. Estructura desktop

La barra desktop vive en:

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\PremiumNavBar.tsx](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\PremiumNavBar.tsx)

Bloques:

1. logo RidaosPrint
2. links primarios
3. trigger `Explorar`
4. CTA `Configurar DTI`
5. panel desplegable:
   - Productos
   - Rotulacion
   - Prepara tu produccion
   - bloque destacado DTI

## 3. Estructura mobile

El drawer mobile vive en:

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\MobileCommandDrawer.tsx](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\MobileCommandDrawer.tsx)

Bloques:

1. header con cierre
2. CTA principal DTI
3. cards tactiles principales
4. secciones:
   - Productos
   - Rotulacion
   - Recursos
5. footer corto de contexto

## 4. Fuente de datos

La data de navegacion vive en:

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\navigationData.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\navigationData.ts)

Grupos:

- `primaryLinks`
- `productLinks`
- `serviceLinks`
- `resourceLinks`
- `featuredLinks`
- `mobilePrimaryCards`
- `navigationMeta`

Cada item soporta:

- `label`
- `href`
- `description`
- `badge`
- `accent`
- `priority`
- `matchHrefs`
- `matchPrefixes`

## 5. Rutas publicas

Rutas principales conectadas:

- `#/catalogo`
- `#/producto/dti-por-metro`
- `#/catalogo/rotulacion`
- `#/upload`
- `#/guia`
- `#/producto/pegatinas-personalizadas`
- `#/producto/tarjetas-visita`
- `#/producto/flyers-personalizados`
- `#/producto/vinilo-impreso`
- `#/producto/textil-personalizado`
- `#/producto/rotulacion-furgonetas`

No se expone admin en la navegacion publica.

## 6. Motion y GSAP

La animacion de navegacion vive en:

- [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\useNavigationMotion.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\useNavigationMotion.ts)

Desktop:

- fade del backdrop
- panel con `y` corto y `scale` ligera
- stagger de items
- reveal de accent lines

Mobile:

- backdrop fade
- drawer con entrada corta
- stagger suave de CTA, cards y secciones

## 7. Reduced Motion

Si `prefers-reduced-motion` esta activo:

- se reduce la transformacion
- se mantiene opacidad simple
- no se deja contenido oculto
- la navegacion sigue siendo operativa

## 8. Accesibilidad

Reglas aplicadas:

- trigger desktop con `aria-expanded`, `aria-controls`, `aria-haspopup`
- trigger mobile con `aria-expanded`, `aria-controls`, `aria-haspopup`
- cierre por `Escape`
- cierre por click fuera en desktop
- cierre al navegar por cambio de hash
- drawer mobile con `role="dialog"` y `aria-modal="true"`
- foco devuelto al trigger al cerrar por interaccion de cierre
- links reales `<a>`

## 9. Z-index y convivencia

La navegacion convive con:

- `PremiumCursor`
- live toasts
- confirmation dialogs
- success modal
- cinematic overlays

Regla:

- la navegacion queda por encima del contenido normal
- no pisa modales criticos ni toasts
- se cierra al cambiar de ruta

## 10. Como anadir un link

1. abrir [C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\navigationData.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\navigationData.ts)
2. anadir el item al grupo correcto
3. definir `href`, `description` y `accent`
4. completar `matchHrefs` o `matchPrefixes` si necesita estado activo correcto
5. evitar meter listas nuevas dentro de JSX

## 11. Que no hacer

- no hardcodear listas grandes en `App.tsx`
- no enlazar rutas admin desde la capa publica
- no anadir links sin alias o ruta real
- no usar animaciones lentas o invasivas
- no convertir el menu desktop en un drawer comprimido
- no convertir el mobile en un mega menu de escritorio
