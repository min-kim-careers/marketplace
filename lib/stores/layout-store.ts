import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

export type ItemColumn = 1 | 3

interface LayoutState {
  itemColumns: ItemColumn
  setItemColumns: (itemColumns: ItemColumn) => void
}

const useLayoutStore = create(
  subscribeWithSelector(
    persist<LayoutState>(
      (set) => {
        return {
          itemColumns: 1,
          setItemColumns: (itemColumns: ItemColumn) => set({ itemColumns }),
        }
      },
      {
        name: 'layout',
        partialize: (state) =>
          ({
            itemColumns: state.itemColumns,
          }) as LayoutState,
      },
    ),
  ),
)

export default useLayoutStore
