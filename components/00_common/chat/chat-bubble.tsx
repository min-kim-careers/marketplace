import { formatDateFrom } from '@/lib/helpers/format-date-from'
import { IChatMessageChat } from '@/lib/types/chat-message'

export function ChatBubble({ message }: { message: IChatMessageChat }) {
  if (message.isMine)
    return (
      <div className='flex justify-end'>
        <div className='max-w-1/2 flex flex-col items-end gap-1 rounded-lg border p-2'>
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
