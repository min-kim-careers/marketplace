'use client'

import { getSessionCookie } from '@/_gateway/firebase/_config/helpers'
import {
  isFallbackRoute,
  ROUTES,
} from '@/lib/constants/routes'
import useProfileStore from '@/lib/stores/profile'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EnforceClientRedirect() {
  const path = usePathname()
  const { profile } = useProfileStore()
  const router = useRouter()

  useEffect(() => {
    const redirectClient = async () => {
      if (!isFallbackRoute(path)) {
        if (!profile) return

        if (!profile?.handle)
          router.replace(ROUTES.PROFILE_COMPLETE)
      }
    }
    
    redirectClient()
  }, [path])

  return null
}
