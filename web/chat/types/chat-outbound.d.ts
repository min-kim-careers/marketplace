export type ChatTextOut = {
  type: 'text'
  content: string
}

export type ChatJoinOut = {
  type: 'join'
  roomAlias: string
}

export type ChatRestoreOut = {
  type: 'restore'
  since: string
}

export type ChatTypingOut = {
  type: 'typing'
  typing: boolean
}

export type ChatPayloadOut =
  | ChatTextOut
  | ChatJoinOut
  | ChatRestoreOut
  | ChatTypingOut
