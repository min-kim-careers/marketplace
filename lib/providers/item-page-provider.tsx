import { DEFAULT_ITEM_PAGE_PARAMS } from '@/lib/constants/item-page-params'
import { Item } from '@/lib/interfaces/item'
import { ItemPageParams } from '@/lib/interfaces/listings-params'
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

  setItems: (item: any) => void
  setCount: (count: number) => void
  setParams: (params: ItemPageParams) => void
}

const ItemPageContext = createContext<
  ItemPageState | undefined
>(undefined)

export const ItemPageProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [params, setParams] = useState(
    DEFAULT_ITEM_PAGE_PARAMS,
  )

  return (
    <ItemPageContext.Provider
      value={{
        items,
        count,
        params,

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
