import { _revokeSession } from '@/api/endpoints/auth-firebase'
import { clearSession } from '@/lib/helpers/server/clear-session'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useProfileStore from '@/lib/stores/profile-store'
import { auth } from '@/lib/utils/firebase'

export const globalSignOut = async () => {
  const { setProfile } = useProfileStore()
  const { setUser } = useFirebaseStore()

  try {
    auth.signOut()
    setProfile()
    setUser()
    await _revokeSession()
  } catch (error) {
    console.error(error)
  } finally {
    await clearSession()
  }
}
