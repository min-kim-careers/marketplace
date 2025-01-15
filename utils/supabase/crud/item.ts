import client from '../client'
import { Item } from '../types/item'
import { TABLE_NAME } from '../config'

export const createItem = async (data: Item) => {
  const { data: result, error } = await client
    .from(TABLE_NAME)
    .insert([data])
  if (error) throw error
  return result
}

export const getItem = async (id: string) => {
  const { data: result, error } = await client
    .from(TABLE_NAME)
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
    .from(TABLE_NAME)
    .update(data)
    .eq('id', id)
  if (error) throw error
  return result
}

export const deleteItem = async (id: string) => {
  const { data: result, error } = await client
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)
  if (error) throw error
  return result
}
