import { create } from 'zustand'

type LayoutState = {
  columns: number
  setColumns: (columns: number) => void
}

export const useLayoutStore = create<LayoutState>(
  (set) => ({
    columns: 1,
    setColumns: (columns: number) => set({ columns }),
  }),
)
