'use server'

import { getProfileExtra } from '@/_gateway/api/profile/service'
import ItemPost from '@/components/02_main/item-post'

export default async function Page() {
  const extra = await getProfileExtra()
  const imageLimit = extra ? extra.imageLimit : 0

  return <ItemPost imageLimit={imageLimit} />
}
