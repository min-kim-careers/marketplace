import {
  UPSERT_ITEM,
  UpsertItemRequest,
} from '@/_gateway/api/item/service'
import { compressedFileFromUrl } from '@/lib/helpers/compress-image-from-url'
import useLoadingStore from '@/lib/stores/loading-store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useUpsertItem = () => {
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const parseImageUrls = async (imageUrls: string[]) =>
    await Promise.all(
      imageUrls
        .filter((url) => url.startsWith('blob:'))
        .map(async (url) => {
          try {
            return await compressedFileFromUrl(url)
          } catch (error) {
            throw error
          }
        }),
    )

  const handleUpsertItem = async (
    request: UpsertItemRequest,
    itemId?: string,
    reroute?: string,
  ) => {
    const isUpdate = !!itemId

    try {
      setLoading(
        `${isUpdate ? 'Updating' : 'Posting'} your item`,
        true,
      )

      if (request.imageUrls)
        request.uploadImages = await parseImageUrls(
          request.imageUrls,
        )

      const item = await UPSERT_ITEM(request, itemId)
      if (!item)
        throw new Error(
          `Failed to ${isUpdate ? 'update' : 'post'} item`,
        )

      toast(
        `Your item was ${isUpdate ? 'updated' : 'posted'} successfully!`,
      )

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
