'use server'

import { createClient } from '@/utils/supabase/server'

export async function login(
  formData: FormData,
): Promise<string | null> {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    return 'Email and password are required'
  }

  const supabase = await createClient()

  const { error } =
    await supabase.auth.signInWithPassword(data)

  if (error) {
    return error.message
  }
  return null
}

export async function signup(
  formData: FormData,
): Promise<string | null> {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    handle: formData.get('handle') as string,
  }

  if (!data.email || !data.password || !data.handle) {
    return 'Email, password, and handle are required'
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp(data)

  if (error?.message) {
    return error.message
  }
  return null
}
