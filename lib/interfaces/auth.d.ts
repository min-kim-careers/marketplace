import { User } from "./api/users"
import { Profile } from "./users"

export interface AuthResponseServer  {
  profile: Profile
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
  refreshTokenExpires: number
}

export interface AuthResponseClient  {
  profile: Profile
}