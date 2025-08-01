'use client'

import { _UpsertItemRequest } from '@/api/endpoints/item'
import { upsertItem } from '@/api/service/item'
import { imageUrlsToFiles } from '@/lib/helpers/image-urls-to-files'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useLoadingStore } from '../providers/loading-provider'

export const useUpsertItem = () => {
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const handleUpsertItem = async (
    request: _UpsertItemRequest,
    itemId?: string,
    rerouteUrl?: string,
  ) => {
    const isUpdate = !!itemId
    let toastMsg = ''

    try {
      setLoading(`${isUpdate ? 'Updating' : 'Posting'} your item`, true)

      if (request.imageUrls) {
        request.uploadImages = await imageUrlsToFiles(request.imageUrls)
      }

      if (!(await upsertItem(request, itemId)))
        throw new Error('failed to upsert')

      toastMsg = `Your item was ${isUpdate ? 'updated' : 'posted'} successfully!`

      if (rerouteUrl) router.replace(rerouteUrl)

      return true
    } catch (error) {
      console.error(error)

      toastMsg = `Something went wrong.`

      return false
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
  }

  return { handleUpsertItem }
}
