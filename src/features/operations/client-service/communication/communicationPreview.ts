import type { AdminOrder } from '../../../../admin/types/adminModels'
import type { ClientServiceTemplatePreview } from '../types/clientService'
import { getSuggestedTemplateKey, responseTemplates } from '../templates/responseTemplates'

function interpolateTemplate(order: AdminOrder, template: string) {
  return template
    .replaceAll('{{customer}}', order.customer)
    .replaceAll('{{orderId}}', order.id)
    .replaceAll('{{trackingCode}}', order.trackingCode || 'mock-pending')
    .replaceAll('{{deliveryWindow}}', order.deliveryWindow)
}

export function buildClientServiceTemplatePreviews(order: AdminOrder): ClientServiceTemplatePreview[] {
  const priorityKeys = new Set([
    getSuggestedTemplateKey(order.incidentType),
    order.approvalState === 'approved_for_production' || order.approvalState === 'production_locked'
      ? 'approval_confirmed'
      : order.approvalState === 'changes_requested'
        ? 'changes_requested'
        : 'request_correct_file',
    order.shippingStatus === 'delivered'
      ? 'production_completed'
      : order.deliveryMethod === 'pickup'
        ? 'ready_for_pickup'
        : 'order_dispatched',
  ])

  return responseTemplates
    .filter((template) => priorityKeys.has(template.key))
    .map((template) => ({
      key: template.key,
      label: template.label,
      tone: template.tone,
      subject: interpolateTemplate(order, template.subject),
      body: interpolateTemplate(order, template.body),
    }))
}
