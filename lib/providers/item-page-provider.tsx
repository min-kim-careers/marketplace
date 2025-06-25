'use client'

import { IItem } from '@/lib/interfaces/item'
import { IItemPageParams } from '@/lib/interfaces/item-page-params'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface ItemPageProps {
  items: IItem[]
  count: number
  params: IItemPageParams
  route: string
}

interface ItemPageState extends ItemPageProps {
  updateItemAtIndex: (index: number, item: IItem) => void
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
  const [items, setItems] = useState<IItem[]>(props.items)
  const [count, setCount] = useState<number>(props.count)
  const [params, setParams] = useState<IItemPageParams>(
    props.params,
  )

  useEffect(() => {
    setItems(props.items)
    setCount(props.count)
    setParams(props.params)
  }, [props])

  const updateItemAtIndex = (index: number, item: IItem) =>
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
