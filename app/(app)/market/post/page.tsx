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
import { signInWithEmailAndPassword } from 'firebase/auth'
import firebase from '@/utils/firebase/config'
import Link from 'next/link'

export default function PostPage() {
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const email = form.get('email') as string
    const password = form.get('password') as string

    if (!email || !password) {
      console.log('Email and password are required')
      toast({
        description: 'Email and password are required',
      })
      return
    }

    try {
      await signInWithEmailAndPassword(
        firebase,
        email,
        password,
      )
      toast({
        description: 'Login successful',
      })
    } catch (error) {
      console.error('Error logging in:', error)
      toast({
        description: 'Error logging in. Please try again.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Post You Ad</CardTitle>
        <CardDescription>
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
              Post Ad
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
