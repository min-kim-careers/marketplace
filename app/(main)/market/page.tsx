'use server'

import { getItems } from '@/_gateway/api/item/service'
import Market from '@/components/02_main/market'
import { toUrlParams } from '@/lib/common/helpers'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { MarketParams } from '@/lib/interfaces/market-params'
import { redirect } from 'next/navigation'

const parseUrlParams = async (urlParams: {
  [key: string]: string | string[] | undefined
}): Promise<MarketParams | null> => {
  const marketParams: MarketParams = {
    page: DEFAULT_ITEM_PAGINATION.PAGE,
  }

  if (urlParams.page && Number(urlParams.page) > 0) {
    marketParams.page = Number(urlParams.page)
  } else {
    return null
  }

  if (urlParams.keyword) {
    marketParams.keyword = urlParams.keyword as string
  }

  if (
    urlParams.sortBy &&
    Object.values(ItemSortBy).includes(
      urlParams.sortBy as ItemSortBy,
    )
  ) {
    marketParams.sortBy = urlParams.sortBy as string
  }

  if (
    urlParams.sortBy &&
    Object.values(ItemSortOrder).includes(
      urlParams.sortOrder as ItemSortOrder,
    )
  ) {
    marketParams.sortOrder = urlParams.sortOrder as string
  }

  return marketParams
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const urlParams = await searchParams

  const marketParams = await parseUrlParams(urlParams)

  if (!marketParams)
    redirect(
      `${APP_ROUTES.MARKET}?${toUrlParams({ page: 1 })}`,
    )

  const { items, count } = await getItems(marketParams)

  return (
    <Market
      props={{
        items,
        count,
        params: marketParams,
      }}
    />
  )
}
