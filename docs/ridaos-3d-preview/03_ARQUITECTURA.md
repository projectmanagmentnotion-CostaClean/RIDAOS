# Arquitectura propuesta — local-first, costes mínimos

## Contexto del repo

El repo RIDAOS actual usa **React + Vite + TypeScript** y contiene un directorio supabase. Esta documentación **no modifica ni migra** su código. La aplicación 3D debe quedar en un límite desplegable propio; decisión posterior: workspace /apps/3d-preview o repositorio dedicado con vínculo documental.

## Diagrama lógico

    CorelDRAW + fotografías
             |
      Navegador / Admin
             |
       UI React + R3F ───── visor Three.js (render en GPU cliente)
             |
         API Node.js
          /   |   \
      Postgres | almacenamiento privado
               |
        Cola de trabajos (persistente)
               |
       Adaptador proveedor IA (Tripo piloto)
               |
        Modelo 3D descargado, validado
               |
        Procesador de malla/texturas automatizado
               |
       Versiones + publicador privado

## Tecnología elegida / condicionada

- **Frontend/editor/cliente:** React, TypeScript, React Three Fiber, drei, Three.js. Reutilizar stack Vite existente solo si separación de despliegues queda garantizada.
- **Servidor:** Node.js (API ligera, autenticación, uploads, proxy de generación IA, publicación). Fastify o Express como opción inicial; no introducir Next.js por defecto solo para publicar un visor.
- **DB:** PostgreSQL administrado por SiteGround, si la prueba real de conectividad y backup pasa.
- **Almacenamiento:** privado para fuentes/modelos, variante optimizada de entrega para visitas; probar persistencia y cuotas antes de elegir disco local. Si falla, registrar ADR para objeto externo.
- **IA:** adaptador de proveedor, cola persistente, control de gastos y reintentos; Tripo candidato no dependencia irreversible.
- **Render:** navegador; no GPU en hosting para cada movimiento del usuario.
- **Dev:** localhost + mocks deterministas; no requiere API IA ni hosting durante iteración de UI.

## Contratos entre componentes

1. MediaIngest recibe original y produce archivos preview verificables, hash y metadatos; nunca sobrescribe original.
2. Generator acepta fotos limpias y configuración; produce jobID + licencia/atribución/modelo/estado, o fallo.
3. MeshPreflight valida malla y orientaciones; solo modelos aceptados llegan a colocación.
4. WrapPlacement recibe asset por zona, máscara/posición y referencia de malla; nunca altera arte original.
5. PreviewRenderer consume modelo + composición + entorno versionados.
6. Publisher produce snapshot inmutable de esos IDs y controla acceso del cliente.
7. Feedback referencia publicación y hash de composición, no proyecto mutable.

## Diseño de cómputo

- El proveedor IA realiza generación pesada.
- El navegador realiza interacción/render; el servidor no hace ray tracing remoto.
- Procesos automatizados de limpieza/optimización se hacen preferentemente en local/worker transitorio; en GrowBig **solo** si límites de memoria, CPU, ejecución y almacenamiento lo permiten.
- API no permanece bloqueada esperando generación: inicia job y consulta estado con frecuencia y backoff controlados.
- Cache por hash de geometría/arte/composición y variantes para evitar pagar/convertir lo mismo dos veces.

## Riesgo principal de arquitectura

El modelo generado puede no tener topología, normales, separación de carrocería, UV ni medidas fieles. El sistema debe permitir **rechazarlo**. Sin modelo aceptado, no se publica un mockup que finja precisión de rotulación.
