import { apiClient } from '@/lib/axios'
import type { Agent } from '@/types/models'
import type { CreateAgentDto } from '@/types/dto'

export async function getAgents(): Promise<Agent[]> {
  const response = await apiClient.get('/agents')
  return response.data.data
}

export async function createAgent(data: CreateAgentDto): Promise<Agent> {
  const response = await apiClient.post('/agents', {
    email: data.email,
    agentFirstName: data.agentFirstName,
    agentLastName: data.agentLastName,
  })
  return response.data.data
}

export async function searchAgent(email: string): Promise<Agent[]> {
  try {
    const response = await apiClient.get('/agents/search', { params: { email } })
    const data = response.data.data
    if (Array.isArray(data)) return data
    return data ? [data] : []
  } catch {
    return []
  }
}

export async function linkToCompany(agentId: string): Promise<void> {
  await apiClient.post(`/agents/${agentId}/photography-company`)
}