import { User } from './user'

export interface SignInInternalResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface SignUpInternalResponse {
  user: User
}

export interface RefreshInternalResponse {
  accessToken: string
}
