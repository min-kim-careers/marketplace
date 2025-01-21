import supabase from '../config'
import { Item } from '../types/item'

const TABLE_NAME = 'items'

// export const getItems = async () => {
//   const { data: result, error } = await supabase
//     .from(TABLE_NAME)
//     .select('*')
//   if (error) throw error
//   return result
// }

export const insertItem = async (item: Item) => {
  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .insert([item])
  if (error) throw error
  return result
}

// export const getItem = async (id: string) => {
//   const { data: result, error } = await supabase
//     .from(TABLE_NAME)
//     .select('*')
//     .eq('id', id)
//     .single()
//   if (error) throw error
//   return result
// }

// export const updateItem = async (
//   id: string,
//   data: Partial<Item>,
// ) => {
//   const { data: result, error } = await supabase
//     .from(TABLE_NAME)
//     .update(data)
//     .eq('id', id)
//   if (error) throw error
//   return result
// }

// export const deleteItem = async (id: string) => {
//   const { data: result, error } = await supabase
//     .from(TABLE_NAME)
//     .delete()
//     .eq('id', id)
//   if (error) throw error
//   return result
// }
