'use server'

import { LoginFormSchema } from '@/components/content/auth/login/schema'
import { SignupFormSchema } from '@/components/content/auth/signup/schema'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types/profile'
import { z } from 'zod'

interface AuthResponse {
  success: boolean
  message: string
  profile?: Profile
}

export const login = async (
  formData: z.infer<typeof LoginFormSchema>,
): Promise<AuthResponse> => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    console.error(error.message)
    return {
      success: false,
      message: 'Login failed',
    }
  }

  const metadata = data.user.user_metadata

  return {
    success: false,
    message: 'Login successful',
    profile: metadata as Profile
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
      success: false,
      message: 'Sign up failed',
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
      success: false,
      message: 'Sign up failed',
    }
  }

  const metadata = data.user.user_metadata

  return {
    success: false,
    message: 'Sign up successful',
    profile: metadata as Profile
  }
}

export const logout = async (): Promise<AuthResponse> => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error.message)
    return {
      success: false,
      message: 'Log out failed',
    }
  }

  return {
    success: false,
    message: 'Log out successful',
  }
}
