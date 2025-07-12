import { ChatMode } from "@/chat/enums/chat-mode";

export const ACTIVE_CHAT_MODES = [
  ChatMode.JOINED,
  ChatMode.RESTORED,
  ChatMode.TYPING,
  ChatMode.NOT_TYPING
] as const