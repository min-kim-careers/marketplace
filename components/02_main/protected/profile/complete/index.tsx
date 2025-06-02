'use client'

import { ProfileCompleteForm } from '@/components/02_main/protected/profile/complete/form'
import { HandleField } from '@/components/02_main/protected/profile/complete/form/fields'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Form } from '@/components/shadcn/components/ui/form'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { useLoadingStore } from '@/lib/stores/loading'
import useProfileStore from '@/lib/stores/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function ProfileComplete() {
  const { setProfile } = useProfileStore()
  const { setMessage } = useLoadingStore()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof ProfileCompleteForm>>(
    {
      resolver: zodResolver(ProfileCompleteForm),
      defaultValues: {
        handle: undefined,
      },
    },
  )

  async function onSubmit(
    values: z.infer<typeof ProfileCompleteForm>,
  ) {
    try {
      setMessage('Creating a new profile...')
      const handle = values.handle

      

      toast({ description: `Welcome ${handle}!` })
    } catch (error) {
      toast({ description: `Something went wrong.` })
    } finally {
      setMessage(null)
    }
  }

  return (
    <div className='flex flex-1 items-center justify-center'>
      <Card>
        <CardHeader>
          <CardTitle>Almost there!</CardTitle>
          <CardDescription>
            Pick a handle to personalise your profile. This
            is how others will see you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-4'>
                <HandleField form={form} />

                <Button
                  type='submit'
                  className='mt-4 w-full'
                >
                  Complete Profile
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
