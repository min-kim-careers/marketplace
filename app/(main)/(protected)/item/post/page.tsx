'use server'

import { getItemPostRestraints } from '@/api'
import ItemPost from '@/components/02_content/item-post'

export default async function Page() {
  const { imageLimit, exceededListings } = await getItemPostRestraints()
  if (exceededListings) throw new Error()

  return <ItemPost props={{ imageLimit }} />
}
