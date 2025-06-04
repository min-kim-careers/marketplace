'use client'

import LoadingDots from '@/components/00_common/loading-dots'
import { cn } from '@/components/shadcn/lib/utils'
import { useLoadingStore } from '@/lib/stores/loading'
import { ReactNode } from 'react'

export default function LoadingProvider({
  children,
}: {
  children: ReactNode
}) {
  const { message } = useLoadingStore()

  if (message)
    return (
      <div
        className={cn(
          'fixed inset-0 flex h-full w-screen flex-col items-center justify-center gap-2 transition-all duration-200 ease-in-out',
          // message
          //   ? 'z-[100] opacity-100'
          //   : 'z-[-1] opacity-0',
        )}
      >
        {message && <p>{message}</p>}
        <LoadingDots />
      </div>
    )
    
  return children
}
