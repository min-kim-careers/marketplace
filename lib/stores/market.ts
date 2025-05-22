import { getSortOptions } from '@/lib/api/items/service'
import { Item, MarketParams } from '@/lib/interfaces/items'
import { create } from 'zustand'

type MarketState = {
  items: Item[]
  setItems: (items: Item[]) => void

  count: number
  setCount: (count: number) => void

  params: MarketParams
  setParams: (params: MarketParams) => void

  sortTypes: string[]
  fetchSortTypes: () => void
}

export const useMarketStore = create<MarketState>((set) => {
  return {
    items: [],
    setItems: (items: Item[]) => set({ items }),

    count: 0,
    setCount: (count: number) => set({ count }),

    params: { page: 1 },
    setParams: (params: MarketParams) => set({ params }),

    sortTypes: [],
    fetchSortTypes: async () => {
      try {
        const { sortOptions: sortTypes } = await getSortOptions()
        set({ sortTypes })
      } catch (error) {
        console.error('Failed to fetch sort orders:', error)
      }
    },
  }
})
