import type { DTFQuality, DTFUrgency } from '../lib/pricing'

export type OrderStatus =
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'in_production'
  | 'ready'
  | 'completed'

export type PaymentStatus = 'pending' | 'paid' | 'disabled'

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  createdAt: string
  updatedAt: string
}

export type ArtworkUpload = {
  id: string
  orderId?: string
  itemId: string
  fileName: string
  fileType: string
  fileSize: number
  formatLabel: string
  status: OrderStatus
  uploadedAt: string
  notes?: string
}

export type OrderItem = {
  id: string
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
  source: 'mock_frontend'
}
