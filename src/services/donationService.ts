import api from "./api";
import {
  type Donation,
  type DonationSummary,
  type TopDonor,
  type PaginatedResponse,
} from "../types";

// POST /donations/
export async function createDonation(
  projectId: number,
  amount: number
): Promise<Donation> {
  const { data } = await api.post<Donation>("/donations/", {
    project: projectId,
    amount,
  });
  return data;
}

// GET /donations/
export async function getAllDonations(
  page = 1
): Promise<PaginatedResponse<Donation>> {
  const { data } = await api.get<PaginatedResponse<Donation>>(
    `/donations/?page=${page}`
  );
  return data;
}

// GET /donations/my/
export async function getMyDonations(
  page = 1
): Promise<PaginatedResponse<Donation>> {
  const { data } = await api.get<PaginatedResponse<Donation>>(
    `/donations/my/?page=${page}`
  );
  return data;
}

// GET /donations/project/:id/
export async function getProjectDonations(
  projectId: number,
  page = 1
): Promise<PaginatedResponse<Donation>> {
  const { data } = await api.get<PaginatedResponse<Donation>>(
    `/donations/project/${projectId}/?page=${page}`
  );
  return data;
}

// GET /donations/:id/
export async function getDonationDetail(
  donationId: number
): Promise<Donation> {
  const { data } = await api.get<Donation>(`/donations/${donationId}/`);
  return data;
}

// GET /donations/project/:id/summary/
export async function getProjectSummary(
  projectId: number
): Promise<DonationSummary> {
  const { data } = await api.get<DonationSummary>(
    `/donations/project/${projectId}/summary/`
  );
  return data;
}

// GET /donations/project/:id/top-donors/
export async function getTopDonors(
  projectId: number
): Promise<TopDonor[]> {
  const { data } = await api.get<TopDonor[]>(
    `/donations/project/${projectId}/top-donors/`
  );
  return data;
}

// GET /donations/recent/
export async function getRecentDonations(
  page = 1
): Promise<PaginatedResponse<Donation>> {
  const { data } = await api.get<PaginatedResponse<Donation>>(
    `/donations/recent/?page=${page}`
  );
  return data;
}