import { Response } from "../common"
import { User } from "../users"

export interface AuthResponse extends Response {
  user: User
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
  refreshTokenExpires: number
}