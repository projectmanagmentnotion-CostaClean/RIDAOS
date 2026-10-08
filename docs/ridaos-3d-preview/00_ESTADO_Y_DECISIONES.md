# Estado, restricciones y decisiones

## Situación real en este hito

- DOCUMENTADO: visión, arquitectura objetivo, reglas de diseño, planes de validación, seguridad y costes.
- NO IMPLEMENTADO: interfaz, editor, API, generación automática, modelo piloto, shaders, publicación y aprobación.
- NO COMPROBADO: que Tripo u otro motor genere un modelo de vehículo exacto de año/versión, UV válidas para rotulación y malla apta para reflejos premium.
- NO CONFIGURADO: proyecto SiteGround, subdominio, secretos, base de datos de 3D Preview o despliegue.
- NO AUTORIZADO POR ESTA DOCUMENTACIÓN: cambios en producción, gastos automáticos ni uso de material del cliente sin permisos.

## Restricciones innegociables

1. No exigir Blender en el flujo del operador.
2. No comprar bibliotecas 3D como dependencia obligatoria.
3. Cualquier generación IA debe ser inspeccionable y regenerable.
4. Letras, logos y colores deben proceder del archivo original y no de texturizado generativo.
5. Aprobación vinculada a una versión inmutable del diseño.
6. Publicaciones privadas mediante control de acceso; no basta un slug fácil de adivinar.
7. Uso de GrowBig solo cuando su plan real y sus límites estén verificados desde el panel.
8. Local-first; no desplegar antes de QA.

## Decisiones fijadas (D)

| ID | Decisión | Estado |
|---|---|---|
| D-01 | IA como generador inicial de geometría; piloto con Tripo, proveedor intercambiable | Elegido para experimentar |
| D-02 | Arte de rotulación separado de textura/carrocería | Fijado |
| D-03 | Editor web especializado por zonas, no herramienta de modelado universal | Fijado |
| D-04 | Showroom fijo: entorno/luces inmóviles; vehículo rotatorio | Fijado |
| D-05 | React/TypeScript/R3F/Three.js para visor y editor | Recomendado |
| D-06 | SiteGround GrowBig como host objetivo; sin nuevo Vercel/Supabase por defecto | Recomendado |
| D-07 | Techo neutro por defecto; nunca inventar producción final sin aceptación | Fijado |
| D-08 | Aislamiento del proyecto respecto a web RIDAOS actual | Fijado |

## Hipótesis que bloquean avanzar a producto vendido (H)

- H-01: malla IA permite aislar carrocería y excluir cristales, juntas, neumáticos.
- H-02: decal/mapeado funciona en ambas caras, capó y trasera sin estirar identidad gráfica.
- H-03: apariencia de reflejo hexagonal consistente al girar en iPhone de gama media.
- H-04: modelo descargado desde proveedor permite uso comercial y publicación interactiva.
- H-05: GrowBig soporta el servidor elegido, tareas asíncronas, base de datos y almacenamiento permanente del volumen previsto.
- H-06: calidad visual al zoom cumple criterios sin obligar retoques manuales en Blender.

Las hipótesis se resuelven con pruebas y evidencia, no con promesas.

## Cadena de aprobación de alcance

Documento → prototipo local → prueba de un vehículo → QA visual y funcional → pruebas de hosting → autorización explícita de publicación → cliente.
