import { GoogleLogo } from '@/components/google-logo'
import { Button } from '@/components/shadcn/components/ui/button'
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'

export default function SignInWithGoogleButton() {
  const { handleSignInWithGoogle } = useAuthHandler()

  return (
    <Button onClick={handleSignInWithGoogle}>
      <span className='flex items-center gap-2'>
        <GoogleLogo />
        <p>Sign In with Google</p>
      </span>
    </Button>
  )
}
