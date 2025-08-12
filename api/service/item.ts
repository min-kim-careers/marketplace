'use server'

import {
  _deleteItemByUser,
  _getItemBySlug,
  _getItems,
  _getItemsCountForUser,
  _getProfileExtra,
  _upsertItem,
  _UpsertItemRequest,
} from '@/api/endpoints'
import { toFormData } from '@/lib/helpers/server/to-form-data'
import { ItemPageParams } from '@/lib/types/item-page-params'

const getItemsFallback = {
  items: [],
  count: 0,
}

export const getItems = async (
  params: ItemPageParams,
  excludeUser: boolean = false,
) => {
  try {
    return await _getItems({
      page: params.page,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      keyword: params.keyword,
      categories: params.categories,
      activeOnly: true,
      ...(excludeUser && { userOption: 'exclude_user' }),
    })
  } catch (error) {
    console.error(error)
    return getItemsFallback
  }
}

export const getUserItems = async (params: ItemPageParams) => {
  try {
    return await _getItems({
      page: params.page,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      keyword: params.keyword,
      categories: params.categories,
      userOption: 'user_only',
    })
  } catch (error) {
    console.error(error)
    return getItemsFallback
  }
}

export const getItemBySlug = async (itemSlug: string) => {
  try {
    const { item } = await _getItemBySlug(itemSlug)
    return item
  } catch (error) {
    console.error(error)
  }
}

export const deleteItem = async (itemSlug: string) => {
  try {
    await _deleteItemByUser(itemSlug)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

type UpsertItemRequest = _UpsertItemRequest
export const upsertItem = async (
  request: UpsertItemRequest,
  itemId?: string,
) => {
  try {
    const form = await toFormData(request)
    const res = await _upsertItem(form, { itemSlug: itemId })
    return res.item
  } catch (error) {
    console.error(error)
  }
}

export const getItemPostRestraints = async () => {
  try {
    const { extra } = await _getProfileExtra()
    const { count } = await _getItemsCountForUser()

    return {
      imageLimit: extra.imageLimit,
      exceededListings: count >= extra.listingLimit,
    }
  } catch (error) {
    console.error(error)
    return {
      imageLimit: 0,
      exceededListings: true,
    }
  }
}
