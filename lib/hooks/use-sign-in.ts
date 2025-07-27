import { SIGN_IN_WITH_GOOGLE } from '@/lib/clients/auth'
import { auth, provider } from '@/lib/firebase/config'
import useLoadingStore from '@/lib/stores/loading-store'
import useProfileStore from '@/lib/stores/profile-store'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useSignIn = () => {
  const { profile, setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      setLoading('Signing you in')
      const cred = await signInWithPopup(auth, provider)

      const token = await cred.user.getIdToken()

      const { profile } = await SIGN_IN_WITH_GOOGLE(token)
      setProfile(profile)
      router.refresh()
    } catch (error) {
      await auth.signOut()
      toast(`Something went wrong.`)
    } finally {
      setLoading(null)
    }

    profile && toast(`Signed in as ${profile.handle}.`)
  }

  return { handleSignIn }
}
