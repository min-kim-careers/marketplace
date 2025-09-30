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
import { hasSession } from '@/lib/helpers/server/has-session'
import { toFormData } from '@/lib/helpers/server/to-form-data'
import { ItemPageParams } from '@/lib/types/item-page-params'

const getItemsFallback = {
  items: [],
  count: 0,
}

export const getItems = async (params: ItemPageParams) => {
  try {
    const excludeUser = await hasSession()

    return await _getItems({
      ...params,
      activeOnly: true,
      ...(excludeUser && { userOption: 'exclude_user' }),
    })
  } catch (error) {
    console.error(error)
    return getItemsFallback
  }
}

export const getUserListings = async (params: ItemPageParams) => {
  try {
    return await _getItems({
      ...params,
      userOption: 'user_only',
      activeOnly: false,
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

export type UpsertItemRequest = _UpsertItemQuery
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
