import {
  serviceSignInWithGoogle,
  serviceSignOut,
} from '@/_gateway/firebase/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { auth, provider } from '@/lib/firebase/config'
import { useLoadingStore } from '@/lib/stores/loading'
import useProfileStore from '@/lib/stores/profile'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export const useSignIn = () => {
  const { profile, setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      setLoading('Signing you in')
      const cred = await signInWithPopup(auth, provider)

      const token = await cred.user.getIdToken()

      const newProfile =
        await serviceSignInWithGoogle(token)
      if (newProfile) setProfile(newProfile)

      router.refresh()
    } catch (error) {
      await auth.signOut()
      await serviceSignOut()
      setProfile(null)
      toast({
        description: `Something went wrong.`,
      })
    } finally {
      setLoading(null)
      if (profile)
        toast({
          description: `Signed in as ${profile.handle}.`,
        })
    }
  }

  return { handleSignIn }
}
