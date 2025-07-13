import { useChatSocketContext } from '@/chat/providers/chat-socket-provider';
import LoadingDots from '@/components/00_common/loading-dots';
import { cn } from '@/components/shadcn/lib/utils';

export function TypingAnimation() {
  const { isTyping } = useChatSocketContext();

  return (
    <div
      className={cn(
        'mb-1 flex items-center justify-end transition-all duration-200 ease-in-out',
        isTyping ? 'h-10 opacity-100' : 'h-0 opacity-0'
      )}
    >
      <div className='max-w-1/2 flex flex-col gap-1 rounded-xl border p-2'>
        <LoadingDots className='h-2 w-2' />
      </div>
    </div>
  );
}
