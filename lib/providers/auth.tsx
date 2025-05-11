'use client'

import { useEffect } from "react"
import useAuthStore from "../stores/auth"


export default function AuthProvider() {
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe(
      (state) => state.profile,
      (profile, prevProfile) => {
        const signedIn = !prevProfile && !!profile

        const signedOut = !!prevProfile && !profile

        if (signedIn) {
          console.log('signed in');
          
        } else if (signedOut) {
          console.log('signed out');

        }
      }
    )

    return () => unsubscribe()
  }, [])

  return null
}
