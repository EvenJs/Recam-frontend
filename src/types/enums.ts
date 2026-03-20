export const UserRole = {
  Admin: 'PhotographyCompany',
  Agent: 'Agent',
} as const
export type UserRole = typeof UserRole[keyof typeof UserRole]

export const ListcaseStatus = {
  Created: 1,
  Pending: 2,
  InReview: 3,
  Delivered: 4,
} as const
export type ListcaseStatus = typeof ListcaseStatus[keyof typeof ListcaseStatus]

export const MediaType = {
  Picture: 1,
  Video: 2,
  FloorPlan: 3,
  VRTour: 4,
} as const
export type MediaType = typeof MediaType[keyof typeof MediaType]

export const PropertyType = {
  House: 1,
  Unit: 2,
  Townhouse: 3,
  Villa: 4,
  Others: 5,
} as const
export type PropertyType = typeof PropertyType[keyof typeof PropertyType]

export const SaleCategory = {
  ForSale: 1,
  ForRent: 2,
  Auction: 3,
} as const
export type SaleCategory = typeof SaleCategory[keyof typeof SaleCategory]