import { create } from 'zustand'
import {
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'

interface LayoutState {
  columns: number
  setColumns: (columns: number) => void
}

const useLayoutStore = create(
  subscribeWithSelector(
    persist<LayoutState>(
      (set) => {
        return {
          columns: 1,
          setColumns: (columns: number) => set({ columns }),
        }
      },
      {
        name: 'layout',
        partialize: (state) =>
          ({
            columns: state.columns,
          }) as LayoutState,
      },
    ),
  ),
)

export default useLayoutStore
