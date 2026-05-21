import type { AdminIncidentType } from '../../../../admin/types/adminModels'

export type ResponseTemplateKey =
  | 'request_correct_file'
  | 'approval_confirmed'
  | 'changes_requested'
  | 'delay_notification'
  | 'delivery_issue'
  | 'production_completed'
  | 'ready_for_pickup'
  | 'order_dispatched'
  | 'missing_information'

export type ResponseTemplateDefinition = {
  key: ResponseTemplateKey
  label: string
  tone: 'default' | 'success' | 'warning'
  subject: string
  body: string
}

export const responseTemplates: ResponseTemplateDefinition[] = [
  {
    key: 'request_correct_file',
    label: 'Solicitar archivo correcto',
    tone: 'warning',
    subject: 'Necesitamos una version corregida del archivo para {{orderId}}',
    body:
      'Hola {{customer}}, hemos revisado el arte de {{orderId}} y necesitamos una version corregida para poder continuar. En cuanto recibamos el archivo actualizado reanudaremos el flujo sin perder prioridad.',
  },
  {
    key: 'approval_confirmed',
    label: 'Approval confirmada',
    tone: 'success',
    subject: 'Artwork aprobado para {{orderId}}',
    body:
      'Hola {{customer}}, confirmamos que el arte de {{orderId}} ya esta aprobado y el pedido queda listo para entrar en produccion segun la ventana planificada.',
  },
  {
    key: 'changes_requested',
    label: 'Cambios solicitados',
    tone: 'warning',
    subject: 'Necesitamos cambios en {{orderId}}',
    body:
      'Hola {{customer}}, hemos detectado varios ajustes necesarios en el archivo de {{orderId}}. Te dejamos el resumen interno preparado para que puedas actualizar el arte sin perder contexto.',
  },
  {
    key: 'delay_notification',
    label: 'Aviso de retraso',
    tone: 'warning',
    subject: 'Actualizacion de planning para {{orderId}}',
    body:
      'Hola {{customer}}, estamos revisando una incidencia operativa en {{orderId}}. El pedido sigue activo, pero la ventana comprometida requiere una actualizacion. Te confirmaremos el nuevo handoff en cuanto quede cerrado.',
  },
  {
    key: 'delivery_issue',
    label: 'Incidencia de entrega',
    tone: 'warning',
    subject: 'Incidencia de entrega registrada en {{orderId}}',
    body:
      'Hola {{customer}}, hemos registrado una incidencia de salida en {{orderId}}. Nuestro equipo esta revisando el handoff y te enviaremos la siguiente actualizacion con tracking o nueva ventana.',
  },
  {
    key: 'production_completed',
    label: 'Produccion completada',
    tone: 'success',
    subject: '{{orderId}} ya esta listo para cierre de produccion',
    body:
      'Hola {{customer}}, la produccion de {{orderId}} ha quedado completada. Estamos cerrando packing y salida para entregarte el pedido dentro de la ventana prevista.',
  },
  {
    key: 'ready_for_pickup',
    label: 'Listo para recoger',
    tone: 'success',
    subject: '{{orderId}} listo para recoger',
    body:
      'Hola {{customer}}, tu pedido {{orderId}} ya esta listo para recogida. Puedes pasar en la ventana acordada y nuestro equipo dejara preparado el handoff en mostrador.',
  },
  {
    key: 'order_dispatched',
    label: 'Pedido enviado',
    tone: 'success',
    subject: '{{orderId}} ha salido de taller',
    body:
      'Hola {{customer}}, el pedido {{orderId}} ya ha salido del taller. Tracking: {{trackingCode}}. Ventana estimada: {{deliveryWindow}}.',
  },
  {
    key: 'missing_information',
    label: 'Informacion pendiente',
    tone: 'default',
    subject: 'Necesitamos informacion adicional para {{orderId}}',
    body:
      'Hola {{customer}}, para avanzar con {{orderId}} necesitamos completar varios datos del encargo. En cuanto lo confirmes podremos retomar la revision sin rehacer el pedido.',
  },
]

export function getSuggestedTemplateKey(incidentType: AdminIncidentType) {
  switch (incidentType) {
    case 'artwork_invalid':
      return 'request_correct_file'
    case 'customer_change_request':
    case 'urgent_change_request':
      return 'changes_requested'
    case 'delivery_delay':
      return 'delay_notification'
    case 'production_quality_review':
      return 'production_completed'
    case 'missing_information':
      return 'missing_information'
    case 'payment_issue_mock':
      return 'missing_information'
    case 'damaged_delivery_mock':
      return 'delivery_issue'
    default:
      return 'approval_confirmed'
  }
}
