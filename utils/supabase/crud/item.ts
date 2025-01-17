import client from '../client'
import { Item } from '../types/item'

const ITEMS_TABLE = 'items'

export const getItems = async () => {
  const { data: result, error } = await client
    .from(ITEMS_TABLE)
    .select('*')
  if (error) throw error
  return result
}

export const createItem = async (data: Item) => {
  const { data: result, error } = await client
    .from(ITEMS_TABLE)
    .insert([data])
  if (error) throw error
  return result
}

export const getItem = async (id: string) => {
  const { data: result, error } = await client
    .from(ITEMS_TABLE)
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return result
}

export const updateItem = async (
  id: string,
  data: Partial<Item>
) => {
  const { data: result, error } = await client
    .from(ITEMS_TABLE)
    .update(data)
    .eq('id', id)
  if (error) throw error
  return result
}

export const deleteItem = async (id: string) => {
  const { data: result, error } = await client
    .from(ITEMS_TABLE)
    .delete()
    .eq('id', id)
  if (error) throw error
  return result
}
