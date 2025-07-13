import { ChatMode } from '@/chat/enums/chat-mode'
import { isInConst } from '@/lib/helpers/is-in-const'

export const ACTIVE_CHAT_MODES = [
  ChatMode.JOINED,
  ChatMode.RESTORED,
  ChatMode.TYPING,
  ChatMode.NOT_TYPING,
] as const

export const isActiveMode = (mode: ChatMode) =>
  isInConst(mode, ACTIVE_CHAT_MODES)
