'use client'

import LoadingDots from '@/components/00_common/loading-dots'
import { cn } from '@/components/shadcn/lib/utils'
import { PropsWithChildren } from 'react'
import { create } from 'zustand'

interface LoadingState {
  message?: string
  isOpaque: boolean
  isLoading: () => boolean
  setLoading: (message?: string, isOpaque?: boolean) => void
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  isOpaque: false,
  isLoading: () => Boolean(get().message),
  setLoading: (message?: string, isOpaque: boolean = false) =>
    set({ message, isOpaque }),
}))

export default function LoadingProvider({ children }: PropsWithChildren) {
  const { message, isOpaque } = useLoadingStore()

  if (!message) return children

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
