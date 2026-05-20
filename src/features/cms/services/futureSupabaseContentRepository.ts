import type { ContentRepository } from './contentRepository'
import type { CmsDocument, CmsSnapshot, CmsZoneView } from '../types/cms'

const futureRepositoryError = () =>
  new Error('FutureSupabaseContentRepository is a placeholder. Real CMS persistence is not active yet.')

export class FutureSupabaseContentRepository implements ContentRepository {
  async getZones(): Promise<CmsZoneView[]> {
    throw futureRepositoryError()
  }

  async getDocuments(): Promise<CmsDocument[]> {
    throw futureRepositoryError()
  }

  async getDocumentBySourcePath(): Promise<CmsDocument | null> {
    throw futureRepositoryError()
  }

  async saveDocument(): Promise<CmsDocument> {
    throw futureRepositoryError()
  }

  async resetDocument(): Promise<CmsDocument> {
    throw futureRepositoryError()
  }

  async resetAll(): Promise<void> {
    throw futureRepositoryError()
  }

  async exportSnapshot(): Promise<CmsSnapshot> {
    throw futureRepositoryError()
  }

  async importSnapshot(): Promise<void> {
    throw futureRepositoryError()
  }
}
