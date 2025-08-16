import { ChatMessage } from "@/lib/types/chat-message";


export type ChatPayload = { type: 'history'; data: ChatMessage[]; } |
{ type: 'message'; data: ChatMessage; };
