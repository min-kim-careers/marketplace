'use client'

import { HandleField } from '@/components/00_common/profile-form/fields'
import { ProfileUpdateForm } from '@/components/00_common/profile-form/schema'
import { Button } from '@/components/shadcn/components/ui/button'
import { Form } from '@/components/shadcn/components/ui/form'
import { cn } from '@/components/shadcn/lib/utils'
import { useProfileHandler } from '@/lib/hooks/use-profile-handler'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function ProfileUpdate({
  className,
}: {
  className?: string
}) {
  const [handleConfirmed, setHandleConfirmed] =
    useState(false)
  const { handleUpsert } = useProfileHandler()

  const form = useForm<z.infer<typeof ProfileUpdateForm>>({
    resolver: zodResolver(ProfileUpdateForm),
    defaultValues: {
      handle: '',
    },
  })

  async function onSubmit(
    values: z.infer<typeof ProfileUpdateForm>,
  ) {
    await handleUpsert({ handle: values.handle })

    toast('Your profile was updated successfully!')
  }

  return (
    <div className={cn('border rounded-xl p-6', className)}>
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
    </div>
  )
}
