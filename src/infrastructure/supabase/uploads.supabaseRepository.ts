import type { UploadRepository } from '../../domain/uploads/upload.repository'
import { assertSupabaseFeature } from './supabaseClient'

export const supabaseUploadRepository: UploadRepository = {
  async listUploads() {
    return assertSupabaseFeature('uploads.listUploads')
  },
  async getUploadByOrderId() {
    return assertSupabaseFeature('uploads.getUploadByOrderId')
  },
  async saveUpload() {
    return assertSupabaseFeature('uploads.saveUpload')
  },
}
