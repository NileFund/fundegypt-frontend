import api from "./api";
import { type User } from "../types";
import { setTokens, clearTokens } from "../utils/authHelpers";

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  profilePicture?: File;
}

// POST /accounts/register/
// Sends multipart because profile picture is a file upload
export async function register(data: RegisterData): Promise<void> {
  const form = new FormData();
  form.append("first_name", data.firstName);
  form.append("last_name", data.lastName);
  form.append("email", data.email);
  form.append("password", data.password);
  form.append("phone", data.phone);
  if (data.profilePicture) form.append("profile_picture", data.profilePicture);

  await api.post("/accounts/register/", form);
}

// GET /accounts/activate/<uid>/<token>/
export async function activate(uid: string, token: string): Promise<void> {
  await api.get(`/accounts/activate/${uid}/${token}/`);
}

// POST /accounts/login/
// On success: stores tokens in localStorage so api.ts interceptor picks them up
export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/accounts/login/", { email, password });
  setTokens(data.access, data.refresh);
  return data;
}

// POST /accounts/logout/
export async function logout(refreshToken: string): Promise<void> {
  await api.post("/accounts/logout/", { refresh: refreshToken });
  clearTokens();
}

// GET /accounts/me/  — returns the currently logged-in user
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/accounts/me/");
  return data;
}

// POST /password_reset/
export async function forgotPassword(email: string): Promise<void> {
  await api.post("/password_reset/", { email });
}

// PATCH /accounts/me/  — update profile data
export async function updateProfile(formData: FormData): Promise<User> {
  const { data } = await api.patch<User>("/accounts/me/", formData);
  return data;
}

// DELETE /accounts/me/ — delete account
export async function deleteAccount(password: string): Promise<void> {
  // Axios requires a 'data' object when sending a body with a DELETE request
  await api.delete("/accounts/me/", { data: { password } });
}
