import type {
  ListcaseStatus,
  MediaType,
  PropertyType,
  SaleCategory,
} from '@/types/enums'

export const listcaseStatusLabel: Record<ListcaseStatus, string> = {
  1: 'Created',
  2: 'Pending',
  3: 'In Review',
  4: 'Delivered',
}

export const listcaseStatusColor: Record<ListcaseStatus,
  'secondary' | 'outline' | 'default' | 'destructive'
> = {
  1: 'outline',     // Created
  2: 'outline',     // Pending  
  3: 'outline',     // InReview
  4: 'default',     // Delivered — green (we'll customise this next)
}

export const mediaTypeLabel: Record<MediaType, string> = {
  1: 'Photos',
  2: 'Video',
  3: 'Floor Plan',
  4: 'VR Tour',
}

export const propertyTypeLabel: Record<PropertyType, string> = {
  1: 'House',
  2: 'Unit',
  3: 'Townhouse',
  4: 'Villa',
  5: 'Other',
}

export const saleCategoryLabel: Record<SaleCategory, string> = {
  1: 'For Sale',
  2: 'For Rent',
  3: 'Auction',
}