'use client'

import { Item } from '@/lib/interfaces/item'
import { ItemPageParams } from '@/lib/interfaces/item-page-params'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface ItemPageProps {
  items: Item[]
  count: number
  params: ItemPageParams
  route: string
}

interface ItemPageState extends ItemPageProps {
  updateItemAtIndex: (index: number, item: Item) => void
}

const ItemPageContext = createContext<ItemPageState | null>(
  null,
)

export const ItemPageProvider = ({
  children,
  props,
}: {
  children: ReactNode
  props: ItemPageProps
}) => {
  const [items, setItems] = useState<Item[]>(props.items)
  const [count, setCount] = useState<number>(props.count)
  const [params, setParams] = useState<ItemPageParams>(
    props.params,
  )

  useEffect(() => {
    setItems(props.items)
    setCount(props.count)
    setParams(props.params)
  }, [props])

  const updateItemAtIndex = (index: number, item: Item) =>
    setItems((prev) => {
      const newItems = [...prev]
      newItems[index] = item
      return newItems
    })

  return (
    <ItemPageContext.Provider
      value={{
        items,
        count,
        params,
        route: props.route,

        updateItemAtIndex,
      }}
    >
      {children}
    </ItemPageContext.Provider>
  )
}

export const useItemPageContext = () => {
  const context = useContext(ItemPageContext)
  if (!context) throw new Error('Not inside provider')
  return context
}
