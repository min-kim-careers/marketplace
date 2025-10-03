'use client'

import { UpdateConstraint, UpdateConstraintMap } from '@/api'
import LoadingDots from '@/components/loading-dots'
import {
  EmailField,
  HandleField,
} from '@/components/profile-update-form/fields'
import { ProfileUpdateFormSchema } from '@/components/profile-update-form/schema'
import UpdateConfirmDialog from '@/components/profile-update-form/update-confirm-dialog'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Form } from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { Label } from '@/components/shadcn/components/ui/label'
import { useProfileHandler } from '@/lib/hooks/use-profile-handler'
import useProfileStore from '@/lib/stores/profile-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

const useCanUpdate = (
  form: UseFormReturn<z.infer<typeof ProfileUpdateFormSchema>>,
) => {
  const [canUpdate, setCanUpdate] = useState(false)
  const watcher = form.watch()
  const pathname = usePathname()

  useEffect(() => {
    setCanUpdate(
      Boolean(
        (watcher.email.confirmed && watcher.email.value.trim()) ||
          (watcher.handle.confirmed && watcher.handle.value.trim()),
      ),
    )
  }, [watcher, pathname])
  return { canUpdate }
}

export default function ProfileDashboard({
  constraints,
}: {
  constraints: UpdateConstraintMap
}) {
  const { profile } = useProfileStore()

  const { handleUpsert } = useProfileHandler()
  const router = useRouter()

  const form = useForm<z.infer<typeof ProfileUpdateFormSchema>>({
    resolver: zodResolver(ProfileUpdateFormSchema),
    defaultValues: {
      email: { value: '', confirmed: false },
      handle: { value: '', confirmed: false },
    },
    mode: 'onChange',
  })

  const { canUpdate } = useCanUpdate(form)

  async function onSubmit(values: z.infer<typeof ProfileUpdateFormSchema>) {
    if (
      await handleUpsert({
        email: values.email.value,
        handle: values.handle.value,
      })
    ) {
      form.reset()
      router.refresh()
    }
  }

  if (!profile)
    return (
      <div className='flex flex-1 items-center justify-center'>
        <div className='flex flex-col gap-2'>
          <p>Loading your profile...</p>
          <LoadingDots />
        </div>
      </div>
    )

  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-4'>
      <Card className='w-full max-w-xl'>
        <CardHeader>
          <CardTitle>Update your Profile</CardTitle>
          <CardDescription>
            View and manage your personal details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id='profileUpdateForm'>
              <div className='flex flex-col gap-4'>
                <FieldFallback
                  props={{
                    constraint: constraints.email,
                    placeholder: profile.email,
                    label: 'Email',
                    fieldName: 'email',
                  }}
                >
                  <EmailField form={form} />
                </FieldFallback>

                <FieldFallback
                  props={{
                    constraint: constraints.handle,
                    placeholder: profile.handle,
                    label: 'Handle',
                    fieldName: 'handle',
                  }}
                >
                  <HandleField form={form} />
                </FieldFallback>
              </div>
              <UpdateConfirmDialog newValues={form.getValues()}>
                <Button disabled={!canUpdate} className='mt-6 w-full'>
                  Update Profile
                </Button>
              </UpdateConfirmDialog>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

const FieldFallback = ({
  children,
  props,
}: {
  children: ReactNode
  props: {
    constraint: UpdateConstraint
    placeholder: string
    label: string
    fieldName: string
  }
}) => {
  const {
    constraint: { canUpdate, nextUpdateInDays, intervalInDays },
    placeholder,
    fieldName,
    label,
  } = props

  if (!canUpdate)
    return (
      <div className='flex flex-col gap-2'>
        <Label>{label}</Label>
        <Input placeholder={placeholder} disabled />
        <Label className='text-black/60'>{`Your ${fieldName} can be updated in ${nextUpdateInDays} days.`}</Label>
      </div>
    )

  return (
    <div>
      {children}
      <Label className='text-black/60'>{`Can be updated again after ${intervalInDays} days`}</Label>
    </div>
  )
}
