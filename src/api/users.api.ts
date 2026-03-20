import { apiClient } from '@/lib/axios'
import type { User } from '@/types/models'
import type { PaginatedData } from '@/types/api'
import type { UpdatePasswordDto } from '@/types/dto'

export async function getMe(): Promise<User> {
  const response = await apiClient.get('/users/me')
  return response.data.data
}

export async function updatePassword(data: UpdatePasswordDto): Promise<void> {
  await apiClient.put('/users/me/password', data)
}

export async function getUsers(params: {
  page: number
  pageSize: number
}): Promise<PaginatedData<User>> {
  const response = await apiClient.get('/users', { params })
  return response.data.data
}