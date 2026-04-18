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
  description: string
}

export interface Tag {
  id: number
  name: string
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
  pictures: ProjectImage[]
  tags: Tag[]
  totalTarget: number
  totalDonated: number
  averageRating: number
  startTime: string
  endTime: string
  isFeatured: boolean
  status: string
  owner: string        // full name from backend
  ownerId: number
  donationPercentage: number,
  createdAt: string
}

export interface Comment {  id: number
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'profilePic'>
  text: string
  createdAt: string
  replies: Comment[]
  parentId: number | null
}
export interface Donation {
  id: number;
  amount: number;
  project: number;
  project_title?: string;
  project_image?: string;
  donor: number;
  donor_name?: string;
  created_at: string;
}
 
export interface DonationSummary {
  project_id: number;
  target: number;
  total_donated: number;
  remaining: number;
  percentage: number;
}
 
export interface TopDonor {
  email: string;
  full_name: string;
  profile_picture: string | null;
  total: number;
}
 
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
