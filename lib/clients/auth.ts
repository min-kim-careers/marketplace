'use server'

import { clearSession } from '@/lib/helpers/server/clear-session'
import { setSession } from '@/lib/helpers/server/set-session'
import { Profile } from '@/lib/types/profile'
import { makeClient } from '@/lib/utils/client'

export const SIGN_IN_WITH_GOOGLE = async (
  idToken: string,
): Promise<{ profile: Profile }> =>
  await (
    await makeClient()
  )
    .post('/sign-in-with-google')
    .addBody({ idToken })
    .result<{
      profile: Profile
      session: { value: string; expiry: number }
    }>()
    .then(
      async (r) =>
        (await setSession(r.session.value, r.session.expiry)) && {
          profile: r.profile,
        },
    )

export const VERIFY_SESSION = async () =>
  await (await makeClient())
    .post('/verify-session')
    .result<{ userId: string }>({ withSession: true })

export const SIGN_OUT = async () => await clearSession()
