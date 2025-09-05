import { cn } from './shadcn/lib/utils'

export default function LoadingDots({
  className,
  size = 3,
}: {
  className?: string
  size?: number
}) {
  return (
    <div className={'flex items-center justify-center gap-4 p-2 dark:invert'}>
      <div
        className={cn(
          `h-${size} w-${size} animate-bounce rounded-full bg-black [animation-delay:-0.3s]`,
          className,
        )}
      />
      <div
        className={cn(
          `h-${size} w-${size} animate-bounce rounded-full bg-black [animation-delay:-0.15s]`,
          className,
        )}
      />
      <div
        className={cn(
          `h-${size} w-${size} animate-bounce rounded-full bg-black`,
          className,
        )}
      />
    </div>
  )
}
