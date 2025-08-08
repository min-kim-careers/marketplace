import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

interface LayoutState {
  itemColumns: number
  setItemColumns: (itemColumns: number) => void

  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const useLayoutStore = create(
  subscribeWithSelector(
    persist<LayoutState>(
      (set) => {
        return {
          itemColumns: 1,
          setItemColumns: (itemColumns: number) => set({ itemColumns }),

          sidebarOpen: false,
          setSidebarOpen: (open: boolean) =>
            set({ sidebarOpen: open }),
        }
      },
      {
        name: 'layout',
        partialize: (state) =>
          ({
            itemColumns: state.itemColumns,
            sidebarOpen: state.sidebarOpen,
          }) as LayoutState,
      },
    ),
  ),
)

export default useLayoutStore
