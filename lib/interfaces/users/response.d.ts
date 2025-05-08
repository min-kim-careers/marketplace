import { User } from "."
import { Response } from "../common"

export interface UserResponse extends Response {
  user: User
}