'use client'

import { _UpsertItemRequest } from '@/api/endpoints/item'
import { deleteItem, upsertItem } from '@/api/service/item'
import { imageUrlsToFiles } from '@/lib/helpers/image-urls-to-files'
import { Item } from '@/lib/types/item'
import { toast } from 'sonner'
import { useLoadingStore } from '../providers/loading-provider'

interface ItemHandlerState {
  handleUpsert: (
    request: _UpsertItemRequest,
    itemId?: string,
  ) => Promise<boolean>
  handleDelete: (item: Item) => Promise<boolean>
}

export const useItemHandler = (): ItemHandlerState => {
  const { setLoading } = useLoadingStore()

  const handleUpsert = async (request: _UpsertItemRequest, itemId?: string) => {
    const isUpdate = !!itemId
    let toastMsg = ''

    try {
      setLoading(`${isUpdate ? 'Updating' : 'Posting'} your item`, true)

      if (request.imageUrls) {
        request.uploadImages = await imageUrlsToFiles(request.imageUrls)
      }

      if (!(await upsertItem(request, itemId))) {
        throw new Error(`failed to ${isUpdate ? 'update' : 'post'}`)
      }

      toastMsg = `Your item was ${isUpdate ? 'updated' : 'posted'} successfully!`
    } catch (error) {
      console.error(error)
      toastMsg = `Something went wrong.`
      return false
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
    return true
  }

  const handleDelete = async (item: Item) => {
    let toastMsg = ''
    try {
      setLoading('Deleting post', true)

      if (!(await deleteItem(item.id))) {
        throw new Error('failed to delete')
      }

      toastMsg = 'Successfully deleted post'
    } catch (error) {
      console.error(error)
      toastMsg = 'Something went wrong'
      return false
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
    return true
  }

  return { handleUpsert, handleDelete }
}
