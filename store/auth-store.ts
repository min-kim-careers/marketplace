import { create } from 'zustand'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import auth from '@/utils/firebase/auth'
import { User as SupabaseUser } from '@/utils/supabase/types/user'
import { getUserByEmail } from '@/utils/supabase/crud/user'

const USER_CACHE_KEY = 'user'

interface AuthState {
  user: FirebaseUser | null
  profile: SupabaseUser | null
  logout: () => Promise<void>
}

const useAuthStore = create<AuthState>((set) => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return

    set({ user })
    console.log('user authenticated')

    if (user && user.email) {
      const cachedUser =
        localStorage.getItem(USER_CACHE_KEY)
      if (cachedUser) {
        const profile: SupabaseUser = JSON.parse(cachedUser)
        set({ profile })
        console.log('profile loaded from cache')
        return
      }

      const profile: SupabaseUser = await getUserByEmail(
        user.email,
      )

      if (profile) {
        localStorage.setItem(
          USER_CACHE_KEY,
          JSON.stringify(profile),
        )
        console.log('profile cached')
      }

      set({ profile })
      console.log('profile loaded')
    }

    set({ user: null, profile: null })
  })

  const logout = async () => {
    localStorage.removeItem(USER_CACHE_KEY)
    console.log('userProfile cache cleared')
    await signOut(auth)
    console.log('user logged out')
    set({ user: null, profile: null })
  }

  return {
    user: null,
    profile: null,
    logout,
  }
})

export default useAuthStore
