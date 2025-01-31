'use server'

import { Profile } from '@/types/profile'
import { createClient } from '@/utils/supabase/server'
import { AuthError } from '@supabase/supabase-js'

interface Response {
  error: AuthError | null
  profile: Profile | null
}

export const getProfile = async (
  email: string,
  password: string,
): Promise<Response> => {
  const supabase = await createClient()

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

  const metadata = data.user!.user_metadata

  return {
    error,
    profile: {
      handle: metadata.handle,
      email: metadata.email,
      postcode: metadata.postcode,
      rating: metadata.rating,
      ratingCount: metadata.ratingCount,
      avatarUrl: metadata.avatarUrl,
    },
  }
}

export const createProfile = async (
  email: string,
  password: string,
  handle: string,
): Promise<Response> => {
  const supabase = await createClient()

  const profile: Profile = {
    email,
    handle,
    postcode: undefined,
    avatarUrl: undefined,
    rating: 0,
    ratingCount: 0,
  }

  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: profile,
    },
  })

  return {
    error,
    profile,
  }
}