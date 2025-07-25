'use server'

import { toFormData } from '@/lib/helpers/to-form-data'
import { UpsertItemRequest } from '@gateway/api/item'

export const buildUpsertItemForm = async (request: UpsertItemRequest) => {
  let placeholder_index = 0
  if (request.imageUrls) {
    request.imageUrls.map((url) =>
      url.startsWith('blob:') ? `{{${placeholder_index++}}}` : url,
    )
  }
  return await toFormData(request)
}
