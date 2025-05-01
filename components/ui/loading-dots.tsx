import { cn } from '../shadcn/lib/utils'

export default function LoadingDots({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4 p-2 dark:invert',
        className,
      )}
    >
      <div className='w-3 h-3 animate-bounce rounded-full bg-white [animation-delay:-0.3s]' />
      <div className='w-3 h-3 animate-bounce rounded-full bg-white [animation-delay:-0.15s]' />
      <div className='w-3 h-3 animate-bounce rounded-full bg-white' />
    </div>
  )
}
