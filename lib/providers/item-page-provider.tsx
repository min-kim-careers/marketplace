'use client'

import createItemPageStore, {
  ItemPageProps,
  ItemPageState,
} from '@/lib/stores/item-page-store'
import { createContext, ReactNode, useContext, useEffect, useRef } from 'react'
import { StoreApi, useStore } from 'zustand'

const ItemPageContext = createContext<StoreApi<ItemPageState> | null>(null)

export const ItemPageProvider = ({
  children,
  props,
}: {
  children: ReactNode
  props: Partial<ItemPageProps>
}) => {
  const storeRef = useRef<StoreApi<ItemPageState>>(createItemPageStore())

  useEffect(() => storeRef.current.setState({ ...props }), [props])

  return (
    <ItemPageContext.Provider value={storeRef.current}>
      {children}
    </ItemPageContext.Provider>
  )
}

export const useItemPageContext = () => {
  const store = useContext(ItemPageContext)
  if (!store) throw new Error('Not inside provider')
  return useStore(store)
}
