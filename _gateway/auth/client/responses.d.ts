import { ClientResponseModel } from "@/_gateway/_models/client/response"
import { Profile } from '@/lib/interfaces/profiles'

export interface SignInClientResponse
  extends ClientResponseModel {
  profile?: Profile
}

export interface SignUpClientResponse
  extends ClientResponseModel {}

export interface SignOutClientResponse
  extends ClientResponseModel {}
