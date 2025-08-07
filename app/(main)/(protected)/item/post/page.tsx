'use server'

import { getItemPostRestraints } from '@/api'
import ItemPost from '@/components/02_page/item-post'

export default async function Page() {
  const { imageLimit, exceededListings } = await getItemPostRestraints()
  if (exceededListings)
    throw new Error(
      `You've exceeded your listings. Please delete a listing and come back.`,
    )

  return <ItemPost props={{ imageLimit }} />
}
