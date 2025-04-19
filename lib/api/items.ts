import { Item } from '@/lib/interfaces/item'
import { z } from 'zod'
import { PostFormSchema } from '@/components/02_main/user/post/schema'
import { Profile } from '@/lib/interfaces/profile'

export const getItems = async (
  from: number,
  to: number,
  sort?: keyof Item,
) => {
  return null
}

export const getTotalCount = async () => {
  return null
}

export const insertItem = async (
  formData: z.infer<typeof PostFormSchema>,
  profile: Profile | null,
) => {
  return null
}
