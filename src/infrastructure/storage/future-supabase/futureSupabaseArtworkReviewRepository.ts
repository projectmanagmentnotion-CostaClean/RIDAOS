import type { ArtworkReviewRepository } from '../../../domain/storage/repositories/ArtworkReviewRepository'
import { assertSupabaseFeature } from '../../supabase/supabaseClient'

export const futureSupabaseArtworkReviewRepository: ArtworkReviewRepository = {
  async listArtworkReviews() {
    return assertSupabaseFeature('storage.reviews.listArtworkReviews')
  },
  async getArtworkReview() {
    return assertSupabaseFeature('storage.reviews.getArtworkReview')
  },
  async saveArtworkReview() {
    return assertSupabaseFeature('storage.reviews.saveArtworkReview')
  },
}
