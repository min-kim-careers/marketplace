'use client'
import useChatStore from '@/chat/stores/chat-store'
import { UIEvent, useEffect, useRef, useState } from 'react'

export const useScrollHandler = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const messages = useChatStore((state) => state.messages)
  const status = useChatStore((state) => state.status)

  const [atTop, setAtTop] = useState(false)

  useEffect(() => {
    const div = scrollRef.current

    if (div && !atTop) {
      div.scrollTop = div.scrollHeight
    }
  }, [messages.length])

  const handleAtTop = (e: UIEvent<HTMLDivElement>) =>
    setAtTop(e.currentTarget.scrollTop === 0)

  const nudgeDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        top: 20,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    if (atTop) {
      nudgeDown()
    }
  }, [messages.length])

  return {
    scrollRef,
    atTop,
    handleAtTop,
  }
}
