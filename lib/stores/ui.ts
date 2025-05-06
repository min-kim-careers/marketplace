import { create } from 'zustand'

type UIState = {
  columns: number
  setColumns: (columns: number) => void
}

export const useUIStore = create<UIState>(
  (set) => ({
    columns: 1,
    setColumns: (columns: number) => set({ columns }),
  }),
)
