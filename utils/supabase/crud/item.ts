'use server'

import { createClient } from '../server'
import { Item } from '../types/item'

const TABLE_NAME = 'items'

export const getItems = async () => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export const insertItem = async (item: Item) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([item])
  if (error) {
    console.error(error)
    throw error
  }
  return data
}
