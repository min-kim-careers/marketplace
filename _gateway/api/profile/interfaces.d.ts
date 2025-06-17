export interface UpsertProfileRequest {
  email?: string
  handle?: string
  rating?: number
  ratingCount?: number
  postcode?: string
  avatarUrl?: string
}

export interface ProfileExtra {
  imageLimit: number
}
