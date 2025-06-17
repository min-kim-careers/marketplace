import {
  Item,
} from '@/lib/interfaces/item'
import { ListingsParams } from '../interfaces/listings-params'
import { create } from 'zustand'
import { DEFAULT_LISTINGS_PARAMS } from '../constants/listings-params'

type ListingStore = {
  items: Item[]
  setItems: (items: Item[]) => void

  count: number
  setCount: (count: number) => void

  params: ListingsParams
  setParams: (params: ListingsParams) => void
}

const useListingsStore = create<ListingStore>((set) => {
  return {
    items: [],
    setItems: (items: Item[]) => set({ items }),

    count: 0,
    setCount: (count: number) => set({ count }),

    params: DEFAULT_LISTINGS_PARAMS,
    setParams: (params: ListingsParams) => set({ params }),
  }
})

export default useListingsStore
