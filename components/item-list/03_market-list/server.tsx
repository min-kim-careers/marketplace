import { getItems } from '@/api/service/item'
import { MarketList } from '@/components/item-list/03_market-list'
import { ItemPageParams } from '@/lib/types/item-page-params'

export default async function MarketListServer({
  params,
}: {
  params: ItemPageParams
}) {
  const { items, count } = await getItems(params)

  return <MarketList props={{ items, count }} />
}
