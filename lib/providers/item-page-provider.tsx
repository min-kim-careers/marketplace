import { DEFAULT_ITEM_PAGE_PARAMS } from '@/lib/constants/item-page-params'
import { Item } from '@/lib/interfaces/item'
import { ItemPageParams } from '@/lib/interfaces/item-page-params'
import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react'

export interface ItemPageState {
  items: Item[]
  count: number
  params: ItemPageParams
  route: string

  setItems?: (item: any) => void
  setCount?: (count: number) => void
  setParams?: (params: ItemPageParams) => void
}

const ItemPageContext = createContext<
  ItemPageState | undefined
>(undefined)

export const ItemPageProvider = ({
  children,
  value,
}: {
  children: ReactNode
  value: ItemPageState
}) => {
  const [items, setItems] = useState<Item[]>([])
  const [count, setCount] = useState<number>(0)
  const [params, setParams] = useState<ItemPageParams>(
    DEFAULT_ITEM_PAGE_PARAMS,
  )

  return (
    <ItemPageContext.Provider
      value={{
        ...value,

        setItems,
        setCount,
        setParams,
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
