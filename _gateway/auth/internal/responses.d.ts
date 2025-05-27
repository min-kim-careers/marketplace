import { User } from "./models"


export interface SignInServerResponse {
  user: User
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
}

export interface SignUpServerResponse {
  user: User
}

export interface RefreshServerResponse {
  accessToken: string
  accessTokenExpires: number
}
