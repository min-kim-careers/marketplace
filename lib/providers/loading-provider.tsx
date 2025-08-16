'use client'

import LoadingDots from '@/components/loading-dots'
import { cn } from '@/components/shadcn/lib/utils'
import { PropsWithChildren } from 'react'
import { create } from 'zustand'

interface LoadingState {
  message?: string
  isLoading: () => boolean
  setLoading: (message?: string) => void
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  isLoading: () => Boolean(get().message),
  setLoading: (message?: string) => set({ message }),
}))

export default function LoadingProvider({ children }: PropsWithChildren) {
  const { message } = useLoadingStore()

  return (
    <>
      {message && (
        <div
          className={cn(
            'fixed inset-0 z-[100] flex h-full w-screen flex-col items-center justify-center gap-2 bg-white/50 transition-all duration-200 ease-in-out',
          )}
        >
          {message && <p>{message}</p>}
          <LoadingDots />
        </div>
      )}
      {children}
    </>
  )
}
