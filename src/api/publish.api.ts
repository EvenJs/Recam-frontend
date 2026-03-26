import { apiClient } from '@/lib/axios'
import type { PreviewData } from '@/types/models'

export async function getPreview(listingId: number): Promise<PreviewData> {
  const response = await apiClient.get(`/listings/${listingId}/preview`)
  const data = response.data.data

  return {
    listing: data,
    media: [],
    contacts: [],
  }
}

export async function publishListing(listingId: number): Promise<string> {
  const response = await apiClient.post(`/listings/${listingId}/publish`)
  return response.data.data
}