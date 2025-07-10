import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

interface LayoutState {
  itemColumns: number
  setItemColumns: (columns: number) => void

  chatSidebarOpen: boolean
  setChatSidebarOpen: (open: boolean) => void
}

const useLayoutStore = create(
  subscribeWithSelector(
    persist<LayoutState>(
      (set) => {
        return {
          itemColumns: 1,
          setItemColumns: (columns: number) => set({ itemColumns: columns }),

          chatSidebarOpen: false,
          setChatSidebarOpen: (open: boolean) => set({ chatSidebarOpen: open }),
        }
      },
      {
        name: 'layout',
        partialize: (state) =>
          ({
            itemColumns: state.itemColumns,
            chatSidebarOpen: state.chatSidebarOpen,
          }) as LayoutState,
      },
    ),
  ),
)

export default useLayoutStore
