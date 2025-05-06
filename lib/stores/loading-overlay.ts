import { create } from 'zustand'

type LoadingOverlayState = {
  setLoadingMessage: (message: string | null) => void
  loadingMessage: string | null
}

export const useLoadingOverlayStore = create<LoadingOverlayState>(
  (set) => ({
    loadingMessage: '',
    setLoadingMessage: (message: string | null) => {
      set({ loadingMessage: message })
    },
  }),
)
