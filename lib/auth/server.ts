'use server'

import { getSessionCookie } from '@/_gateway/firebase/_config/helpers'
import { serviceVerify } from '@/_gateway/firebase/service'
import '@/app/globals.css'
import { HEADERS } from '@/lib/constants/headers'
import {
  isFallbackRoute,
  ROUTES,
} from '@/lib/constants/routes'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const enforceServerRedirect = async () => {
  const headerList = await headers()
  const path = headerList.get(HEADERS.CURRENT_PATH)
  if (!path) redirect(ROUTES.NOTFOUND)

  if (!isFallbackRoute(path)) {
    const session = await getSessionCookie()
    if (session) {
      const { decodedToken } = await serviceVerify(session)
      // Extreme case: if session is manually deleted
      if (!decodedToken && path !== ROUTES.NOTFOUND)
        redirect(ROUTES.NOTFOUND)

      if (
        !decodedToken.claims.profile_created &&
        path !== ROUTES.PROFILE_COMPLETE
      )
        redirect(ROUTES.PROFILE_COMPLETE)
    }
  }
}
