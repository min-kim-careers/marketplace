import { create } from 'zustand'

type LoadingState = {
  setLoadingMessage: (message: string | null) => void
  loadingMessage: string | null
}

export const useLoadingStore = create<LoadingState>(
  (set) => ({
    loadingMessage: '',
    setLoadingMessage: (message: string | null) => {
      set({ loadingMessage: message })
    },
  }),
)
