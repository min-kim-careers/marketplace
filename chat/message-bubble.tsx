import { ChatTextIn } from '@/chat/types/chat-inbound'
import { cn } from '@/components/shadcn/lib/utils'
import { formatDate } from '@/lib/helpers/format-date'

export default function MessageBubble({ message }: { message: ChatTextIn }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2',
        message.mine ? 'justify-end' : 'flex-row-reverse justify-end',
      )}
    >
      {message.mine && (
        <div
          className={cn(
            'rounded-full bg-muted-foreground/60 transition-all duration-300',
            message.read ? 'h-[6px] w-[6px]' : 'h-[2px] w-[8px]',
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
