import { DEFAULT_ITEM_PAGE_PARAMS } from '@/lib/constants/item-page-params'
import { Item } from '@/lib/types/item'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { createStore } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

export interface ItemPageProps {
  items: Item[]
  count: number
  params: ItemPageParams
  route: string
  recentKeywords: string[]
}

export interface ItemPageState extends ItemPageProps {
  setProps: (props: Partial<ItemPageProps>) => void
}

const createItemPageStore = () =>
  createStore(
    subscribeWithSelector(
      persist<ItemPageState>(
        (set) => {
          return {
            count: 0,
            items: [],
            params: DEFAULT_ITEM_PAGE_PARAMS,
            route: '',
            recentKeywords: [],
            setProps: (props: Partial<ItemPageProps>) =>
              set({
                ...props,
              }),
          }
        },
        {
          name: 'item-page',
          partialize: (state) =>
            ({
              recentKeywords: state.recentKeywords,
            }) as ItemPageState,
        },
      ),
    ),
  )

export default createItemPageStore
