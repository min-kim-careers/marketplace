'use server'

import { createClient } from '@/utils/supabase/server'

export async function login(
  email: string,
  password: string,
) {
  const supabase = await createClient()

  return await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
}

export async function signup(
  email: string,
  password: string,
  handle: string,
) {
  const supabase = await createClient()

  return await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        handle: handle,
      },
    },
  })
}
