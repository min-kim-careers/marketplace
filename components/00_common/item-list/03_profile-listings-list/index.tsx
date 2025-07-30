import { ProfileListingItems } from '@/components/00_common/item-list/03_profile-listings-list/profile-listings-items'
import { GET_ALL_ITEMS_BY_USER } from '@/lib/clients/item'
import { ItemPageParams } from '@/lib/types/item-page-params'

export default async function ProfileListingsList({
  params,
}: {
  params: ItemPageParams
}) {
  const { items, count } = await GET_ALL_ITEMS_BY_USER(params)

  return <ProfileListingItems items={items} count={count} />
}
