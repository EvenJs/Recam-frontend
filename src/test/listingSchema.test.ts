import { describe, it, expect } from 'vitest'
import { listingSchema } from '@/features/listings/schemas/listingSchema'

describe('listingSchema', () => {
  const validData = {
    title: 'Modern Family Home',
    street: '123 Main St',
    city: 'Melbourne',
    state: 'VIC',
    postcode: 3000,
    price: 850000,
    bedrooms: 4,
    bathrooms: 2,
    garages: 2,
    floorArea: 320,
    propertyType: 1,
    saleCategory: 1,
  }

  it('passes with valid data', () => {
    const result = listingSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails when title is empty', () => {
    const result = listingSchema.safeParse({ ...validData, title: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required')
    }
  })

  it('fails when price is zero', () => {
    const result = listingSchema.safeParse({ ...validData, price: 0 })
    expect(result.success).toBe(false)
  })

  it('fails when price is negative', () => {
    const result = listingSchema.safeParse({ ...validData, price: -100 })
    expect(result.success).toBe(false)
  })

  it('fails when bedrooms is negative', () => {
    const result = listingSchema.safeParse({ ...validData, bedrooms: -1 })
    expect(result.success).toBe(false)
  })

  it('passes when bedrooms is zero', () => {
    const result = listingSchema.safeParse({ ...validData, bedrooms: 0 })
    expect(result.success).toBe(true)
  })

  it('fails when propertyType is out of range', () => {
    const result = listingSchema.safeParse({ ...validData, propertyType: 6 })
    expect(result.success).toBe(false)
  })

  it('fails when saleCategory is out of range', () => {
    const result = listingSchema.safeParse({ ...validData, saleCategory: 0 })
    expect(result.success).toBe(false)
  })

  it('coerces string numbers to numbers', () => {
    const result = listingSchema.safeParse({
      ...validData,
      price: '850000',
      bedrooms: '4',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(typeof result.data.price).toBe('number')
      expect(typeof result.data.bedrooms).toBe('number')
    }
  })
})