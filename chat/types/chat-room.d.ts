import { Profile } from '@/lib/types/profile'

export type ChatRoomItem = {
  alias: string
  name: string
  price: string
  previewUrl?: string
}

export type ChatRoom = {
  alias: string
  isSeller: boolean
  peer: Profile
  item: ChatRoomItem
  unread: boolean
}
