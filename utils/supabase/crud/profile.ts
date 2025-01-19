import { Profile } from '@/utils/supabase/types/profile'
import supabase from '../config'
import { ProfileCache } from '../types/cache'

const TABLE_NAME = 'profiles'

export const createProfile = async (profile: Profile) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([profile])

  if (error) {
    throw error
  }

  return data
}

export const getProfileCache = async (uid: string): Promise<ProfileCache> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('uid', uid)
    .single()

  if (error) {
    throw error
  }

  return {
    handle: data.handle,
    email: data.email,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  }
}
