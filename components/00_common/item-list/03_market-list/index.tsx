import { getItems } from '@/api/service/item'
import { MarketItems } from '@/components/00_common/item-list/03_market-list/market-items'
import { hasSession } from '@/lib/helpers/server/has-session'
import { ItemPageParams } from '@/lib/types/item-page-params'

export default async function MarketList({
  params,
}: {
  params: ItemPageParams
}) {
  const { items, count } = await getItems(params, await hasSession())

  return <MarketItems items={items} count={count} />
}
