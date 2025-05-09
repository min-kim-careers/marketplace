export interface User {
  handle: string
  email: string
  rating: number
  ratingCount: number
  suburb: string
  state: string
  avatarUrl: string
}

export interface Profile {
  handle: string
  email: string
  rating: number
  ratingCount: number
  suburb: string
  state: string
  avatarUrl: string
}

export interface UserResponse {
  user: User
}
