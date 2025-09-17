import { ChatTextIn } from '@/chat/types/chat-inbound'
import { cn } from '@/components/shadcn/lib/utils'
import { formatDate } from '@/lib/helpers/format-date'

export default function MessageBubble({ message }: { message: ChatTextIn }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        message.isMe ? 'justify-end' : 'justify-start',
      )}
    >
      {message.read && (
        <span className='text-sm italic text-muted-foreground'>Read</span>
      )}
      <div
        className={cn(
          'flex items-center gap-1 rounded-2xl border p-2',
          message.isMe ? '' : 'bg-secondary',
        )}
      >
        <span>{message.content}</span>
        <span className='text-xs text-muted-foreground'>
          {formatDate(message.timestamp)}
        </span>
      </div>
    </div>
  )
}
