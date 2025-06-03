import { User } from './user'

export interface CustomClaim {
  profile_created: boolean
}

export interface DecodedToken {
  uid: string
  email: string
  picture: string
  claims: CustomClaim
}
