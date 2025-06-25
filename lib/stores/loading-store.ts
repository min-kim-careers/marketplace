import { create } from 'zustand'

interface LoadingState {
  message: string | null
  isOpaque: boolean
  setLoading: (
    message: string | null,
    isOpaque?: boolean,
  ) => void
}

const useLoadingStore = create<LoadingState>((set) => ({
  message: null,
  isOpaque: false,
  setLoading: (
    message: string | null,
    isOpaque: boolean = false,
  ) => set({ message, isOpaque }),
}))

export default useLoadingStore
