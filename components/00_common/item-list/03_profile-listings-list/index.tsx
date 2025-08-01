import { _getUserItems } from '@/api'
import { ProfileListingItems } from '@/components/00_common/item-list/03_profile-listings-list/profile-listings-items'
import { ItemPageParams } from '@/lib/types/item-page-params'

export default async function ProfileListingsList({
  params,
}: {
  params: ItemPageParams
}) {
  const { items, count } = await _getUserItems(params)

  return <ProfileListingItems items={items} count={count} />
}
