import { createClient } from '@/utils/supabase/client'
import { Profile } from '@/types/profile'
import { create } from 'zustand'
import {
  loginAction,
  signupAction,
} from './auth-actions'
import { AuthError } from '@supabase/supabase-js'

interface AuthState {
  profile: Profile | null
  
  actions: {
    login: (
      email: string,
      password: string,
    ) => Promise<AuthError | null>
    signup: (
      email: string,
      password: string,
      handle: string,
    ) => Promise<AuthError | null>
    logout: () => void
  }
}

const supabase = createClient()

const useAuthStore = create<AuthState>((set) => {
  supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log(event, session?.user.email)

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
        return
      }

      if (event === 'SIGNED_OUT') {
        set({
          profile: null,
        })
        return
      }
    },
  )

  const login = async (email: string, password: string) => {
    const { profile, error } = await loginAction(
      email,
      password,
    )

    set({ profile })
    return error
  }

  const signup = async (
    email: string,
    password: string,
    handle: string,
  ) => {
    const { profile, error } = await signupAction(
      email,
      password,
      handle,
    )

    set({ profile })
    return error
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
