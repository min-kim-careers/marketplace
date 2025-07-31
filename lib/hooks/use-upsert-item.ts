'use client'

import { UPSERT_ITEM } from '@/api/item'
import { imageUrlsToFiles } from '@/lib/helpers/image-urls-to-files'
import { useLoadingStore } from '../providers/loading-provider'
import { UpsertItemRequest } from '@gateway/api/item'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useUpsertItem = () => {
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const handleUpsertItem = async (
    request: UpsertItemRequest,
    itemId?: string,
    reroute?: string,
  ) => {
    const isUpdate = !!itemId

    try {
      setLoading(`${isUpdate ? 'Updating' : 'Posting'} your item`, true)

      if (request.imageUrls) {
        request.uploadImages = await imageUrlsToFiles(request.imageUrls)
      }

      const { item } = await UPSERT_ITEM(request, { itemId })

      toast(`Your item was ${isUpdate ? 'updated' : 'posted'} successfully!`)

      if (reroute) router.replace(reroute)

      return true
    } catch (error) {
      console.error(error)

      toast(`Something went wrong.`)

      return false
    } finally {
      setLoading()
    }
  }

  return { handleUpsertItem }
}
