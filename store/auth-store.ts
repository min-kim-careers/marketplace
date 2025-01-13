import { create } from 'zustand'
import {
  User,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import auth from '@/utils/firebase/auth'

interface AuthState {
  user: User | null
  logout: () => Promise<void>
}

const useAuthStore = create<AuthState>((set) => {
  onAuthStateChanged(auth, (user) => {
    set({ user: user })
    if (user) {
      console.log('User ID:', user.uid)
    }
  })

  const logout = async () => {
    await signOut(auth)
    set({ user: null })
  }

  return {
    user: null,
    logout
  }
})

export default useAuthStore
