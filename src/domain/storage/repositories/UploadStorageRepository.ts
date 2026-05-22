import type { MockStorageFile } from '../storage.types'

export interface UploadStorageRepository {
  createLocalFileRecord(file: MockStorageFile): Promise<MockStorageFile>
  getLocalFileRecord(fileId: string): Promise<MockStorageFile | undefined>
  listLocalFileRecords(): Promise<MockStorageFile[]>
}
