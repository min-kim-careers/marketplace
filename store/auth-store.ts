import { createClient } from '@/utils/supabase/client'
import { Profile } from '@/utils/supabase/types/profile'
import { create } from 'zustand'

interface AuthState {
  profile: Profile | null
  logout: () => Promise<void>
}

const supabase = createClient()

const useAuthStore = create<AuthState>((set) => {
  supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log(event, session?.user.email)
      const user = session?.user
      set({
        profile: {
          handle: user?.user_metadata.handle,
          email: user?.email || 'No email',
        },
      })
      if (event === 'INITIAL_SESSION') {
      } else if (event === 'SIGNED_IN') {
      } else if (event === 'SIGNED_OUT') {
        set({
          profile: null,
        })
        // } else if (event === 'PASSWORD_RECOVERY') {
      } else if (event === 'TOKEN_REFRESHED') {
        // } else if (event === 'USER_UPDATED') {
      }
    },
  )

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return {
    profile: null,
    logout,
  }
})

export default useAuthStore
