export type ChatTypeIn = 'join'

export type ChatMessageIn = {
  isMe: boolean
  content: string
  timestamp: string
}

export type ChatPayloadIn =
  | {
      type: 'join'
      history: ChatMessageIn[]
    }
  | ({
      type: 'text'
    } & ChatMessageIn)
