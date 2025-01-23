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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login } from '../actions'

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const email = form.get('email') as string
    const password = form.get('password') as string

    if (!email || !password) {
      toast({
        description: 'Email and password are required',
      })
    }

    const { error } = await login(email, password)

    if (error) {
      toast({
        description: error.message,
      })
      return
    }

    toast({
      description: 'Logged in successfully',
    })
    router.push(ROUTES.HOME)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
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
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                <Link
                  href='#'
                  className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id='password'
                type='password'
                name='password'
                required
              />
            </div>
            <Button type='submit' className='w-full'>
              Login
            </Button>
          </div>
          <div className='mt-4 text-center text-sm'>
            {`Don't have an account? `}
            <Link
              href={ROUTES.SIGNUP}
              className='underline underline-offset-4'
              onClick={() => {}}
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
