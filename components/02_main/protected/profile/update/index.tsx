'use client'

import { serviceCheckHandleExists } from '@/_gateway/api/profiles/service'
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
import useProfileStore from '@/lib/stores/profile'
import { CheckCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ProfileUpdate() {
  const { profile } = useProfileStore()
  const [handleConfirmed, setHandleConfirmed] =
    useState(false)
  const [handle, setHandle] = useState('')

  const handleHandleConfirmButton = async () => {
    const handleExists =
      await serviceCheckHandleExists(handle)
    setHandleConfirmed(!handleExists)
  }

  return (
    <div className='flex flex-1 items-center justify-center'>
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
                <div className='flex space-x-2'>
                  <Input
                    id='handle'
                    placeholder={profile?.handle}
                    onChange={(e) =>
                      setHandle(e.target.value)
                    }
                  />
                  <Button
                    onClick={handleHandleConfirmButton}
                    disabled={handleConfirmed || !handle}
                  >
                    {handleConfirmed ? (
                      <CheckCheck />
                    ) : (
                      <span>Confirm</span>
                    )}
                  </Button>
                </div>
              </div>
              <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='postcode'>Location</Label>
                <Input
                  id='postcode'
                  placeholder={'Enter your location'}
                />
              </div>
              {/* <div className='flex flex-col space-y-1.5'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Your new password'
                />
              </div> */}
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex justify-end'>
          <Button disabled={!handleConfirmed}>
            Update
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
