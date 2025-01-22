import firebase from '@/utils/firebase/config'
import { getProfileCache } from '@/utils/supabase/crud/profile'
import { ProfileCache } from '@/utils/supabase/types/cache'
import {
  User,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { create } from 'zustand'

const PROFILE_CACHE_KEY = 'profile'
const SESSION_SET_KEY = 'session_set'

interface AuthState {
  user: User | null
  profile: ProfileCache | null
  logout: () => Promise<void>
}

const useAuthStore = create<AuthState>((set) => {
  onAuthStateChanged(firebase, async (user) => {
    return 
    if (!user) return

    set({ user })
    console.log('user authenticated')

    const cache = localStorage.getItem(PROFILE_CACHE_KEY)
    if (cache) {
      const profileCache: ProfileCache = JSON.parse(cache)
      set({ profile: profileCache })
      console.log('profile loaded from cache')
      return
    }

    const profileCache: ProfileCache =
      await getProfileCache(user.uid)
    if (profileCache) {
      localStorage.setItem(
        PROFILE_CACHE_KEY,
        JSON.stringify(profileCache),
      )
      console.log('profile cached')
    }

    set({ profile: profileCache })
    console.log('profile loaded')
  })

  const logout = async () => {
    localStorage.removeItem(PROFILE_CACHE_KEY)
    console.log('session flag cleared')
    localStorage.removeItem(SESSION_SET_KEY)
    console.log('profile cache cleared')
    await signOut(firebase)
    console.log('user signed out')
    set({ user: null, profile: null })
  }

  return {
    user: null,
    profile: null,
    logout,
  }
})

export default useAuthStore
