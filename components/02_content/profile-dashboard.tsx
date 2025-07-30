'use client'

import Spinner from '@/components/00_common/spinner'
import ProfileUpdate from '@/components/02_content/profile-update'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import useProfileStore from '@/lib/stores/profile-store'

export default function ProfileDashboard() {
  const { profile } = useProfileStore()

  if (!profile) return <Spinner />

  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View and manage your personal details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <p>Email</p>
              <p>{profile.email}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <p>Rating</p>
              <p>{profile.rating}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <p>Rating count</p>
              <p>{profile.ratingCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProfileUpdate className='w-full' />
    </div>
  )
}
