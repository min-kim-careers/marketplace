export type ChatTextIn = {
  isMe: boolean
  content: string
  timestamp: string
}

export type ChatPayloadIn =
  | {
      type: 'connected'
      sessionId: string
    }
  | {
      type: 'joined'
    }
  | {
      type: 'restore'
      previous: ChatTextIn[]
    }
  | ({
      type: 'text'
    } & ChatTextIn)
