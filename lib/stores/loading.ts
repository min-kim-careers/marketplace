import { create } from 'zustand'

type LoadingState = {
  message: string | null
  setMessage: (message: string | null) => void
}

export const useLoadingStore = create<LoadingState>(
  (set) => ({
    message: null,
    setMessage: (message: string | null) => {
      set({ message: message })
    },
  }),
)
