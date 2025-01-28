import { Profile } from '@/types/profile'
import { createClient } from '@/utils/supabase/client'
import { create } from 'zustand'
import {
  createProfile,
  fetchProfile,
} from '../utils/supabase/crud/auth'
import { AuthError } from '@supabase/supabase-js'

interface Response {
  error: AuthError | null
}

interface AuthState {
  profile: Profile | null

  actions: {
    login: (
      email: string,
      password: string,
    ) => Promise<Response>
    signup: (
      email: string,
      password: string,
      handle: string,
    ) => Promise<Response>
    logout: () => void
  }
}

const supabase = createClient()

const useAuthStore = create<AuthState>((set) => {
  supabase.auth.onAuthStateChange(
    async (event, session) => {
      // console.log(event, session?.user.email)

      if (
        event === 'SIGNED_IN' ||
        event === 'INITIAL_SESSION'
      ) {
        const user = session?.user
        if (user) {
          set({
            profile: {
              email: user.user_metadata.email,
              handle: user.user_metadata.handle,
            } as Profile,
          })
        }
      } else if (event === 'SIGNED_OUT') {
        set({
          profile: null,
        })
      }
    },
  )

  const login = async (email: string, password: string) => {
    const { profile, error } = await fetchProfile(
      email,
      password,
    )

    set({ profile })
    return { error }
  }

  const signup = async (
    email: string,
    password: string,
    handle: string,
  ) => {
    const { error } = await createProfile(
      email,
      password,
      handle,
    )

    if (error) {
      return { error }
    }

    return await login(email, password)
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return {
    profile: null,
    actions: { login, signup, logout },
  }
})

export default useAuthStore
