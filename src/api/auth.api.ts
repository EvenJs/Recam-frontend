import { apiClient } from '@/lib/axios'
import type { LoginResponse } from '@/types/api'

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data.data
}