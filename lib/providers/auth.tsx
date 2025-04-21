'use client'

import { Profile } from '@/lib/interfaces/profile'
import { createClient } from '@/lib/services/supabase/client'
import { useEffect } from 'react'
import { fetchProfile } from '../server/profile'
import useAuthStore from '../stores/auth'

const supabase = createClient()

export default function AuthProvider() {
  const { profile, setProfile, hasHydrated } =
    useAuthStore()

  useEffect(() => {
    const { data: listener } =
      supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(event)

          if (
            ['SIGNED_IN', 'INITIAL_SESSION'].includes(event)
          ) {
            if (!hasHydrated && !!profile) return

            const userId = session?.user.id

            if (!!!userId) return

            const { data, success } =
              await fetchProfile(userId)

            if (!success) return

            const newProfile: Profile = data

            setProfile(newProfile)
          }
        },
      )

    return () => listener.subscription.unsubscribe()
  }, [])

  return null
}
