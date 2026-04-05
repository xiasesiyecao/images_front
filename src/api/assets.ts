import http, { unwrap } from './http'
import type { ImageAsset, ImageAssetPayload, MetadataOptions } from '../types/asset'

export interface PageResult<T> {
  total: number
  records: T[]
}

export function fetchAssets(params: Record<string, string | number | undefined>) {
  return unwrap<PageResult<ImageAsset>>(http.get('/api/assets', { params }))
}

export function fetchAssetDetail(id: string | number) {
  return unwrap<ImageAsset>(http.get(`/api/assets/${id}`))
}

export function createAsset(payload: ImageAssetPayload) {
  return unwrap<number>(http.post('/api/assets', payload))
}

export function updateAsset(id: string | number, payload: ImageAssetPayload) {
  return unwrap<void>(http.put(`/api/assets/${id}`, payload))
}

export function fetchMetadata() {
  return unwrap<MetadataOptions>(http.get('/api/assets/metadata/options'))
}
