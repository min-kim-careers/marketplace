'use server'

import { createClient } from '../server'
import { Item } from '../types/item'

const TABLE_NAME = 'items'

export const fetchItems = async (
  from: number,
  to: number,
) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .range(from, to)
  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export const fetchCount = async () => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact', head: true })
    .single()
    
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
