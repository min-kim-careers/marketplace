'use client'

import { Item } from '@/lib/interfaces/item'
import { ItemPageParams } from '@/lib/interfaces/item-page-params'
import {
  createContext,
  ReactNode,
  useContext,
  useRef
} from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

interface ItemPageProps {
  items: Item[]
  count: number
  params: ItemPageParams
  route: string
}

interface ItemPageState extends ItemPageProps {
  updateItemAtIndex: (index: number, item: Item) => void
}

const ItemPageContext = createContext<StoreApi<ItemPageState> | null>(null)

export const ItemPageProvider = ({
  children,
  props,
}: {
  children: ReactNode
  props: ItemPageProps
}) => {
  const storeRef = useRef(
    createStore<ItemPageState>((set, get) => ({
      ...props,
      updateItemAtIndex: (index: number, item: Item) => {
        const newItems = [...get().items]
        newItems[index] = item
        set({ items: newItems })
      },
    })),
  )

  return (
    <ItemPageContext.Provider value={storeRef.current}>
      {children}
    </ItemPageContext.Provider>
  )
}

export const useItemPageStore = <T,>(selector: (state: ItemPageState) => T) => {
  const store = useContext(ItemPageContext)
  if (!store) throw new Error('Not inside provider')
  return useStore(store, selector)
}
