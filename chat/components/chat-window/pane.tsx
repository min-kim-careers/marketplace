import { ChatBubble } from '@/chat/components/chat-bubble'
import { useChatSocketContext } from '@/chat/providers/chat-socket-provider'
import { TypingBubble } from '@/chat/ui/typing-bubble'
import { formatDate } from '@/lib/helpers/format-date'
import { useRef, useEffect } from 'react'

export function ChatPane() {
  const { senders, chatMessages, noMessages } = useChatSocketContext()
  const noMessagesRef = useRef(noMessages)

  useEffect(() => {
    noMessagesRef.current = noMessages
  }, [noMessages])

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = divRef.current
    if (!container) return

    const handleScroll = () => {
      if (noMessagesRef.current) return

      const atTop =
        container.clientHeight - container.scrollTop >=
        container.scrollHeight - 1
      if (atTop) {
        senders.sendRestore()
      }
    }

    const checkOverflow = () => {
      const isOverflowing =
        container.scrollHeight > container.clientHeight ||
        container.scrollWidth > container.clientWidth
      return isOverflowing
    }

    const handleWheel = (event: WheelEvent) => {
      if (noMessagesRef.current) return

      if (!checkOverflow()) {
        if (event.deltaY < -50) {
          senders.sendRestore()
        }
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: true })
    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div
      ref={divRef}
      className='flex flex-1 flex-col-reverse gap-2 overflow-y-auto'
    >
      <TypingBubble />
      {chatMessages.map((m, i) => {
        let dateDivider: string | null = null
        if (i < chatMessages.length - 1) {
          const prevDate = new Date(chatMessages[i + 1].createdAt)
          const currDate = new Date(chatMessages[i].createdAt)

          const prevDayStart = new Date(
            prevDate.getFullYear(),
            prevDate.getMonth(),
            prevDate.getDate(),
          )
          const currDayStart = new Date(
            currDate.getFullYear(),
            currDate.getMonth(),
            currDate.getDate(),
          )
          if (currDayStart.getTime() > prevDayStart.getTime()) {
            dateDivider = formatDate(currDate)
          }
        } else if (i === chatMessages.length - 1) {
          dateDivider = formatDate(new Date(chatMessages[i].createdAt))
        }
        return (
          <div key={i}>
            {dateDivider && (
              <div className='my-4 flex items-center justify-center'>
                {dateDivider}
              </div>
            )}
            <ChatBubble message={m} />
          </div>
        )
      })}
      {noMessages && (
        <div className='py-2 text-center italic text-gray-500'>
          No more messages
        </div>
      )}
    </div>
  )
}
