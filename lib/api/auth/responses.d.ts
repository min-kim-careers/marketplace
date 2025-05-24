import { Profile } from '@/lib/interfaces/profiles'

export interface SignInServerResponse {
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
}

export interface SignInResponse {
  success: boolean
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
