'use client'
import useChatStore from '@/chat/stores/chat-store'
import { UIEvent, useEffect, useRef, useState } from 'react'

type ScreenPosition = 'top' | 'bottom'

export const useScrollHandler = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const messages = useChatStore((state) => state.messages)
  const peerTyping = useChatStore((state) => state.peerTyping)

  const [position, setPosition] = useState<ScreenPosition | null>(null)
  const [timesteps, setTimesteps] = useState<string[]>(['', ''])

  useEffect(() => {
    if (messages.length) {
      setTimesteps((p) => [p[1], messages[0].timestamp])
    } else {
      setTimesteps(['', ''])
    }
  }, [messages.length])

  const setToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    const didRestoreMessages = () => timesteps[0] === timesteps[1]
    if (!didRestoreMessages()) {
      setToBottom()
    }
  }, [timesteps])

  useEffect(() => setToBottom(), [peerTyping])

  useEffect(() => {
    const nudgeDown = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          top: 20,
        })
      }
    }
    if (position) {
      nudgeDown()
    }
  }, [messages.length])

  return {
    scrollRef,
    position,
    handlePosition: (e: UIEvent<HTMLDivElement>) => {
      if (e.currentTarget.scrollTop === 0) {
        setPosition('top')
      } else if (
        e.currentTarget.scrollTop + e.currentTarget.clientHeight >=
        e.currentTarget.scrollHeight - 1
      ) {
        setPosition('bottom')
      } else {
        setPosition(null)
      }
    },
  }
}
