import {
  Item,
} from '@/lib/interfaces/item'
import { ItemPageParams } from '../interfaces/listings-params'
import { create } from 'zustand'
import { DEFAULT_ITEM_PAGE_PARAMS } from '../constants/item-page-params'

type ListingStore = {
  items: Item[]
  setItems: (items: Item[]) => void

  count: number
  setCount: (count: number) => void

  params: ItemPageParams
  setParams: (params: ItemPageParams) => void
}

const useListingsStore = create<ListingStore>((set) => {
  return {
    items: [],
    setItems: (items: Item[]) => set({ items }),

    count: 0,
    setCount: (count: number) => set({ count }),

    params: DEFAULT_ITEM_PAGE_PARAMS,
    setParams: (params: ItemPageParams) => set({ params }),
  }
})

export default useListingsStore
