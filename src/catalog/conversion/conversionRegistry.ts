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
      'Revision tecnica antes de producir cuando aplica.',
      'Arquitectura preparada para pedido, carrito y seguimiento posterior.',
    ],
    urgencyMessage: 'Si el proyecto tiene prioridad, deja ese contexto claro desde la configuracion.',
    riskReducer: 'La lectura comercial queda visible antes de pasar a una fase mas comprometida.',
    productionPromise: 'Produccion alineada a revision, aprobacion y condiciones comerciales activas.',
    whatsappPrompt: 'Si necesitas validar un caso especial, deja la referencia lista para atencion directa.',
    reviewNotice: 'El equipo revisa archivo, medidas o complejidad antes de cerrar produccion.',
    qualityProof: 'Base premium pensada para pedidos serios, no para formularios genericos.',
    socialProofPlaceholder: 'Espacio reservado para futuros casos reales y pruebas visuales.',
    ...overrides,
  }
}

export const conversionBlocks: ConversionBlock[] = [
  createSharedBlock(dtfEntry.id, {
    trustBullets: [
      'Precio base por metro visible antes del checkout.',
      'Preview y checklist integrados en el flujo.',
      'Pedido listo para revision tecnica y continuidad comercial.',
    ],
    urgencyMessage: 'Marca urgencia solo cuando realmente necesites acelerar la lectura interna del pedido.',
    riskReducer: 'No avanzas a ciegas: el total y el archivo quedan visibles antes de seguir.',
    qualityProof: 'DTF es el flujo mas desarrollado del sistema y marca el nivel de control esperado.',
  }),
  ...textilEntries.map((entry) =>
    createSharedBlock(entry.id, {
      productionPromise: 'El pedido textil queda listo para confirmar stock, arte y produccion.',
      qualityProof: 'Textil pensado para trabajos de serie corta, merch y reposiciones profesionales.',
    }),
  ),
  ...papeleriaEntries.map((entry) =>
    createSharedBlock(entry.id, {
      reviewNotice: 'La tirada y el archivo se revisan antes de confirmar una salida a produccion.',
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
      productionPromise: 'La produccion de vehiculo solo avanza con revision manual y cobertura confirmada.',
      socialProofPlaceholder: 'Reservado para futuros casos de flota, wrap y rotulacion comercial.',
    }),
  ),
  ...neonesEntries.map((entry) =>
    createSharedBlock(entry.id, {
      riskReducer: 'La complejidad formal y cromatica se recoge antes de prometer plazos o precio final.',
      productionPromise: 'Las piezas luminosas pasan a propuesta y validacion tecnica antes de fabricar.',
    }),
  ),
  ...carteleriaEntries.map((entry) =>
    createSharedBlock(entry.id, {
      riskReducer: 'La carteleria compleja entra al flujo correcto desde el principio: propuesta, no compra directa.',
      productionPromise: 'Gran formato, medidas y confeccion se revisan antes de comprometer produccion.',
    }),
  ),
]
