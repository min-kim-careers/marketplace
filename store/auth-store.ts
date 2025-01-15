import { create } from 'zustand'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import auth from '@/utils/firebase/auth'
import { User as SupabaseUser } from '@/utils/supabase/types/user'
import { getUserByEmail } from '@/utils/supabase/crud/user'
import { setUserInCache } from '@/utils/cache'

interface AuthState {
  firebaseUser: FirebaseUser | null
  supabaseUser: SupabaseUser | null
  logout: () => Promise<void>
}

// const useAuthStore = create<AuthState>((set) => {
  onAuthStateChanged(auth, async (user) => {
    set({ firebaseUser: user })
    console.log('firebaseUser loaded')

    if (user && user.email) {
      let userProfile: SupabaseUser =
        await getUserByEmail(user.email)

      if (userProfile) {
        setUserInCache(user.email, userProfile)
        console.log('user cached')
      }
      
      set({ supabaseUser: userProfile })
      console.log('supabaseUser loaded')
    }
  })

  const logout = async () => {
    await signOut(auth)
    set({ firebaseUser: null, supabaseUser: null })
  }

  return {
    firebaseUser: null,
    supabaseUser: null,
    logout,
  }
})

export default useAuthStore
