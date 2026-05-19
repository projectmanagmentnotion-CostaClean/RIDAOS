import type {
  AdminComment,
  AdminOrderOverride,
  AdminUploadOverride,
} from '../admin/types/adminModels'

const makeComment = (id: string, body: string, createdAt: string): AdminComment => ({
  id,
  author: 'Equipo Ridaos',
  body,
  createdAt,
})

export const adminMockOrderOverrides: Record<string, AdminOrderOverride> = {
  'RP-24031': {
    priority: 'urgent',
    paymentStatus: 'awaiting_payment',
    productionStatus: 'queued',
    notes: 'Cliente pendiente de aprobar arte final y confirmar prioridad de entrega.',
    productionNotes: 'Reservar hueco de impresion en cuanto se apruebe el archivo.',
    internalComments: [
      makeComment(
        'comment-rp24031-1',
        'Archivo principal recibido. Falta confirmar si hay segunda version para espalda.',
        '2026-04-22T10:30:00.000Z',
      ),
    ],
  },
  'RP-24018': {
    priority: 'high',
    paymentStatus: 'pending',
    productionStatus: 'queued',
    notes: 'Proyecto de lona pendiente de planificar confecciones y ojales.',
    productionNotes: 'Esperar ok comercial antes de bloquear materiales.',
  },
  'RP-23994': {
    priority: 'normal',
    paymentStatus: 'paid',
    productionStatus: 'printing',
    notes: 'Textil aprobado y ya en fabricacion.',
    productionNotes: 'Controlar acabado final en segunda pasada.',
  },
  'RP-23970': {
    priority: 'high',
    paymentStatus: 'paid',
    productionStatus: 'ready',
    notes: 'Pedido listo para recogida o envio.',
    productionNotes: 'Avisar a cliente antes de las 18:00.',
  },
  'RP-23921': {
    priority: 'low',
    paymentStatus: 'paid',
    productionStatus: 'completed',
    notes: 'Pedido historico completado correctamente.',
    productionNotes: 'Sin acciones pendientes.',
  },
}

export const adminMockUploadOverrides: Record<string, AdminUploadOverride> = {
  'upload-rp24031': {
    status: 'pending',
    reviewNotes: 'Revisar si el PDF incorpora marcas o capas innecesarias.',
  },
  'upload-rp24018': {
    status: 'approved',
    reviewNotes: 'Archivo correcto para fabricacion de lona.',
  },
  'upload-rp23994': {
    status: 'reuploaded',
    reviewNotes: 'Version actualizada recibida tras ajuste de color.',
  },
  'upload-rp23970': {
    status: 'approved',
    reviewNotes: 'Arte definitivo validado para rotulacion.',
  },
  'upload-rp23921': {
    status: 'approved',
    reviewNotes: 'Historico cerrado.',
  },
}

export const adminMockQuickActions = [
  { label: 'Revisar pedidos urgentes', href: '#/admin/orders?priority=urgent' },
  { label: 'Abrir comprobacion de archivos', href: '#/admin/uploads' },
  { label: 'Ver cola de fabricacion', href: '#/admin/production' },
]
