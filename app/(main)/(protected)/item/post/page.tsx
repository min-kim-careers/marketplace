'use server'

import { GET_PROFILE_EXTRA } from '@/_gateway/api/profile/service'
import ItemPost from '@/components/02_main/item/post'

export default async function Page() {
  const extra = await GET_PROFILE_EXTRA()
  const imageLimit = extra ? extra.imageLimit : 0

  return <ItemPost imageLimit={imageLimit} />
}
