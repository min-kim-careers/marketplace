// import { serviceGetSortOptions } from '@/_gateway/api/items/service'
import {
  Item,
  // ItemSortOption,
} from '@/lib/interfaces/item'
import { MarketParams } from '../interfaces/market-params'
import { create } from 'zustand'

type MarketState = {
  items: Item[]
  setItems: (items: Item[]) => void

  count: number
  setCount: (count: number) => void

  params: MarketParams
  setParams: (params: MarketParams) => void
}

const useMarketStore = create<MarketState>((set) => {
  return {
    items: [],
    setItems: (items: Item[]) => set({ items }),

    count: 0,
    setCount: (count: number) => set({ count }),

    params: { page: 1 },
    setParams: (params: MarketParams) => set({ params }),
  }
})

export default useMarketStore
