import { LoginFormSchema } from '@/components/content/auth/login/schema'
import { SignupFormSchema } from '@/components/content/auth/signup/schema'
import { createClient } from '@/lib/supabase/client'
import {
  login as serverLogin,
  logout as serverLogout,
  signup as serverSignup,
} from '@/api/auth'
import { Profile } from '@/interfaces/profile'
import { z } from 'zod'
import { create } from 'zustand'

interface AuthResult {
  handle: string | null
}

interface AuthState {
  profile: Profile | null

  login: (
    formData: z.infer<typeof LoginFormSchema>,
  ) => Promise<AuthResult>
  signup: (
    formData: z.infer<typeof SignupFormSchema>,
  ) => Promise<AuthResult>
  logout: () => Promise<AuthResult>
}

const supabase = createClient()

const useAuthStore = create<AuthState>((set) => {
  supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log(event)

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
  ): Promise<AuthResult> => {
    const { log, profile } = await serverLogin(formData)

    console.log(log)

    if (profile) {
      set({ profile })
      return { handle: profile.handle }
    }

    return { handle: null }
  }

  const signup = async (
    formData: z.infer<typeof SignupFormSchema>,
  ): Promise<AuthResult> => {
    const { log, profile } = await serverSignup(formData)

    console.log(log)

    if (profile) {
      set({ profile })
      return { handle: profile.handle }
    }

    return { handle: null }
  }

  const logout = async (): Promise<AuthResult> => {
    const { log, profile } = await serverLogout()

    console.log(log)

    if (profile) {
      set({ profile: null })
      return { handle: profile.handle }
    }

    return { handle: null }
  }

  return {
    profile: null,
    login,
    signup,
    logout,
  }
})

export default useAuthStore
