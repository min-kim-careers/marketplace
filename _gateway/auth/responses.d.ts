import { GatewayResponse } from "@/_gateway/_common/response"
import { Profile } from '@/lib/interfaces/profiles'

export interface SignInClientResponse
  extends GatewayResponse {
  profile?: Profile
}

export interface SignUpClientResponse
  extends GatewayResponse {}

export interface SignOutClientResponse
  extends GatewayResponse {}
