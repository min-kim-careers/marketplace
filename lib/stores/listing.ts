// import { serviceGetSortOptions } from '@/_gateway/api/items/service'
import {
  Item,
  // ItemSortOption,
} from '@/lib/interfaces/item'
import { ListingsParams } from '../interfaces/listings-params'
import { create } from 'zustand'

type ListingStore = {
  items: Item[]
  setItems: (items: Item[]) => void

  count: number
  setCount: (count: number) => void

  params: ListingsParams
  setParams: (params: ListingsParams) => void
}

const useListingStore = create<ListingStore>((set) => {
  return {
    items: [],
    setItems: (items: Item[]) => set({ items }),

    count: 0,
    setCount: (count: number) => set({ count }),

    params: { page: 1 },
    setParams: (params: ListingsParams) => set({ params }),
  }
})

export default useListingStore
