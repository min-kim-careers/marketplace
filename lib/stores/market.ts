import { serviceGetSortOptions } from '@/_gateway/api/items/service'
import {
  Item,
  MarketParams,
  SortOption,
} from '@/lib/interfaces/items'
import { create } from 'zustand'

type MarketState = {
  items: Item[]
  setItems: (items: Item[]) => void

  count: number
  setCount: (count: number) => void

  params: MarketParams
  setParams: (params: MarketParams) => void

  sortOptions: SortOption[]
  fetchSortOptions: () => void
}

export const useMarketStore = create<MarketState>((set) => {
  return {
    items: [],
    setItems: (items: Item[]) => set({ items }),

    count: 0,
    setCount: (count: number) => set({ count }),

    params: { page: 1 },
    setParams: (params: MarketParams) => set({ params }),

    sortOptions: [],
    fetchSortOptions: async () => {
      try {
        const sortOptions =
          await serviceGetSortOptions()
        set({ sortOptions })
      } catch (_) {
        set({ sortOptions: [] })
      }
    },
  }
})
