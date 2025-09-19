export type ChatConnectedIn = {
  type: 'connected'
}

export type ChatJoinedIn = {
  type: 'joined'
  peerLastRead: string
}

export type ChatRestoreIn = {
  type: 'restored'
  previous: ChatTextIn[]
}

export type ChatTextIn = {
  type: 'text'
  mine: boolean
  content: string
  timestamp: string
  read: boolean
}

export type ChatErrorIn = {
  type: 'error'
  message?: string
}

export type ChatReadIn = {
  type: 'read'
  lastRead: string
}

export type ChatPayloadIn =
  | ChatConnectedIn
  | ChatJoinedIn
  | ChatRestoreIn
  | ChatTextIn
  | ChatErrorIn
  | ChatReadIn
