import { Profile } from '@/lib/interfaces/users'

export interface SignInServerResponse {
  profile: Profile
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
  refreshTokenExpires: number
}

export interface SignInResponse {
  profile: Profile
}

export interface SignUpResponse {
  success: boolean
}

export interface SignOutResponse {
  success: boolean
}

export interface RefreshServerResponse {
  accessToken: string
  accessTokenExpires: number
}
