'use server'

import { serviceGetItems } from '@/_gateway/api/item/service'
import Market from '@/components/02_main/market'
import {
  marketToUrlParams,
  serverUrlToMarketParams,
} from '@/lib/common/market-helpers'
import { ROUTES } from '@/lib/constants/routes'
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

  const { items, count } =
    await serviceGetItems(marketParams)

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
