import { UPSERT_ITEM } from '@/lib/clients/item'
import { imageUrlsToFiles } from '@/lib/helpers/image-urls-to-files'
import useLoadingStore from '@/lib/stores/loading-store'
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

      if (request.imageUrls)
        request.uploadImages = await imageUrlsToFiles(request.imageUrls)

      const { item } = await UPSERT_ITEM(request, { itemId })
      // if (!item)
      //   throw new Error(`Failed to ${isUpdate ? 'update' : 'post'} item`)

      toast(`Your item was ${isUpdate ? 'updated' : 'posted'} successfully!`)

      if (reroute) router.replace(reroute)

      return true
    } catch (error) {
      console.error(error)

      toast(`Something went wrong.`)

      return false
    } finally {
      setLoading(null)
    }
  }

  return { handleUpsertItem }
}
