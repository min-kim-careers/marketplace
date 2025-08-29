'use client'

import ChatProvider from '@/chat/chat-provider'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return <ChatProvider>{children}</ChatProvider>
}
