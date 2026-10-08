# Ingesta — CorelDRAW, fotografías y archivos de impresión

## Dos familias de archivo que nunca se confunden

**A. Fotografía de referencia de vehículo:** color, forma, versión; preferible vehículo limpio y sin marcas; se usa para generar/contrastar geometría. **B. Arte de rotulación:** SVG/PNG/JPG y derivados del archivo CorelDRAW; se aplica DESPUÉS, nunca se redibuja con IA.

## Entrada por zona

| Zona | Mínimo | Recomendación |
|---|---|---|
| Izquierda | 1 arte | Frontal con orientación marcada |
| Derecha | 1 arte | No espejar texto; arte independiente |
| Trasera | 1 arte | Confirmar ventanas, matrícula y portones |
| Capó | 1 arte/logotipo | Revisión de proyección sobre doble curvatura |
| Frontal | Opcional | No aplicar sobre lunas/ópticas |
| Techo | Normalmente ausente | Base neutra; propuesta conceptual en revisión |

## Orden recomendado de archivos

1. SVG con fuentes convertidas a trazos y recursos incrustados cuando tenga sentido.
2. PNG con transparencia para diseños compuestos o bitmaps; entregar alta resolución.
3. JPG de calidad alta para fondos fotográficos completos, sin transparencia.
4. EPS/PDF desde CorelDRAW se aceptan como **fuente**; requieren conversión probada y segura en un worker antes de usarse como textura web.
5. CDR se conserva opcionalmente como original; **no se declara procesable en navegador ni compatible directamente**.

## Reglas de conversión

- Validar tipo real/estructura, no confiar en extensión; límites configurables de bytes/píxeles/megapíxeles.
- Vector → raster para texturas por zona según UV y zoom, con muestras de aliasing; mantener fuente original para regenerar resoluciones.
- Respetar transparencia/premultiplicación de alpha y perfil de color; usar representación web sRGB y registrar conversiones. El archivo de producción mantiene su perfil original.
- Prohibido recomponer tipografía/logos mediante modelo generativo, aplicar espejos no autorizados o autocompletar palabras.
- Exportaciones web y originales separados. No usar el GLB de presentación como archivo listo para corte, impresión ni medidas exactas.
- Normalización segura de SVG (scripts, enlaces externos, entidades) y PDF/EPS en procesos aislados.

## Calidad mínima de la captura de referencia

- 4–8 fotografías consistentes y nítidas, buena luz difusa, bajo paralaje extremo; vehículo completo y sin recortes; cubrir lateral izq/der, frontal 3/4, trasero 3/4 y vista trasera/frontal.
- Registrar distancia focal aproximada si está disponible; evitar gran angular extremo, motion blur y perspectiva imposible.
- Marca, modelo, año, batalla, techo, número de puertas y color; datos OEM validados cuando sea posible.
- Referencias del cliente con permisos de uso; no incluir matrículas, personas ni datos identificativos públicos en landing.

## Techo conceptual

«Sin arte de techo» es un estado válido. Por defecto pintar con el color base del vehículo. Si se ofrece logo o patrón automático, mostrar el chip «Propuesta conceptual de techo — pendiente de confirmación» y no incluirlo en aprobación para producción salvo indicación explícita.
