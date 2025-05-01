import { create } from 'zustand'

type LoadingState = {
  loading: boolean
  setLoading: (loading: boolean, message?: string) => void
  message: string
}

export const useLoadingStore = create<LoadingState>(
  (set) => ({
    loading: false,
    setLoading: (loading: boolean, message?: string) => {
      set({ loading, message: message || '' })
    },
    
    message: '',
  }),
)
