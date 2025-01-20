'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Input } from '@/components/shadcn/components/ui/input'
import { Label } from '@/components/shadcn/components/ui/label'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { ROUTES } from '@/constants/routes'
import firebase from '@/utils/firebase/config'
import { createProfile as createSupabaseUser } from '@/utils/supabase/crud/profile'
import {
  createUserWithEmailAndPassword as createFirebaseUser,
  deleteUser as deleteFirebaseUser,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const email = form.get('email') as string
    const password = form.get('password') as string
    const handle = form.get('handle') as string

    if (!email || !password || !handle) {
      console.log(
        'Email, password, and handle are required',
      )
      toast({
        description:
          'Email, password, and handle are required',
      })
      return
    }

    let userCredential

    try {
      userCredential = await createFirebaseUser(
        firebase,
        email,
        password,
      )
      firebase.signOut()
    } catch (error) {
      console.error('Error signing up:', error)
      toast({
        description: 'Error signing up. Please try again.',
      })
      return
    }

    try {
      await createSupabaseUser({
        uid: userCredential.user.uid,
        email,
        handle,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      toast({
        description: 'Signup successful',
      })
    } catch (error) {
      if (userCredential) {
        await deleteFirebaseUser(userCredential.user)
      }
      console.error('Error signing up:', error)
      toast({
        description: 'Error signing up. Please try again.',
      })
    }

    router.push(ROUTES.HOME)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Sign Up</CardTitle>
        <CardDescription>
          Fill in the form below to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                name='email'
                placeholder='m@example.com'
                required
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                name='password'
                required
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='handle'>Handle</Label>
              <Input
                id='handle'
                type='text'
                name='handle'
                placeholder='PcMasterRace'
                required
              />
            </div>
            <Button type='submit' className='w-full'>
              Create Account
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
