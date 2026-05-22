import type { ArtworkReview } from '../storage.types'

export type ArtworkReviewFilters = {
  uploadId?: string
  reviewStatus?: ArtworkReview['reviewStatus']
}

export interface ArtworkReviewRepository {
  listArtworkReviews(filters?: ArtworkReviewFilters): Promise<ArtworkReview[]>
  getArtworkReview(uploadId: string): Promise<ArtworkReview | undefined>
  saveArtworkReview(review: ArtworkReview): Promise<ArtworkReview>
}
