# Ridaos Navigation System

## 1. Objetivo

La navegacion publica de RidaosPrint queda cerrada con dos experiencias distintas:

- desktop: barra fija premium con exploracion desplegable
- mobile: drawer premium de pantalla casi completa

La prioridad es mobile-first, dark garage y claridad comercial.

## 2. Labels finales

Textos visibles aprobados:

- desktop trigger: `Explorar`
- mobile trigger: `Menu`
- mobile dialog title: `Menu`
- CTA principal: `Configurar DTI`

Textos prohibidos en UI publica:

- `Command`
- `COMMAND`
- `Ridaos Command`
- `debug`
- `mock`
- `internal`
- `experimental`
- `prototype`
- `dev`
- cualquier copy que suene a sistema, entorno interno o produccion

## 3. Iconografia

Archivo:

- [NavigationIcons.tsx](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\NavigationIcons.tsx)

Reglas:

- iconos SVG propios
- estilo fino y discreto
- mismo lenguaje visual en desktop y mobile
- se usan solo cuando aportan orientacion real
- el panel desktop y las listas secundarias mobile deben priorizar tipografia, aire y acentos lineales
- `aria-hidden` cuando son decorativos

Asignaciones activas:

- Subir archivo: upload
- Explorar: acento de exploracion sutil
- Menu: lineas premium
- Cerrar: `X` limpia

Iconos eliminados del cierre final:

- iconos repetidos por cada producto del panel desktop
- iconos secundarios del drawer mobile
- iconos decorativos en cards principales cuando la jerarquia funciona mejor con linea de acento
- icono de la CTA principal cuando ensucia la lectura

## 4. Desktop final

Archivos:

- [PremiumNavBar.tsx](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\PremiumNavBar.tsx)
- [DesktopCommandMenu.tsx](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\DesktopCommandMenu.tsx)

Desktop mantiene:

- logo
- links principales limpios; solo `Subir archivo` conserva icono funcional
- trigger `Explorar`
- CTA `Configurar DTI`
- panel desplegable con productos, rotulacion y recursos

No se comprime en formato mobile.

## 5. Mobile final

Archivo:

- [MobileCommandDrawer.tsx](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\MobileCommandDrawer.tsx)

Header exterior:

- logo
- boton `Menu`

Drawer:

1. header sticky con logo, `Menu` y cierre
2. CTA principal `Configurar DTI`
3. cards tactiles:
   - DTI por metro
   - Rotulacion
   - Catalogo
   - Subir archivo
4. secciones:
   - Productos
   - Recursos
5. footer:
   - `Impresion, rotulacion y DTI con revision tecnica.`

## 6. Fuente de datos

Archivo:

- [navigationData.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\navigationData.ts)

Grupos activos:

- `primaryLinks`
- `productLinks`
- `serviceLinks`
- `resourceLinks`
- `featuredLinks`
- `mobilePrimaryCards`
- `mobileProductLinks`
- `mobileResourceLinks`
- `navigationMeta`

Cada item soporta `icon` para mantener consistencia entre desktop y mobile.

Regla actual:

- el dato puede soportar `icon`, pero el render final solo lo usa en puntos funcionales y no en todas las listas

Guardas de implementacion:

- las listas del panel y del drawer usan claves estables por `href + label`
- no reutilizar `href` como `key` unico si el mismo destino aparece en grupos distintos
- las PDP del catalogo deben marcar `Catalogo` como activo cuando no pertenecen a `DTI`, `Rotulacion` o `Subir archivo`

## 7. Motion y GSAP

Archivo:

- [useNavigationMotion.ts](C:\Users\USUARIO\Documents\ridaosprint-pro\src\features\navigation\useNavigationMotion.ts)

Desktop:

- backdrop fade
- panel con fade, `y` corto y `scale` sutil
- stagger corto de items

Mobile:

- backdrop fade
- drawer `y: 24 -> 0`
- stagger corto de CTA, cards y secciones

Reglas:

- sin rebotes
- sin overshoot
- reduced motion simple
- si GSAP falla, el drawer no debe quedar invisible

## 8. Accesibilidad

Obligatorio:

- trigger desktop real `button`
- trigger mobile real `button`
- cierre mobile real `button`
- `aria-expanded`
- `aria-controls`
- `aria-haspopup`
- drawer con `role="dialog"` y `aria-modal="true"`
- cierre por `Escape`
- cierre por backdrop
- foco visible
- foco devuelto al trigger al cerrar
- links no focusables cuando el drawer esta cerrado

## 9. Scroll Lock y Safe Area

Con el menu mobile abierto:

- el `body` se bloquea
- el scroll vive dentro del drawer
- se respetan `safe-area-inset-top` y `safe-area-inset-bottom`
- los toasts se desactivan visualmente

Al cerrar:

- se restaura el body
- no queda scroll bloqueado

## 10. QA final

Breakpoints obligatorios:

1. `390px`
2. `430px`
3. `768px`

Checklist mobile:

- header estable
- `Menu` visible
- drawer abre y cierra
- CTA visible
- cards con aire
- scroll interno correcto
- cierre por `X`
- cierre por backdrop
- cierre por `Escape`
- cierre al navegar

Checklist desktop:

- `Explorar` abre el desplegable
- click fuera cierra
- `Escape` cierra
- CTA `Configurar DTI` funciona
- no aparece `Command`
- iconos no saturan el header ni el panel

Checklist storefront post-nav:

- las PDP de pegatinas, tarjetas, flyers, vinilo y textil mantienen `Catalogo` activo
- no aparecen warnings de claves duplicadas en la navegacion
- el drawer mobile limpia `body[data-mobile-nav-open]` al navegar y al cerrar
- backdrop desktop y mobile no dejan capas colgadas
- no deben aparecer labels pegados tipo `TituloDescripcion` dentro del panel o drawer
