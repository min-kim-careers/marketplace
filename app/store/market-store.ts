import {
  fetchCount,
  fetchItems,
} from '@/app/utils/supabase/crud/item'
import { Item } from '@/app/utils/supabase/types/item'
import { create } from 'zustand'
import jsonData from '@/app/data/items.json'

const mockItems: Item[] = jsonData.map((data) => ({
  ...data,
  created_at: new Date(data.created_at),
  updated_at: new Date(data.updated_at),
}))

interface MarketState {
  count: number
  items: Item[]
  getItems: (page: number, limit: number) => void
}

const useMarketStore = create<MarketState>((set) => {
  const getItems = async (page: number, limit: number) => {
    const from = (page - 1) * limit
    const to = page * limit

    const items: Item[] = await fetchItems(from, to)
    set({ items })

    const count: number = await fetchCount()
    set({ count: count })
  }

  return {
    count: mockItems.length,
    items: mockItems,
    getItems,
  }
})

export default useMarketStore
