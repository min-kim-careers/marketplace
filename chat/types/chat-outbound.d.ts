export type ChatPayloadOut =
  | {
      type: 'text'
      content: string
    }
  | {
      type: 'join'
      roomAlias: string
    }
  | {
      type: 'restore'
      since: string
    }
