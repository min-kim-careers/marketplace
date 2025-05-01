'use server'

import { SignInWithEmailFormSchema } from '@/components/02_main/auth/signin/email/schema'
import { SignupFormSchema } from '@/components/02_main/auth/signup/schema'
import { createClient } from '@/lib/services/supabase/server'
import { z } from 'zod'

export interface AuthResponse {
  success: boolean
  userId?: string
}

export const signInWithEmail = async (
  formData: z.infer<typeof SignInWithEmailFormSchema>,
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

export const signUpWithEmail = async (
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
    console.error('No user ID found after sign up.')
    return {
      success: false,
    }
  }

  return {
    success: true,
    userId,
  }
}

export const signInWithGoogle =
  async (): Promise<AuthResponse> => {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.error(error.message)
      return {
        success: false,
      }
    }

    return {
      success: true,
    }
  }

export const signOut = async (): Promise<AuthResponse> => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error(error.message)
    return { success: false }
  }

  return { success: true }
}

export const deleteUser = async (
  userId: string,
): Promise<AuthResponse> => {
  const supabase = await createClient()

  const { error } =
    await supabase.auth.admin.deleteUser(userId)

  if (error) {
    console.error(error.message)
    return { success: false }
  }

  return { success: true }
}
