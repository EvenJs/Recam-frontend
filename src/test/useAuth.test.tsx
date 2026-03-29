import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{ children } </MemoryRouter>
)

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

describe('useAuth', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    mockNavigate.mockClear()
  })

  it('returns isAuthenticated false when not logged in', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('returns isAdmin true for PhotographyCompany role', () => {
    useAuthStore.getState().setAuth('token', adminUser)
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isAdmin).toBe(true)
    expect(result.current.isAgent).toBe(false)
  })

  it('returns isAgent true for Agent role', () => {
    useAuthStore.getState().setAuth('token', agentUser)
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isAgent).toBe(true)
    expect(result.current.isAdmin).toBe(false)
  })

  it('returns correct user email', () => {
    useAuthStore.getState().setAuth('token', adminUser)
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user?.email).toBe('admin@remp.com')
  })

  it('returns correct role', () => {
    useAuthStore.getState().setAuth('token', adminUser)
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.role).toBe('PhotographyCompany')
  })

  it('logout clears auth and navigates to /login', () => {
    useAuthStore.getState().setAuth('token', adminUser)
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().token).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('returns null role when not authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.role).toBeNull()
  })
})