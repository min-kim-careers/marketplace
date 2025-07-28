import { setSession } from '@/lib/helpers/server/set-session'
import { Profile } from '@/lib/types/profile'
import { gateway } from '@/lib/utils/client'

export const SIGN_IN_WITH_GOOGLE = async (idToken: string) =>
  (await gateway())
    .post('/sign-in-with-google')
    .setBody({ idToken })
    .asResult<{
      profile: Profile
      session: { value: string; expiry: number }
    }>()
    .then(async (res) => {
      if (res && (await setSession(res.session.value, res.session.expiry))) {
        return {
          profile: res.profile,
        }
      }
      throw new Error('failed to sign in')
    })

export const VERIFY_SESSION = async () =>
  (await gateway())
    .post('/verify-session')
    .asResult<{ userId: string }>({ withSession: true })

export const REVOKE_SESSION = async () =>
  (await gateway())
    .post('/revoke-session')
    .asResult({ withSession: true })
    .then(() => {})
