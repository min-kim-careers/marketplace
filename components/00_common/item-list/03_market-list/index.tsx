import { MarketItems } from '@/components/00_common/item-list/03_market-list/market-items'
import { GET_ALL_ITEMS } from '@/lib/clients/item'
import { ItemPageParams } from '@/lib/types/item-page-params'

export default async function MarketList({
  params,
}: {
  params: ItemPageParams
}) {
  const { items, count } = await GET_ALL_ITEMS(params)

  return <MarketItems items={items} count={count} />
}


