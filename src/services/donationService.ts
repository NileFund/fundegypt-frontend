import api from './api'
import { type Donation } from '../types'

// POST /donations/
export async function donate(projectId: number, amount: number): Promise<Donation> {
  const { data } = await api.post<Donation>('/donations/', { project: projectId, amount })
  return data
}

// GET /donations/my/  — current user's donation history
export async function getMyDonations(): Promise<Donation[]> {
  const { data } = await api.get<Donation[]>('/donations/my/')
  return data
}
