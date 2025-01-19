import firebase from '@/utils/firebase/config'
import { getProfileCache as getProfileCache } from '@/utils/supabase/crud/profile'
import { ProfileCache } from '@/utils/supabase/types/cache'
import {
  User,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { create } from 'zustand'

const PROFILE_CACHE_KEY = 'profile'

interface AuthState {
  user: User | null
  profile: ProfileCache | null
  logout: () => Promise<void>
}

const useAuthStore = create<AuthState>((set) => {
  onAuthStateChanged(firebase, async (user) => {
    if (!user) return

    set({ user })
    console.log('user authenticated')

    if (user && user.email) {
      const cachedUser = localStorage.getItem(
        PROFILE_CACHE_KEY,
      )
      if (cachedUser) {
        const profile: ProfileCache = JSON.parse(cachedUser)
        set({ profile })
        console.log('profile loaded from cache')
        return
      }

      const profileCache: ProfileCache = await getProfileCache(
        user.uid
      )

      if (profileCache) {
        localStorage.setItem(
          PROFILE_CACHE_KEY,
          JSON.stringify(profileCache),
        )
        console.log('profile cached')
      }

      set({ profile: profileCache })
      console.log('profile loaded')
    }

    set({ user: null, profile: null })
  })

  const logout = async () => {
    localStorage.removeItem(PROFILE_CACHE_KEY)
    console.log('userProfile cache cleared')
    await signOut(firebase)
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
