'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/components/ui/dialog'
import { Input } from '@/components/shadcn/components/ui/input'
import { Label } from '@/components/shadcn/components/ui/label'
import { useState } from 'react'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { signInWithEmailAndPassword } from 'firebase/auth'
import auth from '@/utils/firebase/auth'

export default function AuthDialog({
  trigger
}: {
  trigger: React.ReactNode
}) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { toast } = useToast()
  const [isOpen, setOpen] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
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
      setOpen(false)
    } catch (error) {
      console.error('Error logging in:', error)
      toast({
        description: 'Error logging in. Please try again.'
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Welcome back!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Email</Label>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Password</Label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="col-span-3"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleLogin}>
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
