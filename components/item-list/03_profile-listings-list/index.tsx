import { getUserItems } from '@/api'
import { ProfileListingItems } from '@/components/item-list/03_profile-listings-list/profile-listings-items'
import { ItemPageParams } from '@/lib/types/item-page-params'

export default async function ProfileListingsList({
  params,
}: {
  params: ItemPageParams
}) {
  const { items, count } = await getUserItems(params)

  return <ProfileListingItems props={{ items, count }} />
}
