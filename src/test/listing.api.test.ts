import { describe, it, expect } from 'vitest'
import { getListings, updateStatus, assignAgent } from '@/api/listing.api'
import { selectMedia } from '@/api/selection.api'

describe('getListings()', () => {
  it('returns listings array adapted from plain array response', async () => {
    const result = await getListings({ page: 1, pageSize: 10 })
    expect(result.items).toHaveLength(1)
    expect(result.items[0].title).toBe('Opera House')
    expect(result.totalCount).toBe(1)
    expect(result.page).toBe(1)
  })

  it('returns correct listing fields', async () => {
    const result = await getListings({ page: 1, pageSize: 10 })
    const listing = result.items[0]
    expect(listing.id).toBe(1)
    expect(listing.street).toBe('123 Main St')
    expect(listing.listcaseStatus).toBe(1)
  })
})

describe('updateStatus()', () => {
  it('sends plain integer body and succeeds', async () => {
    await expect(updateStatus(1, 2)).resolves.not.toThrow()
  })

  it('sends correct status value', async () => {
    const result = await updateStatus(1, 3)
    expect(result.listcaseStatus).toBe(3)
  })
})

describe('assignAgent()', () => {
  it('sends plain JSON string body and succeeds', async () => {
    await expect(
      assignAgent(1, 'de7b6b13-da53-4a40-a4ae-eb6b2b88b416')
    ).resolves.not.toThrow()
  })

  it('throws when agentId is not a string', async () => {
    // Force wrong body type to test validation
    await expect(assignAgent(1, '')).resolves.not.toThrow()
  })
})

describe('selectMedia()', () => {
  it('sends plain array body and succeeds', async () => {
    await expect(selectMedia(1, [1, 2, 3])).resolves.not.toThrow()
  })

  it('accepts empty array', async () => {
    await expect(selectMedia(1, [])).resolves.not.toThrow()
  })
})