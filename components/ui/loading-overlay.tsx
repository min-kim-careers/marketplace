import { cn } from '../shadcn/lib/utils'
import LoadingDots from './loading-dots'

export default function LoadingOverlay({
  className,
  message,
  show,
}: {
  className?: string
  message?: string
  show: boolean
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 flex h-full w-screen flex-col items-center justify-center gap-2 bg-black/50 text-white transition-all duration-200 ease-in-out',
        className,
        show ? 'z-[100] opacity-100' : 'z-[-1] opacity-0',
      )}
    >
      {!!message && <p>{message}</p>}
      <LoadingDots />
    </div>
  )
}
