import ChatProvider from '@/chat/chat-provider'
import { PropsWithChildren } from 'react'

export default async function Layout({ children }: PropsWithChildren) {
  return <ChatProvider>{children}</ChatProvider>
}
