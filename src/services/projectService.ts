import api from "./api";
import { type Project, type Tag } from "../types";

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface ProjectFilters {
  status?: string   // 'running' | 'pending' | 'completed' | 'cancelled'
  category?: number
  page?: number
  ordering?: string,
  featured?: boolean,
  search?: string
}

export interface DonationSummary {
  totalDonated: number;
  totalTarget: number;
  remaining: number;
  percentage: number;
  donors_count: number;
}

// GET /projects/?status=running&category=1&page=2
export async function getProjects(filters: ProjectFilters = {}): Promise<PaginatedResponse<Project>> {
  const { data } = await api.get<PaginatedResponse<Project>>("/projects/", { params: filters });
  return data;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>('/projects/featured/')
  return data
}

export async function getTopRatedProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>('/projects/top_rated/')
  return data
}

export async function getLatestProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>('/projects/latest/')
  return data
}

// GET /projects/:id/
export async function getProject(id: number): Promise<Project> {
  const { data } = await api.get<Project>(`/projects/${id}/`);
  return data;
}

// POST /projects/ - caller builds FormData
export async function createProject(formData: FormData): Promise<Project> {
  const { data } = await api.post<Project>("/projects/", formData);
  return data;
}

// PATCH /projects/:id/ - caller builds FormData
export async function updateProject(id: number, formData: FormData): Promise<Project> {
  const { data } = await api.patch<Project>(`/projects/${id}/`, formData);
  return data;
}

// GET /projects/tags/
export async function getTags(): Promise<Tag[]> {
  const { data } = await api.get<Tag[]>("/projects/tags/");
  return data;
}

// POST /projects/:id/cancel/
export async function cancelProject(id: number): Promise<void> {
  await api.post(`/projects/${id}/cancel/`);
}

// GET /projects/:id/donations/summary/
export async function getDonationSummary(id: number): Promise<DonationSummary> {
  const { data } = await api.get<DonationSummary>(`/projects/${id}/donations/summary/`);
  return data;
}

// GET /projects/my-campaigns/  — current user's projects
export async function getMyProjects(): Promise<PaginatedResponse<Project>> {
  const { data } = await api.get<PaginatedResponse<Project>>("/projects/my_campaigns/");
  return data;
}

// POST /api/reports/projects/:projectId/report/
export async function reportProject(projectId: number, reason?: string): Promise<void> {
  const payload = reason ? { reason } : {};
  await api.post(`/reports/projects/${projectId}/report/`, payload);
}
