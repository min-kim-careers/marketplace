import {
  AuthError,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth'
import { Button } from '../shadcn/components/ui/button'
import {
  auth,
  googleProvider,
} from '@/lib/services/firebase/config'
import { toast } from '../shadcn/hooks/use-toast'
import { useLoadingStore } from '@/lib/stores/loading'

export default function SignedOut() {
  const { setLoading } = useLoadingStore()

  const handleSignIn = async () => {
    setLoading(true, 'Signing you in...')
    await setPersistence(auth, browserLocalPersistence)
      .then(() => {
        signInWithPopup(auth, googleProvider)
        toast({
          description: `Signed in successfully.`,
        })
      })
      .catch((error) => {
        const firebaseError = error as AuthError
        switch (firebaseError.code) {
          case 'auth/user-cancelled':
            console.log(
              'User cancelled the sign-in process',
            )
            break
          case 'auth/network-request-failed':
            console.log(
              'Network error, please try again later.',
            )
            break
          case 'auth/invalid-email':
            console.log('The email address is invalid.')
            break
          default:
            console.log(
              'Firebase error:',
              firebaseError.message,
            )
        }
        toast({
          description: `Failed to sign in.`,
        })
      })
      .finally(() => setLoading(false))
  }

  return (
    <span className='flex gap-4'>
      <Button onClick={handleSignIn}>
        Sign In with Google
      </Button>
    </span>
  )
}
