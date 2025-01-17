import { User } from '@/utils/supabase/types/user'
import client from '../client'

const USERS_TABLE = 'users'

export const createUser = async (user: User) => {
  const { data, error } = await client
    .from(USERS_TABLE)
    .insert([user])

  if (error) {
    throw error
  }

  return data
}

export const getUserByEmail = async (userEmail: string): Promise<User> => {
  const { data, error } = await client
    .from(USERS_TABLE)
    .select('*')
    .eq('email', userEmail)
    .single()

  if (error) {
    throw error
  }

  return data
}
