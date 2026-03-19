import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated,
    isAdmin: user?.role === 'PhotographyCompany',
    isAgent: user?.role === 'Agent',
    logout: () => {
      clearAuth()
      navigate('/login')
    },
  }
}