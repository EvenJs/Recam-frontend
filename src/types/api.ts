import type { UserRole } from './enums'

export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T | null
  errors: string[] | null
}

export interface PaginatedData<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>

export interface LoginResponse {
  firstName: string
  lastName: string
  token: string
  userId: string
  email: string
  role: UserRole
  expiresAt: string
}