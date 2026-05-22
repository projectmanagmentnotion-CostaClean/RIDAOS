import type { DTFQuality, DTFUrgency } from '../lib/pricing'
import type { ArtworkUploadRecord } from '../domain/storage'

export type OrderStatus =
  | 'pending_review'
  | 'approved'
  | 'needs_changes'
  | 'awaiting_payment'
  | 'paid'
  | 'in_production'
  | 'quality_check'
  | 'ready'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'awaiting_payment' | 'paid' | 'disabled'

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  createdAt: string
  updatedAt: string
}

export type ArtworkUpload = ArtworkUploadRecord

export type OrderItem = {
  id: string
  lineQuantity?: number
  productType: 'dtf' | 'textile' | 'paper' | 'material' | 'accessory'
  productName: string
  configuration: {
    summary?: string[]
    quantity?: number
    size?: string
    variant?: string
    areaM2?: number
    meters?: number
    quality?: DTFQuality
    urgency?: DTFUrgency
    turnaroundPreference?: string
    extras?: string[]
    notes: string
  }
  pricing: {
    unitPrice: number
    unitLabel?: string
    subtotal: number
    extras: number
    total: number
    quoteRequired?: boolean
  }
  artwork: ArtworkUpload
}

export type Order = {
  id: string
  customerId: string
  customer: Customer
  items: OrderItem[]
  total: number
  createdAt: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  source: 'demo_frontend'
}
