import { accesoriosEntries } from '../products/accesorios'
import { dtfEntry } from '../products/dtf'
import { materialesEntries } from '../products/materiales'
import { papeleriaEntries } from '../products/papeleria'
import { textilEntries } from '../products/textil'
import { carteleriaEntries } from '../services/carteleria'
import { neonesEntries } from '../services/neones'
import { rotulacionEntries } from '../services/rotulacion'
import type { ConversionBlock } from './conversionTypes'

function createSharedBlock(
  entryId: string,
  overrides: Partial<ConversionBlock> = {},
): ConversionBlock {
  return {
    entryId,
    trustBullets: [
      'Precios sin IVA visibles en el flujo.',
      'Comprobacion tecnica antes de fabricar cuando hace falta.',
      'Pedido, cesta y seguimiento preparados dentro del mismo flujo.',
    ],
    urgencyMessage: 'Si el proyecto tiene prioridad, deja ese contexto claro desde la configuracion.',
    riskReducer: 'Antes de avanzar, ves el encaje comercial del pedido con una lectura clara.',
    productionPromise: 'La fabricacion se confirma con archivo, medidas y condiciones claras.',
    whatsappPrompt: 'Si necesitas aclarar un caso especial, deja la referencia lista para atencion directa.',
    reviewNotice: 'Comprobamos archivo, medidas o complejidad antes de cerrar el trabajo.',
    qualityProof: 'Base premium pensada para pedidos serios, no para formularios genericos.',
    socialProofHint: 'Espacio reservado para futuros casos reales y pruebas visuales.',
    ...overrides,
  }
}

export const conversionBlocks: ConversionBlock[] = [
  createSharedBlock(dtfEntry.id, {
    trustBullets: [
      'Precio base por metro visible antes del checkout.',
      'Preview y checklist integrados en el flujo.',
      'Pedido listo para confirmar archivo y seguir al siguiente paso.',
    ],
    urgencyMessage: 'Marca urgencia solo cuando realmente necesites acelerar la entrega.',
    riskReducer: 'No avanzas a ciegas: el total y el archivo quedan visibles antes de seguir.',
    qualityProof: 'DTF es el flujo mas desarrollado del sistema y marca el nivel de control esperado.',
  }),
  ...textilEntries.map((entry) =>
    createSharedBlock(entry.id, {
      productionPromise: 'El pedido textil queda listo para confirmar stock, arte y fecha de salida.',
      qualityProof: 'Textil pensado para trabajos de serie corta, merch y reposiciones profesionales.',
    }),
  ),
  ...papeleriaEntries.map((entry) =>
    createSharedBlock(entry.id, {
      reviewNotice: 'La tirada y el archivo se comprueban antes de confirmar el trabajo.',
      qualityProof: 'Papeleria enfocada en tiradas con lectura clara, no en listados confusos.',
    }),
  ),
  ...materialesEntries.map((entry) =>
    createSharedBlock(entry.id, {
      urgencyMessage: 'Si el proyecto depende de instalacion o soporte final, usalo como punto de partida y no como cierre tecnico.',
      qualityProof: 'Materiales preparados para retail, escaparate y senaletica con lectura comercial directa.',
    }),
  ),
  ...accesoriosEntries.map((entry) =>
    createSharedBlock(entry.id, {
      reviewNotice: 'Las tiradas y acabados se comprueban antes de lanzar la pieza final.',
      qualityProof: 'Accesorios y stickers pensados para marca urbana y promociones con criterio.',
    }),
  ),
  ...rotulacionEntries.map((entry) =>
    createSharedBlock(entry.id, {
      riskReducer: 'El rango visible evita pedir presupuesto sin contexto economico.',
      productionPromise: 'La rotulacion del vehiculo se confirma con cobertura, medida y propuesta cerrada.',
      socialProofHint: 'Reservado para futuros casos de flota, wrap y rotulacion comercial.',
    }),
  ),
  ...neonesEntries.map((entry) =>
    createSharedBlock(entry.id, {
      riskReducer: 'La complejidad formal y cromatica se recoge antes de prometer plazos o precio final.',
      productionPromise: 'Las piezas luminosas pasan a propuesta y comprobacion tecnica antes de fabricar.',
    }),
  ),
  ...carteleriaEntries.map((entry) =>
    createSharedBlock(entry.id, {
      riskReducer: 'La carteleria compleja entra al flujo correcto desde el principio: propuesta, no compra directa.',
      productionPromise: 'Gran formato, medidas y confeccion se comprueban antes de cerrar el pedido.',
    }),
  ),
]
