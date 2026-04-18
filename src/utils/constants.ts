export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000/api";

export const APP_NAME = import.meta.env.VITE_APP_NAME as string;

export const COLORS = {
  primary: "#2FA084",
  secondary: "#1F6F5F",
  success: "#6FCF97",
  mint: "#D1F2EB",
  page: "#EEEEEE",
  danger: "#E53E3E",
  warning: "#F57F17",
} as const;

export const LIMITS = {
  commentMaxLength: 1000,
  projectTitleMax: 100,
  projectTitleMin: 10,
  projectDetailsMin: 50,
  minDonation: 10,
  maxImageSizeMB: 5,
  maxImageSize: 5 * 1024 * 1024,
} as const;

export const EGYPTIAN_PHONE_REGEX = /^01[0125]\d{8}$/;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ACTIVATE: "/activate/:uid/:token",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  PROFILE: "/profile",
  EDIT_PROFILE: "/profile/edit",
  MY_DONATIONS: "/profile/donations",
  MY_PROJECTS: "/profile/projects",
  EXPLORE: "/projects",
  PROJECT_DETAIL: "/projects/:id",
  CREATE_PROJECT: "/projects/create",
  EDIT_PROJECT: "/projects/:id/edit",
  SEARCH: "/search",
  CATEGORY: "/categories",
  CATEGORY_DETAIL: "/categories/:id",
  DELETE_ACCOUNT: "/profile/delete-account",
  NOT_FOUND: "*",
} as const;
