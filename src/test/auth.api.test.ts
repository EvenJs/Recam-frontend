import { describe, it, expect } from 'vitest'
import { login } from '@/api/auth.api'

describe('login()', () => {
  it('returns token and user data on success', async () => {
    const result = await login('admin@remp.com', 'Admin@123!')
    expect(result.token).toBe('mock-jwt-token')
    expect(result.email).toBe('admin@remp.com')
    expect(result.role).toBe('PhotographyCompany')
  })

  it('throws on wrong credentials', async () => {
    await expect(login('admin@remp.com', 'wrongpassword')).rejects.toThrow()
  })

  it('throws on wrong email', async () => {
    await expect(login('wrong@email.com', 'Admin@123!')).rejects.toThrow()
  })
})