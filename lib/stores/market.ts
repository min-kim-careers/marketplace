import { Item } from '@/lib/interfaces/item'
import { create } from 'zustand'
import { MarketParams } from '../interfaces/market-params'
import { DEFAULT_MARKET_PARAMS } from '@/lib/constants/market-params'

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

    params: DEFAULT_MARKET_PARAMS,
    setParams: (params: MarketParams) => set({ params }),
  }
})

export default useMarketStore
