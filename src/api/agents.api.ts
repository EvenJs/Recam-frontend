import { apiClient } from '@/lib/axios'
import type { Agent } from '@/types/models'
import type { CreateAgentDto } from '@/types/dto'

export async function getAgents(): Promise<Agent[]> {
  const response = await apiClient.get('/agents')
  return response.data.data
}

export async function createAgent(data: CreateAgentDto): Promise<Agent> {
  const response = await apiClient.post('/agents', data)
  return response.data.data
}

export async function searchAgent(email: string): Promise<Agent | null> {
  try {
    const response = await apiClient.get('/agents/search', { params: { email } })
    return response.data.data
  } catch {
    return null
  }
}

export async function linkToCompany(agentId: number): Promise<void> {
  await apiClient.post(`/agents/${agentId}/photography-company`)
}