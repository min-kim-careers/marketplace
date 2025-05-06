import { Item } from "."

export interface ItemResponse {
  success: bool
  items: List[Item]
  count: number
}