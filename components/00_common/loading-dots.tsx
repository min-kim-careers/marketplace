import { cn } from '../shadcn/lib/utils'

export default function LoadingDots({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={
        'flex items-center justify-center gap-4 p-2 dark:invert'
      }
    >
      <div
        className={cn(
          `h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:-0.3s]`,
          className,
        )}
      />
      <div
        className={cn(
          `h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:-0.15s]`,
          className,
        )}
      />
      <div
        className={cn(
          `h-3 w-3 animate-bounce rounded-full bg-white`,
          className,
        )}
      />
    </div>
  )
}
