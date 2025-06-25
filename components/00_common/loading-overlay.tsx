'use client'

import LoadingDots from '@/components/00_common/loading-dots'
import { cn } from '@/components/shadcn/lib/utils'
import useLoadingStore from '@/lib/stores/loading-store'

export default function LoadingOverlay() {
  const { message, isOpaque } = useLoadingStore()

  if (!message) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex h-full w-screen flex-col items-center justify-center gap-2 bg-white transition-all duration-200 ease-in-out',
        isOpaque && 'bg-black bg-opacity-75 text-white',
      )}
    >
      {message && <p>{message}</p>}
      <LoadingDots className={cn(isOpaque && 'bg-white')} />
    </div>
  )
}
