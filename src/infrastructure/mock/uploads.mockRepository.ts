import { createLegacyUploadRepositoryAdapter } from '../storage/adapters/legacyUploadRepositoryAdapter'
import { mockArtworkRepository } from '../storage/mock/mockArtworkRepository'

export const mockUploadRepository = createLegacyUploadRepositoryAdapter(mockArtworkRepository)
