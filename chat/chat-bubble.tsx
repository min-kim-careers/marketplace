import { ChatMode } from '@/chat/enums/chat-mode'
import { ChatMessage } from '@/chat/types/chat-message'
import { formatDateFrom } from '@/lib/helpers/format-date-from'


export function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.mode !== ChatMode.CHAT) return null

  if (message.isMine)
    return (
      <div className='flex justify-end'>
        <div className='max-w-1/2 flex flex-col gap-1 rounded-lg border p-2'>
          <span className='flex items-baseline gap-2'>
            <p>{message.content}</p>
            {message.createdAt && (
              <p className='text-sm text-gray-500'>
                {formatDateFrom(new Date(message.createdAt))}
              </p>
            )}
          </span>
        </div>
      </div>
    )

  return (
    <div className='flex'>
      <div className='max-w-1/2 flex flex-col gap-1 rounded-lg border bg-gray-200 p-2'>
        <span className='flex items-baseline gap-2'>
          <p>{message.content}</p>
          {message.createdAt && (
            <p className='text-sm text-gray-500'>
              {formatDateFrom(new Date(message.createdAt))}
            </p>
          )}
        </span>
      </div>
    </div>
  )
}
