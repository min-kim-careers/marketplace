import { getUserItems } from '@/api'
import { ProfileListingItems } from '@/components/00_common/item-list/03_profile-listings-list/profile-listings-items'
import { ItemPageParams } from '@/lib/types/item-page-params'

export default async function ProfileListingsList({
  params,
}: {
  params: ItemPageParams
}) {
  const { items, count } = await getUserItems(params)

  // items.forEach((i) => {
  //   i.imageUrls = [`/images/5eac1a2ade364be5b918b13b7a62eeeb_b6814cd7-8fcd-4693-b47e-e1d37f91d52d.jpeg`]
  // })

  // items.forEach((i) => console.log(i.imageUrls))

  return <ProfileListingItems items={items} count={count} />
}
