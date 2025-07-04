import { create } from 'zustand'

interface LoadingState {
  message: string | null
  isOpaque: boolean
  isLoading: () => boolean
  setLoading: (message: string | null, isOpaque?: boolean) => void
}

const useLoadingStore = create<LoadingState>((set, get) => ({
  message: null,
  isOpaque: false,
  isLoading: () => Boolean(get().message),
  setLoading: (message: string | null, isOpaque: boolean = false) =>
    set({ message, isOpaque }),
}))

export default useLoadingStore
