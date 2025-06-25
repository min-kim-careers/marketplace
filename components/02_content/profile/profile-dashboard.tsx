'use client'

import NotFound from '@/app/not-found'
import ProfileUpdate from '@/components/02_content/profile/profile-update'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Item } from '@/lib/interfaces/item'
import useProfileStore from '@/lib/stores/profile-store'
import { StarIcon } from 'lucide-react'

export default function ProfileDashboard() {
  const { profile } = useProfileStore()

  if (!profile) return

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
          <div className='flex flex-col gap-2'>
            <p>Email</p>
            <p>{profile.email}</p>
            <p>Your Rating</p>
            <p>{profile.rating}</p>
            <p>{profile.rating}</p>
          </div>
        </CardContent>
      </Card>

      <ProfileUpdate className='w-full' />
    </div>
  )
}