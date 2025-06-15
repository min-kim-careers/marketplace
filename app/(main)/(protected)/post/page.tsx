'use server'

import { getProfileExtra } from '@/_gateway/api/profile/service'
import ItemPost from '@/components/02_main/protected/item/post'
import { logError } from '@/lib/utils/log'

export default async function Page() {
  let imageLimit = 0
  try {
    const extra = await getProfileExtra()
    imageLimit = extra.imageLimit
  } catch (error) {
    logError(error);
  }

  return <ItemPost imageLimit={imageLimit} />
}
