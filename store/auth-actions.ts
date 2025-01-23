'use server'

import { Profile } from '@/types/profile'
import { createClient } from '@/utils/supabase/server'
import { AuthError } from '@supabase/supabase-js'

interface Response {
  error: AuthError | null
  profile: Profile | null
}

export async function loginAction(
  email: string,
  password: string,
): Promise<Response> {
  const supabase = await createClient()

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

  return {
    error: error,
    profile: {
      email: data.user?.user_metadata.email,
      handle: data.user?.user_metadata.handle,
    },
  }
}

export async function signupAction(
  email: string,
  password: string,
  handle: string,
): Promise<Response> {
  const supabase = await createClient()

  const { error: signupError } = await supabase.auth.signUp(
    {
      email: email,
      password: password,
      options: {
        data: {
          handle: handle,
        },
      },
    },
  )

  if (signupError) {
    return {
      error: signupError,
      profile: null
    }
  }

  const { profile, error: loginError } = await loginAction(
    email,
    password,
  )

  return {
    error: loginError,
    profile,
  }
}
