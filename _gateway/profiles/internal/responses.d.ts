import { Profile } from '@/lib/interfaces/profiles'

export interface UpsertProfileServerResponse {
  profile: Profile
}

export interface GetProfileServerResponse {
  profile: Profile
}
