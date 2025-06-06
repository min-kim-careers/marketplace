import { create } from 'zustand'

type LoadingState = {
  message: string | null
  isOpaque: boolean
  setLoading: (
    message: string | null,
    isOpaque?: boolean,
  ) => void
}

export const useLoadingStore = create<LoadingState>(
  (set) => ({
    message: null,
    isOpaque: false,
    setLoading: (
      message: string | null,
      isOpaque: boolean = false,
    ) => set({ message, isOpaque }),
  }),
)
