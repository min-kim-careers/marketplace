'use server'

import {
  _deleteItemByUser,
  _getItemByAlias,
  _getItems,
  _getItemsCountForUser,
  _getProfileExtra,
  _upsertItem,
  _UpsertItemQuery,
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

export const getItemByAlias = async (itemAlias: string) => {
  try {
    const { item } = await _getItemByAlias(itemAlias)
    return item
  } catch (error) {
    console.error(error)
  }
}

export const deleteItem = async (itemAlias: string) => {
  try {
    await _deleteItemByUser(itemAlias)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

type UpsertItemRequest = _UpsertItemQuery
export const upsertItem = async (
  request: UpsertItemRequest,
  itemAlias?: string,
) => {
  try {
    const form = await toFormData(request)
    const res = await _upsertItem(form, { itemAlias })
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
