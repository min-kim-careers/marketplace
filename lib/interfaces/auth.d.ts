import { User } from "./api/users"

export interface AuthResponse  {
  user: User
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
  refreshTokenExpires: number
}