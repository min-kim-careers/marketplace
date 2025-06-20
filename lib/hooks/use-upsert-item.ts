import {
  UPSERT_ITEM,
  UpsertItemRequest,
} from '@/_gateway/api/item/service'
import { ItemFormSchema } from '@/components/02_content/item/form'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { compressedFileFromUrl } from '@/lib/helpers/compress-image-from-url'
import { useLoadingStore } from '@/lib/stores/loading-store'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

export const useUpsertItem = () => {
  const { setLoading } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleUpsertItem = async (
    request: UpsertItemRequest,
    itemId?: string,
  ) => {
    const isUpdate = !!itemId

    try {
      setLoading(
        `${isUpdate ? 'Updating' : 'Posting'} your item`,
        true,
      )

      if (request.imageUrls) {
        request.uploadImages = await Promise.all(
          request.imageUrls
            .filter((url) => url.startsWith('blob:'))
            .map(async (url) => {
              try {
                return await compressedFileFromUrl(url)
              } catch (error) {
                throw error
              }
            }),
        )
      }

      const item = await UPSERT_ITEM(request, itemId)
      if (!item)
        throw new Error(
          `Failed to ${isUpdate ? 'update' : 'post'} item`,
        )

      toast({
        description: `Your item was ${isUpdate ? 'updated' : 'posted'} successfully!`,
      })

      router.replace(APP_ROUTES.PROFILE_LISTINGS.href)
    } catch (error) {
      console.error(error)

      toast({ description: `Something went wrong.` })
    } finally {
      setLoading(null)
    }
  }

  return { handleUpsertItem }
}
