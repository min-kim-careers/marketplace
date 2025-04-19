'use server'

import { LoginFormSchema } from '@/components/02_main/auth/login/schema'
import { SignupFormSchema } from '@/components/02_main/auth/signup/schema'
import { Profile } from '@/lib/interfaces/profile'
import { createClient } from '@/lib/services/supabase/server'
import { z } from 'zod'

interface AuthResponse {
  log: string
  profile: Profile | null
}

export const login = async (
  formData: z.infer<typeof LoginFormSchema>,
): Promise<AuthResponse> => {
  const supabase = await createClient()

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

  if (error) {
    console.error(error.message)
    return {
      log: 'Login failed',
      profile: null,
    }
  }

  const metadata = data.user.user_metadata

  return {
    log: 'Login successful',
    profile: metadata as Profile,
  }
}

export const signup = async (
  formData: z.infer<typeof SignupFormSchema>,
): Promise<AuthResponse> => {
  const supabase = await createClient()

  const profile: Profile = {
    ...formData,
    postcode: undefined,
    avatarUrl: undefined,
    rating: 0,
    ratingCount: 0,
  }

  const { error: signupError } = await supabase.auth.signUp(
    {
      email: formData.email,
      password: formData.password,
      options: {
        data: profile,
      },
    },
  )

  if (signupError) {
    console.error(signupError.message)
    return {
      log: 'Sign up failed',
      profile: null,
    }
  }

  const { data, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

  if (loginError) {
    console.error(loginError.message)
    return {
      log: 'Sign up failed',
      profile: null,
    }
  }

  const metadata = data.user.user_metadata

  return {
    log: 'Sign up successful',
    profile: metadata as Profile,
  }
}

export const logout = async (): Promise<AuthResponse> => {
  const supabase = await createClient()

  const user = await supabase.auth.getUser()

  const profile = user.data.user?.user_metadata as Profile

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error.message)
    return {
      log: 'Log out failed',
      profile: null,
    }
  }

  return {
    log: 'Log out successful',
    profile,
  }
}
