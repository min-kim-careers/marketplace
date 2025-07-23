'use server'

import { GET_PROFILE_EXTRA } from '@/lib/clients/profile'
import ItemPost from '@/components/02_content/item-post'

export default async function Page() {
  const extra = await GET_PROFILE_EXTRA()
  const imageLimit = extra ? extra.imageLimit : 0

  return <ItemPost imageLimit={imageLimit} />
}
