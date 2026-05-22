# PDF Engine Decision

## Objetivo

Preparar una interfaz unica para futuro PDF real sin activar todavia generacion real, librerias pesadas ni runtime server.

## Opciones evaluadas

### 1. Browser print

- Pros:
  - cero dependencias nuevas
  - calidad razonable para documentos operativos A4
  - reutiliza el `print_view` ya existente
  - coste tecnico minimo
- Contras:
  - no genera archivo PDF controlado por la app
  - depende del navegador y del dialogo del usuario
  - branding y paginacion menos deterministas
- Bundle:
  - impacto practicamente nulo
- Calidad A4:
  - buena para documentos operativos
- Branding:
  - aceptable con CSS print-safe
- Coste:
  - muy bajo

### 2. @react-pdf/renderer

- Pros:
  - control programatico de PDF desde React
  - buen modelado de layouts documentales
  - branding mas consistente
- Contras:
  - dependencia adicional relevante
  - curva de adaptacion
  - muchos layouts HTML no se reaprovechan tal cual
- Bundle:
  - medio/alto si entra en cliente
- Calidad A4:
  - alta
- Branding:
  - alta
- Coste:
  - medio

### 3. html2canvas/jsPDF

- Pros:
  - facil de conectar a vistas HTML existentes
  - rapido para prototipos
- Contras:
  - calidad irregular
  - texto rasterizado con facilidad
  - peor para tablas, cortes de pagina y A4 fino
- Bundle:
  - medio/alto
- Calidad A4:
  - media/baja
- Branding:
  - media
- Coste:
  - medio

### 4. Server-side Playwright/Puppeteer

- Pros:
  - calidad alta usando HTML/CSS reales
  - A4 y branding muy consistentes
  - ideal para documentos complejos
- Contras:
  - requiere runtime server
  - mayor coste operativo
  - colas, timeouts y observabilidad adicionales
- Bundle:
  - no impacta cliente principal
- Calidad A4:
  - alta
- Branding:
  - alta
- Coste:
  - medio/alto

### 5. API server PDF

- Pros:
  - separacion clara del frontend
  - centraliza la generacion
- Contras:
  - requiere backend real
  - implica contratos, auth y almacenamiento antes de tiempo
- Bundle:
  - sin impacto cliente relevante
- Calidad A4:
  - variable segun motor
- Branding:
  - variable
- Coste:
  - medio/alto

### 6. Edge function PDF

- Pros:
  - latencia potencialmente menor
  - despliegue distribuido
- Contras:
  - limitaciones de runtime
  - compatibilidad mas delicada para motores pesados
  - debugging mas duro
- Bundle:
  - sin impacto cliente relevante
- Calidad A4:
  - media/alta segun stack
- Branding:
  - media/alta
- Coste:
  - medio

## Recomendacion final para RidaosPrint

### Fase actual

- Mantener `browser_print` como engine activo.
- Conservar `print_view` como fallback operativo.
- No meter librerias PDF en el bundle cliente.

### Fase futura recomendada

- Para documentos operativos y reportes internos:
  - `server_pdf` con Playwright/Puppeteer o servicio equivalente.
- Para documentos pequenos puramente cliente, solo si hiciera falta:
  - evaluar `@react-pdf/renderer` en un chunk separado.

### Motivo

RidaosPrint ya tiene layouts documentales HTML y estilos print-safe. La evolucion mas limpia es:

1. contrato comun documental
2. `browser_print` hoy
3. `server_pdf` cuando exista backend real

Eso mantiene el bundle principal ligero y evita duplicar el trabajo de layout.
