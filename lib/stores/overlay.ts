import { create } from 'zustand'

type OverlayState = {
  overlayMessage: string | null
  setOverlayMessage: (message: string | null) => void
}

export const useOverlayStore = create<OverlayState>(
  (set) => ({
    overlayMessage: '',
    setOverlayMessage: (message: string | null) => {
      set({ overlayMessage: message })
    },
  }),
)
