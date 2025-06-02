import { User } from './user'

export interface DecodedToken {
  uid: string
  email: string
  name: string
  picture: string
}
