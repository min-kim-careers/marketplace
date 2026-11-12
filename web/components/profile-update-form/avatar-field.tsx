'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { Button } from '@/components/shadcn/components/ui/button'
import { Label } from '@/components/shadcn/components/ui/label'
import { useProfileHandler } from '@/lib/hooks/use-profile-handler'
import useProfileStore from '@/lib/stores/profile-store'
import { CircleUserIcon } from 'lucide-react'
import { ChangeEvent, useRef } from 'react'
import { toast } from 'sonner'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_INPUT_MB = 10

export default function AvatarField() {
  const { profile } = useProfileStore()
  const { handleAvatarUpload, handleAvatarRemove } = useProfileHandler()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // reset so selecting the same file again still fires onChange
    e.target.value = ''
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast('Please choose a JPEG, PNG or WebP image.')
      return
    }
    if (file.size > MAX_INPUT_MB * 1024 * 1024) {
      toast(`Image must be smaller than ${MAX_INPUT_MB}MB.`)
      return
    }

    await handleAvatarUpload(file)
  }

  return (
    <div className='flex items-center gap-4'>
      <Avatar className='h-20 w-20'>
        <AvatarImage
          src={profile?.avatarUrl}
          alt='Profile image'
          className='object-cover'
        />
        <AvatarFallback>
          <CircleUserIcon className='h-full w-full' />
        </AvatarFallback>
      </Avatar>

      <div className='flex flex-col gap-2'>
        <Label>Profile image</Label>
        <div className='flex gap-2'>
          <input
            ref={inputRef}
            type='file'
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileChange}
            className='hidden'
          />
          <Button
            type='button'
            variant='outline'
            onClick={() => inputRef.current?.click()}
          >
            {profile?.avatarUrl ? 'Change' : 'Upload'}
          </Button>
          {profile?.avatarUrl && (
            <Button type='button' variant='ghost' onClick={handleAvatarRemove}>
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
