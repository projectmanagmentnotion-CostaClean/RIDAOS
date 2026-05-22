import type { PreviewAsset } from '../storage.types'

export type PreviewAssetFilters = {
  uploadId?: string
  kind?: PreviewAsset['kind']
}

export interface PreviewAssetRepository {
  listPreviewAssets(filters?: PreviewAssetFilters): Promise<PreviewAsset[]>
  getPreviewAssetByUploadId(uploadId: string): Promise<PreviewAsset | undefined>
  savePreviewAsset(asset: PreviewAsset): Promise<PreviewAsset>
}
