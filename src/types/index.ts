export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  profilePic: string | null
  country: string | null
  birthdate: string | null
  facebookProfile: string | null
  createdAt: string
}

export interface Category {
  id: number
  name: string
  icon: string
}

export interface ProjectImage {
  id: number
  image: string
}

export interface Project {
  id: number
  title: string
  details: string
  category: Category
  images: ProjectImage[]
  tags: string[]
  totalTarget: number
  totalDonated: number
  avgRating: number
  ratingCount: number
  startDate: string
  endDate: string
  isFeatured: boolean
  isCancelled: boolean
  creator: User
  daysLeft: number
  percentFunded: number
}

export interface Donation {
  id: number
  project: Pick<Project, 'id' | 'title'>
  amount: number
  createdAt: string
}

export interface Comment {
  id: number
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'profilePic'>
  text: string
  createdAt: string
  replies: Comment[]
  parentId: number | null
}

export interface ApiResponse<T> {
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export type ProjectStatus = 'active' | 'completed' | 'cancelled' | 'expired'
export type SortOption = 'latest' | 'most_funded' | 'highest_rated'