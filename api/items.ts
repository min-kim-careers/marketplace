import { 
  getItems as getServerItems, 
  getTotalCount as getServerTotalCount, 
  insertItem as insertServerItem 
} from '@/lib/supabase/items/actions'
import { Item } from '@/types/type'
import { z } from 'zod'
import { PostFormSchema } from '@/components/content/user/post/schema'
import { Profile } from '@/types/profile'

export const getItems = async (
  from: number,
  to: number,
  sort?: keyof Item,
) => {
  return await getServerItems(from, to, sort)
}

export const getTotalCount = async () => {
  return await getServerTotalCount()
}

export const insertItem = async (
  formData: z.infer<typeof PostFormSchema>,
  profile: Profile | null,
) => {
  return await insertServerItem(formData, profile)
}
