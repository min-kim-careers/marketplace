'use server'

import { createClient } from '../server'
import { Item } from '../types/item'

const TABLE_NAME = 'items'

export const getItems = async (
  from: number,
  to: number,
  sortColumn: keyof Item = 'created_at',
) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .range(from, to)
    .order(sortColumn, { ascending: true })

  if (error) {
    console.error(error)
    throw error
  }
  return data
}

export const getTotalCount = async () => {
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

// export const searchItems = async (keywords: string[]) => {
//   const supabase = await createClient()

//   const joinedKeywords = `'${keywords.join(`' | '`)}'`

//   console.log(joinedKeywords);
  
//   const { data, error } = await supabase
//     .from(TABLE_NAME)
//     .select()
//     .textSearch('name_description_category', joinedKeywords)

//   if (error) {
//     console.error(error)
//     throw error
//   }
//   return data
// }
