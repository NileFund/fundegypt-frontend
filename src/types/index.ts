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
  donationPercentage: number
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
