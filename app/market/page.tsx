'use server'

import Market from '@/components/02_main/market'
import { GetItemsResponse } from '@/lib/api/items/responses'
import { getItems } from '@/lib/api/items/service'
import { ROUTES } from '@/lib/constants/routes'
import {
  marketParamsToQuery,
  marketToUrlParams,
  serverUrlToMarketParams,
} from '@/lib/helpers/market'
import { redirect } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const urlParams = await searchParams

  const marketParams = serverUrlToMarketParams(urlParams)

  if (!urlParams.page)
    redirect(
      `${ROUTES.MARKET}?${marketToUrlParams(marketParams)}`,
    )

  const query = marketParamsToQuery(marketParams)

  const { items, count }: GetItemsResponse =
    await getItems(query)

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
