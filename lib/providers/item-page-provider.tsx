'use client'

import { DEFAULT_ITEM_PAGE_PARAMS } from '@/lib/constants/item-page-params'
import { Item } from '@/lib/types/item'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

interface ItemPageProps {
  items: Item[]
  count: number
  params: ItemPageParams
  route: string
}

interface ItemPageState extends ItemPageProps {
  setProps: (props: Partial<ItemPageProps>) => void
}

const ItemPageContext = createContext<StoreApi<ItemPageState> | null>(null)

export const ItemPageProvider = ({
  children,
  props,
}: {
  children: ReactNode
  props: Partial<ItemPageProps>
}) => {
  const storeRef = useRef(
    createStore<ItemPageState>((set, get) => ({
      count: 0,
      items: [],
      params: DEFAULT_ITEM_PAGE_PARAMS,
      route: '',
      ...props,
      setProps: (props: Partial<ItemPageProps>) =>
        set({
          ...props,
        }),
    })),
  )

  useEffect(() => storeRef.current.setState({ ...props }), [props])

  return (
    <ItemPageContext.Provider value={storeRef.current}>
      {children}
    </ItemPageContext.Provider>
  )
}

export const useItemPageStore = () => {
  const store = useContext(ItemPageContext)
  if (!store) throw new Error('Not inside provider')
  return useStore(store)
}

export const useItemPageSelector = <T,>(
  selector: (state: ItemPageState) => T,
) => {
  const store = useContext(ItemPageContext)
  if (!store) throw new Error('Not inside provider')
  return useStore(store, selector)
}
