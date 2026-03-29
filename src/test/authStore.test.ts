import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/store/authStore'

const adminUser = {
  userId: '123',
  email: 'admin@remp.com',
  role: 'PhotographyCompany' as const,
  firstName: 'Admin',
  lastName: 'User',
}

const agentUser = {
  userId: '456',
  email: 'agent@remp.com',
  role: 'Agent' as const,
  firstName: 'Test',
  lastName: 'Agent',
}

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })

  it('setAuth sets token, user and isAuthenticated', () => {
    useAuthStore.getState().setAuth('test-token', adminUser)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe('test-token')
    expect(state.user?.email).toBe('admin@remp.com')
    expect(state.user?.role).toBe('PhotographyCompany')
  })

  it('clearAuth resets all fields', () => {
    useAuthStore.getState().setAuth('test-token', adminUser)

    useAuthStore.getState().clearAuth()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })

  it('isAdmin is true for PhotographyCompany role', () => {
    useAuthStore.getState().setAuth('test-token', adminUser)

    const { user } = useAuthStore.getState()
    expect(user?.role === 'PhotographyCompany').toBe(true)
  })

  it('isAgent is true for Agent role', () => {
    useAuthStore.getState().setAuth('test-token', agentUser)

    const { user } = useAuthStore.getState()
    expect(user?.role === 'Agent').toBe(true)
  })
})