'use server'

import { Profile } from '@/utils/supabase/types/profile'
import { createClient } from '../server'

const TABLE_NAME = 'profiles'

export const getProfile = async (
  email: string,
): Promise<Profile> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    throw error
  }

  return data
}
