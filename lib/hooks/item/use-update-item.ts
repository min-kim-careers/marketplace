import {
  UPDATE_ITEM,
  UpdateItemRequest,
} from '@/_gateway/api/item/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { compressImageFromUrl } from '@/lib/helpers/compress-image-from-url'
import { useLoadingStore } from '@/lib/stores/loading'
import { useRouter } from 'next/navigation'

export const useUpdateItem = () => {
  const { setLoading } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleUpdateItem = async ({
    itemId,
    request,
    imageUrls,
  }: {
    itemId: string
    request: UpdateItemRequest
    imageUrls: string[]
  }) => {
    try {
      setLoading('Updating your item', true)

      console.log(imageUrls)

      const images = await Promise.all(
        imageUrls
          .filter((v) => v !== null)
          .map(async (url) =>
            url.startsWith('blob:')
              ? await compressImageFromUrl(url)
              : null,
          ),
      )

      const item = await UPDATE_ITEM(
        itemId,
        request,
        images,
      )
      if (!item) throw new Error('Failed to update item')

      toast({
        description: 'Your item was updated successfully!',
      })

      router.refresh()
    } catch (error) {
      toast({ description: `Something went wrong.` })
    } finally {
      setLoading(null)
    }
  }

  return { handleUpdateItem }
}
