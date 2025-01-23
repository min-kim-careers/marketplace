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
import { useRouter } from 'next/navigation'
import { login, signup } from '../actions'

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
      return 'Email, password, and handle are required'
    }

    const { error } = await signup(email, password, handle)

    if (error) {
      toast({
        description: error.message,
      })
      return
    }

    toast({
      description: 'Sign up successful',
    })
    await login(email, password)
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
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                name='password'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor='handle'>Handle</Label>
              <Input
                id='handle'
                type='text'
                name='handle'
                placeholder='PcMasterRace'
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
