import api from './api'
import { type Category } from '../types'

// GET /categories/ — returns a plain array (no pagination on this endpoint)
export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories/')
  return data
}

// GET /categories/:id/
export async function getCategory(id: number): Promise<Category> {
  const { data } = await api.get<Category>(`/categories/${id}/`)
  return data
}
