'use client'

import { HandleField } from '@/components/02_main/profile-update/form/fields'
import { ProfileUpdateForm } from '@/components/02_main/profile-update/form'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Form } from '@/components/shadcn/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUpdateProfile } from '@/lib/hooks/use-update-profile'
import { useToast } from '@/components/shadcn/hooks/use-toast'

export default function ProfileUpdate() {
  const [handleConfirmed, setHandleConfirmed] =
    useState(false)
  const { handleUpdateProfile } = useUpdateProfile()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof ProfileUpdateForm>>({
    resolver: zodResolver(ProfileUpdateForm),
    defaultValues: {
      handle: '',
    },
  })

  async function onSubmit(
    values: z.infer<typeof ProfileUpdateForm>,
  ) {
    await handleUpdateProfile({ handle: values.handle })

    toast({
      description:
        'Your profile was updated successfully!',
    })
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-4'>
                <HandleField
                  confirmed={handleConfirmed}
                  setConfirmed={setHandleConfirmed}
                  form={form}
                />
              </div>
              <Button
                type='submit'
                disabled={!handleConfirmed}
                className='mt-4 w-full'
              >
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
