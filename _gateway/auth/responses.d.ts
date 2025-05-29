import { ServiceResponse } from '@/_gateway/_common/service.response'
import { Profile } from '@/lib/interfaces/profiles'

export interface SignInServiceResponse
  extends ServiceResponse {
  profile?: Profile
}

export interface SignUpServiceResponse
  extends ServiceResponse {}

export interface SignOutServiceResponse
  extends ServiceResponse {}

export interface VerifyServiceResponse
  extends ServiceResponse {}
  
export interface RefreshServiceResponse
  extends ServiceResponse {}
