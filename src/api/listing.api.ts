import { apiClient } from '@/lib/axios'
import type { ListingCase } from '@/types/models'
import type { ListcaseStatus } from '@/types/enums'
import type { PaginatedData } from '@/types/api'
import type { CreateListingDto, UpdateListingDto } from '@/types/dto'

export async function getListings(params: {
  page: number
  pageSize: number
  status?: ListcaseStatus
}): Promise<PaginatedData<ListingCase>> {
  const response = await apiClient.get('/listings', { params })
  const data = response.data.data

  // Handle both paginated and plain array responses
  if (Array.isArray(data)) {
    return {
      items: data,
      page: params.page,
      pageSize: params.pageSize,
      totalCount: data.length,
      totalPages: 1,
    }
  }

  return data
}
export async function getListing(id: number): Promise<ListingCase> {
  const response = await apiClient.get(`/listings/${id}`)
  return response.data.data
}

export async function createListing(data: CreateListingDto): Promise<ListingCase> {
  const response = await apiClient.post('/listings', data)
  return response.data.data
}

export async function updateListing(id: number, data: UpdateListingDto): Promise<ListingCase> {
  const response = await apiClient.put(`/listings/${id}`, data)
  return response.data.data
}

export async function deleteListing(id: number): Promise<void> {
  await apiClient.delete(`/listings/${id}`)
}

export async function updateStatus(id: number, status: ListcaseStatus): Promise<ListingCase> {
  const response = await apiClient.patch(`/listings/${id}/status`, { status })
  return response.data.data
}

export async function assignAgent(listingId: number, agentId: string): Promise<void> {
  await apiClient.post(`/listings/${listingId}/assign-agent`, { agentId })
}