'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Input } from '@/components/shadcn/components/ui/input'
import { Label } from '@/components/shadcn/components/ui/label'
import useAuthStore from '@/lib/stores/auth-store'

export default function Profile() {
  const { profile } = useAuthStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          View and manage your personal details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <div className='my-2 grid w-full items-center gap-6'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='handle'>Handle</Label>
              <Input
                disabled
                id='handle'
                placeholder={profile?.handle}
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                placeholder={profile?.email}
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Your new password'
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className='flex justify-end'>
        <Button>Update</Button>
      </CardFooter>
    </Card>
  )
}
