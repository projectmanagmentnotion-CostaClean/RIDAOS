# Costes y capacidad — escenario de 4 furgonetas/mes

## Modelo de coste

**Coste total mensual adicional = API IA + almacenamiento/tráfico incremental + conversiones extra + licencias nuevas + tiempo de operación + eventual upgrade de GrowBig**.

**Coste inicial = horas de desarrollo, prototipado y QA + generación/corrección piloto + preparación de entorno.** Codex no elimina el coste de revisar ni de validar el código.

## Supuestos reales vs incógnitas

- GrowBig ya está contratado; coste de alojamiento adicional **potencialmente 0** dentro de límites (no implica capacidad infinita).
- Blender manual fuera del flujo; no comprar modelos comerciales como política del proyecto.
- Tripo solo un proveedor candidato. Precio API, créditos y condiciones de uso comercial se confirman en consola oficial antes de facturar.
- 4 vehículos por mes **no** equivalen a 4 generaciones: intentos/errores pueden multiplicar uso.
- La primera vez que aparece cada modelo/variante costará más; luego cache reutilizable **solo** si malla y zonas fueron aceptadas.
- Tráfico de GLB/texturas y coste de trabajo humano dependen fuertemente del tamaño y de visitantes.

## Fórmula por proyecto

    G = intentos_de_generacion × precio_real_por_intento
    P = horas_de_preparacion × coste_interno_por_hora
    S = GB_descargados + GB_guardados → precio_incremental
    C_proyecto = G + P + S + imprevistos
    C_mes = suma(C_proyecto para 4) + fijos_adicionales

Registrar el **precio mostrado por la API** antes de autorizar generación, y medir coste real por job. No asumir un mensual fijo de IA.

## Ejemplos ilustrativos NO TARIFAS

| Escenario | Supuesto | Lectura |
|---|---|---|
| Favorable | Mallas reutilizadas, 1–2 intentos por trabajo, poco ajuste | Coste variable bajo, domina tiempo operativo |
| Normal | 4 carrocerías distintas, 2–4 intentos y correcciones por proyecto | Coste de créditos y dedicación mayor |
| Adverso | IA falla o modelo inválido, uploads grandes y muchas regeneraciones | Riesgo de pérdida; activar stop y fallback 2D |

Antes de vender definir topes configurables: presupuesto por proyecto, número máximo de intentos, tamaño total de asset, cuota por mes y horas de revisión.

## KPI de piloto

- Éxito geometría = mallas aceptadas / mallas generadas.
- Fidelidad gráfica = errores de logo/texto observados en QA / zonas.
- Tiempo efectivo = desde subir archivos a publicación aceptada.
- Créditos por modelo válido y créditos desperdiciados por rechazo.
- Tiempo de carga móvil p50/p95 y peso de bundles.
- Reutilización por marca/modelo/versión.

## Umbral go/no-go económico

No construir flujo masivo si la tasa de mallas utilizables es insuficiente o la revisión por proyecto supera el valor comercial potencial. Primero medir 1 piloto y luego 4 proyectos reales controlados.
