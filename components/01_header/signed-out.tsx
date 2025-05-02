import { Button } from '../shadcn/components/ui/button'
import { toast } from '../shadcn/hooks/use-toast'
import { useLoadingStore } from '@/lib/stores/loading'

export default function SignedOut() {
  const { setLoading } = useLoadingStore()

  const handleSignIn = async () => {
    setLoading(true, 'Signing you in...')
    try {
      toast({
        description: `Signed in successfully.`,
      })
    } catch (error) {
      toast({
        description: `Failed to sign in.`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className='flex gap-4'>
      <Button onClick={handleSignIn}>
        Sign In with Google
      </Button>
    </span>
  )
}
