import {
  serviceSignInWithGoogle,
  serviceSignOut,
} from '@/_gateway/firebase/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { auth, provider } from '@/lib/firebase/config'
import { useLoadingStore } from '@/lib/stores/loading'
import useProfileStore from '@/lib/stores/profile'
import { signInWithPopup, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export const useSignIn = () => {
  const { setProfile } = useProfileStore()
  const { setMessage } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      setMessage('Signing you in')
      const cred = await signInWithPopup(auth, provider)

      const token = await cred.user.getIdToken()

      const { profile } =
        await serviceSignInWithGoogle(token)
      if (profile) setProfile(profile)

      toast({
        description: `Signed in as ${profile.handle}.`
      })

      router.refresh()
    } catch (error) {
      await signOut(auth)
      await serviceSignOut()
    } finally {
      setMessage(null)
    }
  }

  return { handleSignIn }
}
