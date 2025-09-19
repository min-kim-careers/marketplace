import { ChatTextIn } from '@/chat/types/chat-inbound'
import { cn } from '@/components/shadcn/lib/utils'
import { formatDate } from '@/lib/helpers/format-date'
import { Circle } from 'lucide-react'

export default function MessageBubble({ message }: { message: ChatTextIn }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        message.mine ? 'justify-end' : 'flex-row-reverse justify-end',
      )}
    >
      {message.mine && (
        <Circle
          className={cn(
            'h-2 w-2 stroke-muted-foreground',
            message.read && 'fill-muted-foreground',
          )}
        />
      )}

      <div
        className={cn(
          'flex items-center gap-1 rounded-2xl border p-2',
          message.mine ? '' : 'bg-secondary',
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
