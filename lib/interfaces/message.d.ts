export interface IMessage {
  message_type: MessageType
  room_id: string
  client_id: string
  timestamp?: string
  message_content?: any
}

type MessageType =
  | 'connect'
  | 'disconnect'
  | 'chat'
  | 'restore'
  | 'empty'

// | 'enter'
// | 'leave'
// | 'typing'
// | 'edit'
// | 'delete'
