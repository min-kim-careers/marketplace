import { getUserItems } from '@/api'
import { ProfileListingsList } from '@/components/item-list/03_profile-listings-list'
import { ItemPageParams } from '@/lib/types/item-page-params'

export default async function ProfileListingsListServer({
  params,
}: {
  params: ItemPageParams
}) {
  const { items, count } = await getUserItems(params)

  return <ProfileListingsList props={{ items, count }} />
}
