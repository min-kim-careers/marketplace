'use server'

import { LoginFormSchema } from '@/components/02_main/auth/login/schema'
import { SignupFormSchema } from '@/components/02_main/auth/signup/schema'
import { createClient } from '@/lib/services/supabase/server'
import { z } from 'zod'

export interface AuthResponse {
  success: boolean
  userId?: string
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
      success: false,
    }
  }

  return {
    success: true,
    userId: data.user.id,
  }
}

export const signup = async (
  formData: z.infer<typeof SignupFormSchema>,
): Promise<AuthResponse> => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    console.error(error.message)
    return {
      success: false,
    }
  }

  const userId = data.user?.id

  if (!!!userId) {
    console.error('No used ID found after sign up.')
    return {
      success: false,
    }
  }

  return {
    success: true,
    userId,
  }
}

export const logout = async (): Promise<AuthResponse> => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error.message)
    return { success: false }
  }

  return { success: true }
}
