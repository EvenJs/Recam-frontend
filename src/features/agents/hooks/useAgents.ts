import { useQuery } from '@tanstack/react-query'
import { getAgents } from '@/api/agents.api'

export function useAgents() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['agents'],
    queryFn: getAgents,
  })

  return {
    agents: data ?? [],
    isLoading,
    isError,
  }
}