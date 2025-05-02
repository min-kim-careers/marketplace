'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/shadcn/components/ui/button'
import { Form } from '@/components/shadcn/components/ui/form'
import {
  EmailField,
  HandleField,
  PasswordField,
} from './fields'
import { SignupFormSchema } from './schema'
import { toast } from '@/components/shadcn/hooks/use-toast'
import { useLoadingStore } from '@/lib/stores/loading'
import { addUser } from '@/lib/api/user'

export default function SignupForm() {
  const { setLoadingMessage } = useLoadingStore()

  const onSubmit = async (
    formData: z.infer<typeof SignupFormSchema>,
  ) => {
    setLoadingMessage('Signing you in...')
    try {
      await addUser({...formData})

      toast({
        description: `Signed in successfully.`,
      })
    } catch (error) {
      toast({
        description: `Failed to sign in.`,
      })
    } finally {
      setLoadingMessage(null)
    }
  }

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      handle: '',
      email: '',
      password: '',
    },
  })

  return (
    <div className='flex flex-col gap-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <EmailField form={form} />
            <PasswordField form={form} />
            <HandleField form={form} />

            <Button type='submit' className='mt-2 w-full'>
              Sign Up
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
