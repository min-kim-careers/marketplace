'use client'

import { ChatSocketProvider } from '@/chat/providers/chat-socket-provider'

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ChatSocketProvider>{children}</ChatSocketProvider>
}
