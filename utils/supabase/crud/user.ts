import { User } from '@/utils/supabase/types/user'
import client from '../client'

export const createUser = async (user: User) => {
  const { data, error } = await client
    .from('users')
    .insert([user])

  if (error) {
    throw error
  }

  return data
}

export const getUserByEmail = async (userEmail: string): Promise<User> => {
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('email', userEmail)
    .single()

  if (error) {
    throw error
  }

  return data
}

export const updateUser = async (
  newUser: User,
  oldUser: User
) => {
  const { data, error } = await client
    .from('users')
    .update(oldUser)
    .eq('email', newUser.email)

  if (error) {
    throw error
  }

  return data
}

export const deleteUser = async (user: User) => {
  const { data, error } = await client
    .from('users')
    .delete()
    .eq('email', user.email)

  if (error) {
    throw error
  }

  return data
}
