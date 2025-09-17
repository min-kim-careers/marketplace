'use client'
import useChatStore from '@/chat/stores/chat-store'
import { UIEvent, useEffect, useRef, useState } from 'react'

export const useScrollHandler = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const messages = useChatStore((state) => state.messages)
  const noMessages = useChatStore((state) => state.noMessages)

  const [atTop, setAtTop] = useState(false)

  useEffect(() => {
    const setToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }

    if (!atTop || noMessages) {
      setToBottom()
    }
  }, [messages.length, noMessages])

  useEffect(() => {
    const nudgeDown = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          top: 20,
        })
      }
    }
    if (atTop) {
      nudgeDown()
    }
  }, [messages.length])

  return {
    scrollRef,
    atTop,
    handleAtTop: (e: UIEvent<HTMLDivElement>) =>
      setAtTop(e.currentTarget.scrollTop === 0),
  }
}
