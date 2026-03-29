import { describe, it, expect } from 'vitest'
import {
  listcaseStatusLabel,
  listcaseStatusColor,
  mediaTypeLabel,
  propertyTypeLabel,
  saleCategoryLabel,
} from '@/utils/enumMaps'

describe('listcaseStatusLabel', () => {
  it('returns correct label for each status', () => {
    expect(listcaseStatusLabel[1]).toBe('Created')
    expect(listcaseStatusLabel[2]).toBe('Pending')
    expect(listcaseStatusLabel[3]).toBe('In Review')
    expect(listcaseStatusLabel[4]).toBe('Delivered')
  })

  it('covers all 4 statuses', () => {
    expect(Object.keys(listcaseStatusLabel)).toHaveLength(4)
  })
})

describe('listcaseStatusColor', () => {
  it('returns correct color class for each status', () => {
    expect(listcaseStatusColor[1]).toContain('orange')
    expect(listcaseStatusColor[2]).toContain('blue')
    expect(listcaseStatusColor[3]).toContain('purple')
    expect(listcaseStatusColor[4]).toContain('green')
  })
})

describe('mediaTypeLabel', () => {
  it('returns correct label for each media type', () => {
    expect(mediaTypeLabel[1]).toBe('Photos')
    expect(mediaTypeLabel[2]).toBe('Video')
    expect(mediaTypeLabel[3]).toBe('Floor Plan')
    expect(mediaTypeLabel[4]).toBe('VR Tour')
  })
})

describe('propertyTypeLabel', () => {
  it('returns correct label for each property type', () => {
    expect(propertyTypeLabel[1]).toBe('House')
    expect(propertyTypeLabel[2]).toBe('Unit')
    expect(propertyTypeLabel[3]).toBe('Townhouse')
    expect(propertyTypeLabel[4]).toBe('Villa')
    expect(propertyTypeLabel[5]).toBe('Other')
  })
})

describe('saleCategoryLabel', () => {
  it('returns correct label for each sale category', () => {
    expect(saleCategoryLabel[1]).toBe('For Sale')
    expect(saleCategoryLabel[2]).toBe('For Rent')
    expect(saleCategoryLabel[3]).toBe('Auction')
  })
})