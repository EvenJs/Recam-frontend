import { apiClient } from '@/lib/axios'
import type { MediaAsset, CaseContact } from '@/types/models'
import type { CreateContactDto } from '@/types/dto'

export async function selectMedia(listingId: number, mediaIds: number[]): Promise<void> {
  await apiClient.put(
    `/listings/${listingId}/selected-media`,
    mediaIds,
    { headers: { 'Content-Type': 'application/json' } }
  )
}

export async function getFinalSelection(listingId: number): Promise<MediaAsset[]> {
  const response = await apiClient.get(`/listings/${listingId}/final-selection`)
  return response.data.data
}

export async function addContact(listingId: number, data: CreateContactDto): Promise<CaseContact> {
  const response = await apiClient.post(`/listings/${listingId}/contacts`, data)
  return response.data.data
}

export async function getContacts(listingId: number): Promise<CaseContact[]> {
  const response = await apiClient.get(`/listings/${listingId}/contacts`)
  return response.data.data
}