import type { PropertyType, SaleCategory } from './enums'

export interface CreateListingDto {
  title: string
  street: string
  city: string
  state: string
  postcode: number
  price: number
  bedrooms: number
  bathrooms: number
  garages: number
  floorArea: number
  propertyType: PropertyType
  saleCategory: SaleCategory
}

export type UpdateListingDto = Partial<CreateListingDto>

export interface CreateAgentDto {
  agentFirstName: string
  agentLastName: string
  email: string
  companyName?: string
}

export interface UpdatePasswordDto {
  currentPassword: string
  newPassword: string
}

export interface CreateContactDto {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  companyName: string
}