'use server'

import { getImageLimit } from '@/_gateway/api/profile/service'
import ItemPost from '@/components/02_main/protected/item/post'

export default async function Page() {
  const imageLimit = await getImageLimit()

  return <ItemPost imageLimit={imageLimit} />
}
