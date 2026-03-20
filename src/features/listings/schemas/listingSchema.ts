import { z } from 'zod'

const coerceInt = z.coerce.number().pipe(z.number().int())
const coercePositive = z.coerce.number().pipe(z.number().positive())
const coerceNonNeg = z.coerce.number().pipe(z.number().min(0))

export const listingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postcode: coerceInt.pipe(z.number().positive('Enter a valid postcode')),
  price: coercePositive.pipe(z.number().positive('Price must be greater than 0')),
  bedrooms: coerceNonNeg,
  bathrooms: coerceNonNeg,
  garages: coerceNonNeg,
  floorArea: coercePositive.pipe(z.number().positive('Floor area must be greater than 0')),
  propertyType: coerceInt.pipe(z.number().min(1).max(5)),
  saleCategory: coerceInt.pipe(z.number().min(1).max(3)),
})

export type ListingFormValues = z.infer<typeof listingSchema>