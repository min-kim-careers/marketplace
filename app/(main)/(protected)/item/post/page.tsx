'use server'

import ItemPost from '@/components/02_content/item-post'
import { GET_ITEM_POST_RESTRAINTS } from '@/gateway/profile'

export default async function Page() {
  const { imageLimit, listingLimitExceeded } =
    await GET_ITEM_POST_RESTRAINTS().catch(() => ({
      imageLimit: 0,
      listingLimitExceeded: true,
    }))

  return <ItemPost props={{ imageLimit, listingLimitExceeded }} />
}
