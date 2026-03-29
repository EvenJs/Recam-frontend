import { apiClient } from '@/lib/axios'
import type { PreviewData } from '@/types/models'

// Authenticated — for the agent/admin preview editor
export async function getPreview(listingId: number): Promise<PreviewData> {
  const response = await apiClient.get(`/listings/${listingId}/preview`)
  const data = response.data.data

  return {
    listing: data,
    media: [],
    contacts: [],
  }
}

// Public — no auth, uses token from URL
export async function getPublicPreview(token: string): Promise<PreviewData> {
  const response = await apiClient.get(`/listings/preview/${token}`)
  const data = response.data.data

  return {
    listing: data,
    media: [
      ...(data.heroImage ? [data.heroImage] : []),
      ...(data.selectedMedia ?? []),
    ],
    contacts: data.contacts ?? [],
  }
}

export async function publishListing(listingId: number): Promise<string> {
  const response = await apiClient.post(`/listings/${listingId}/publish`)
  return response.data.data
}