import { LoginFormSchema } from '@/components/content/auth/login/schema'
import { SignupFormSchema } from '@/components/content/auth/signup/schema'
import { createClient } from '@/lib/supabase/client'
import {
  login as serverLogin,
  logout as serverLogout,
  signup as serverSignup,
} from '@/lib/supabase/crud/auth'
import { Profile } from '@/types/profile'
import { z } from 'zod'
import { create } from 'zustand'

interface AuthState {
  profile: Profile | null

  login: (
    formData: z.infer<typeof LoginFormSchema>,
  ) => Promise<boolean>
  signup: (
    formData: z.infer<typeof SignupFormSchema>,
  ) => Promise<boolean>
  logout: () => Promise<boolean>
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
        const metadata = session?.user.user_metadata
        if (metadata) {
          set({
            profile: metadata as Profile,
          })
        }
      } else if (event === 'SIGNED_OUT') {
        set({
          profile: null,
        })
      }
    },
  )

  const login = async (
    formData: z.infer<typeof LoginFormSchema>,
  ) => {
    const { success, message, profile } =
      await serverLogin(formData)

    console.log(message)

    if (success && profile) {
      set({ profile })
    }
    return success
  }

  const signup = async (
    formData: z.infer<typeof SignupFormSchema>,
  ) => {
    const { success, message, profile } =
      await serverSignup(formData)

    console.log(message)

    if (success && profile) {
      set({ profile })
    }
    return success
  }

  const logout = async () => {
    const { success, message } =
      await serverLogout()

    console.log(message)

    if (success) {
      set({ profile: null })
    }
    return success
  }

  return {
    profile: null,
    login,
    signup,
    logout,
  }
})

export default useAuthStore
