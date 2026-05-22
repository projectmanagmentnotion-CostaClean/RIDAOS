import type { ArtworkReviewRepository } from '../../../domain/storage/repositories/ArtworkReviewRepository'
import { toArtworkReview } from '../../../domain/storage/mappers'
import { mockArtworkRepository } from './mockArtworkRepository'

export const mockArtworkReviewRepository: ArtworkReviewRepository = {
  async listArtworkReviews(filters) {
    const uploads = await mockArtworkRepository.listArtworkUploads()
    return uploads
      .filter((upload) => (filters?.uploadId ? upload.id === filters.uploadId : true))
      .map((upload) => toArtworkReview(upload))
      .filter((review) => (filters?.reviewStatus ? review.reviewStatus === filters.reviewStatus : true))
  },
  async getArtworkReview(uploadId) {
    const reviews = await this.listArtworkReviews({ uploadId })
    return reviews.find((review) => review.uploadId === uploadId)
  },
  async saveArtworkReview(review) {
    return review
  },
}
