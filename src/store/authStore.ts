import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: {
    userId: string
    email: string
    role: 'PhotographyCompany' | 'Agent'
  } | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AuthState['user']) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'remp-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)