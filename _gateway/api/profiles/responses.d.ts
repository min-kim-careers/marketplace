import { Profile } from '@/lib/interfaces/profiles'

export interface CreateProfileServiceResponse {
  profile: Profile | null
}

export interface GetProfileServiceResponse {
  profile: Profile | null
}
