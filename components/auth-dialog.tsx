'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/components/ui/dialog'
import { Input } from '@/components/shadcn/components/ui/input'
import { Label } from '@/components/shadcn/components/ui/label'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { signInWithEmailAndPassword } from 'firebase/auth'
import auth from '@/utils/firebase/auth'
import Link from 'next/link'

export default function AuthDialog({
  children
}: {
  children: React.ReactNode
}) {
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const email = form.get('email') as string
    const password = form.get('password') as string

    if (!email || !password) {
      console.log('Email and password are required')
      toast({
        description: 'Email and password are required'
      })
      return
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      toast({
        description: 'Login successful'
      })
    } catch (error) {
      console.error('Error logging in:', error)
      toast({
        description: 'Error logging in. Please try again.'
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Login
          </DialogTitle>
          <DialogDescription>
            Enter your email below to login to your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="signup"
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
