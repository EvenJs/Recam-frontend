import { apiClient } from '@/lib/axios'
import type { MediaAsset } from '@/types/models'

export async function getMedia(listingId: number): Promise<MediaAsset[]> {
  const response = await apiClient.get(`/listings/${listingId}/media`)
  return response.data.data
}

export async function uploadMedia(
  listingId: number,
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<MediaAsset[]> {
  const response = await apiClient.post(`/listings/${listingId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    },
  })
  return response.data.data
}

export async function deleteMedia(mediaId: number): Promise<void> {
  await apiClient.delete(`/media/${mediaId}`)
}

export async function setCoverImage(listingId: number, mediaId: number): Promise<void> {
  await apiClient.put(`/listings/${listingId}/cover-image`, { mediaId })
}

export async function downloadFile(mediaId: number): Promise<Blob> {
  const response = await apiClient.get(`/media/${mediaId}/download`, {
    responseType: 'blob',
  })
  return response.data
}

export async function downloadZip(listingId: number): Promise<Blob> {
  const response = await apiClient.get(`/listings/${listingId}/download`, {
    responseType: 'blob',
  })
  return response.data
}