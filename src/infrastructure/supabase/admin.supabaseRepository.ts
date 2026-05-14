import type { AdminRepository } from '../../domain/admin/admin.repository'
import { assertSupabaseFeature } from './supabaseClient'

export const supabaseAdminRepository: AdminRepository = {
  async listOrders() {
    return assertSupabaseFeature('admin.listOrders')
  },
  async getOrderDetail() {
    return assertSupabaseFeature('admin.getOrderDetail')
  },
  async updateOrderStatus() {
    return assertSupabaseFeature('admin.updateOrderStatus')
  },
  async updateOrderPriority() {
    return assertSupabaseFeature('admin.updateOrderPriority')
  },
  async updatePaymentStatus() {
    return assertSupabaseFeature('admin.updatePaymentStatus')
  },
  async updateProductionStatus() {
    return assertSupabaseFeature('admin.updateProductionStatus')
  },
  async saveOrderNotes() {
    return assertSupabaseFeature('admin.saveOrderNotes')
  },
  async saveProductionNotes() {
    return assertSupabaseFeature('admin.saveProductionNotes')
  },
  async listUploads() {
    return assertSupabaseFeature('admin.listUploads')
  },
  async updateUploadStatus() {
    return assertSupabaseFeature('admin.updateUploadStatus')
  },
  async updateUploadNotes() {
    return assertSupabaseFeature('admin.updateUploadNotes')
  },
  async listCustomers() {
    return assertSupabaseFeature('admin.listCustomers')
  },
  async listProductionQueue() {
    return assertSupabaseFeature('admin.listProductionQueue')
  },
  async getDashboardOverview() {
    return assertSupabaseFeature('admin.getDashboardOverview')
  },
  async addInternalComment() {
    return assertSupabaseFeature('admin.addInternalComment')
  },
  async patchOrder() {
    return assertSupabaseFeature('admin.patchOrder')
  },
  async patchUpload() {
    return assertSupabaseFeature('admin.patchUpload')
  },
}
