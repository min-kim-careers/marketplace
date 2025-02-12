'use server'

import { z } from 'zod'
import { createClient } from '../server'
import { Item } from '../../../types/type'
import { PostFormSchema } from '@/components/content/user/post/schema'
import { Profile } from '@/types/profile'

const TABLE_NAME = 'items'

export const getItems = async (
  from: number,
  to: number,
  sort: keyof Item = 'created_at',
) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .range(from, to)
    .order(sort, { ascending: true })

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

const getExpiresAt = (expires_in: number): Date => {
  return new Date(
    new Date().setDate(new Date().getDate() + expires_in),
  )
}

export const insertItem = async (
  formData: z.infer<typeof PostFormSchema>,
  profile: Profile | null,
) => {
  if (!profile) {
    return
  }

  const item: Item = {
    ...formData,
    user_email: profile.email,
    user_handle: profile.handle,
    updated_at: new Date(),
    created_at: new Date(),
    expires_at: getExpiresAt(formData.expires_in),
    image_urls: []
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from(TABLE_NAME)
    .insert([item])

  if (error) {
    console.error(error)
    throw error
  }
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
