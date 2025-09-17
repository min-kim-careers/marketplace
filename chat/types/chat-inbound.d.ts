export type ChatConnectedIn = {
  type: 'connected'
}

export type ChatJoinedIn = {
  type: 'joined'
  peerLastRead: Date
}

export type ChatRestoreIn = {
  type: 'restore'
  previous: ChatTextIn[]
}

export type ChatTextIn = {
  type: 'text'
  isMe: boolean
  content: string
  timestamp: string
  read: boolean
}

export type ChatErrorIn = {
  type: 'error'
  message?: string
}

export type ChatPayloadIn =
  | ChatConnectedIn
  | ChatJoinedIn
  | ChatRestoreIn
  | ChatTextIn
  | ChatErrorIn
