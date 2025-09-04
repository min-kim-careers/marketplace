import { Profile } from '@/lib/types/profile'

export type ChatRoomItem = {
  alias: string
  name: string
  profile: Profile
}

export type ChatRoom = {
  alias: string
  isSeller: boolean
  item: ChatRoomItem
}
