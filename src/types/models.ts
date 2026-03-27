import type { UserRole, ListcaseStatus, MediaType, PropertyType, SaleCategory } from './enums'

export interface User {
  userId: string
  email: string
  role: UserRole
}

export interface Agent {
  id: string
  email: string
  agentFirstName: string
  agentLastName: string
  avatarUrl?: string
  companyName?: string
  phoneNumber?: string
  roles?: string[]
}

export interface ListingCase {
  id: number
  title: string
  street: string
  city: string
  state: string
  postcode: number
  description?: string
  price: number
  bedrooms: number
  bathrooms: number
  garages: number
  floorArea: number
  propertyType: PropertyType
  saleCategory: SaleCategory
  listcaseStatus: ListcaseStatus
  createdAt: string
  assignedAgentId?: number | null
  mediaTypes: number[]
}

export interface MediaAsset {
  id: number
  mediaUrl: string
  mediaType: MediaType
  isHero: boolean
  isSelect: boolean
  uploadedAt: string
}

export interface CaseContact {
  contactId: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  companyName: string
}

export interface PreviewData {
  listing: ListingCase
  media: MediaAsset[]
  contacts: CaseContact[]
}