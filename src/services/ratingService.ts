import api from "./api";
import type { PaginatedResponse } from "../types";


export interface RatingSummary {
  projectId: number;
  averageRating: number;
  totalRatings: number;
  distribution: Record<string, number>;
}

export interface RatingUser {
  email: string;
  fullName: string;
  profilePicture: string | null;
}

export interface Rating {
  id: number;
  user: RatingUser;
  value: number;
  createdAt: string;
}


// GET /ratings/projects/:id/ratings/summary/
export async function getRatingSummary(projectId: number): Promise<RatingSummary> {
  const { data } = await api.get<RatingSummary>(`/ratings/projects/${projectId}/ratings/summary/`);
  return data;
}

// GET /ratings/projects/:id/ratings/list/
export async function getProjectRatings(projectId: number, page = 1): Promise<PaginatedResponse<Rating>> {
  const { data } = await api.get<PaginatedResponse<Rating>>(`/ratings/projects/${projectId}/ratings/list/?page=${page}`);
  return data;
}

// POST /ratings/projects/:id/ratings/
export async function createRating(projectId: number, value: number): Promise<void> {
  await api.post(`/ratings/projects/${projectId}/ratings/`, { value });
}

// PATCH /ratings/projects/:id/ratings/update/
export async function updateRating(projectId: number, value: number): Promise<void> {
  await api.patch(`/ratings/projects/${projectId}/ratings/update/`, { value });
}