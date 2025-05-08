import { Item } from "."
import { Response } from "../common"

export interface ItemResponse extends Response {
  items: List[Item]
  count: number
}